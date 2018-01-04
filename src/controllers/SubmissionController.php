<?php
class SubmissionController extends Controller {
  public function index($formId) {
    try {
      // Find form data
      $f = Form::find($formId, array('include' => array('submissions')));
      $structure = json_decode($f->structure, false);
      $metrics = json_decode($f->metrics, false);

      // Add a "value" attribute to every metric
      for ($i=0; $i<count($metrics); $i++) {
        $metrics[$i]->value = 0;
      }

      // Get column headers
      $headers = $this->walk_elements($structure->elements);
      
      // Get row data
      $rows = [];
      foreach ($f->submissions as $key => $response) {
        // Store the repeat count
        $repeat_count = 0;

        $this_row = [
          'standard' => [],
          'repeats' => []
        ];
        $response_data = json_decode($response->data, true);
        for ($i=0; $i<count($headers); $i++) {
          if ($headers[$i][2]) {
            // We're dealing with a repeated field
            // so use regular expressions
            $this_field = [];
            foreach (array_keys($response_data) as $k) {
              if (preg_match("/^(".$headers[$i][1] . ")$/", $k, $matches)) {
                $value = $response_data[$matches[1]];
                // Record metric
                for ($j=0; $j<count($metrics); $j++) {
                  if ($metrics[$j]->column == $headers[$i][0]) {
                    // Check if we need to match to a specific value
                    if ($metrics[$j]->matches != "") {
                      if (is_array($value)) {
                        if (!in_array(strtolower($metrics[$j]->matches), array_map('strtolower', $value))) continue;
                      }
                      else {
                        if (strcasecmp($metrics[$j]->matches, $value) != 0) continue;
                      }
                    }
                    if ($metrics[$j]->type == 0) { $metrics[$j]->value++; }
                    else { $metrics[$j]->value += $value; }
                  }
                }
                if (is_array($value)) {
                  $value = implode(", ", $value);
                }
                $this_field[] = $value;
              }
            }
            $this_row['standard'][$i] = $this_field;
            $repeat_count = max($repeat_count, count($this_field));
          }
          else {
            $value = $response_data[$headers[$i][1]];
            if (is_array($value)) {
              $value = implode(", ", $value);
            }
            // Record metric
            for ($j=0; $j<count($metrics); $j++) {
              if ($metrics[$j]->column == $headers[$i][0]) {
                // Check if we need to match to a specific value
                if ($metrics[$j]->matches != "") {
                  if (is_array($value)) {
                    if (!in_array(strtolower($metrics[$j]->matches), array_map('strtolower', $value))) continue;
                  }
                  else {
                    if (strcasecmp($metrics[$j]->matches, $value) != 0) continue;
                  }
                }
                if ($metrics[$j]->type == 0) { $metrics[$j]->value++; }
                else { $metrics[$j]->value += $value; }
              }
            }
            $this_row['standard'][$i] = $value;
          }
        }

        // For all repeaters, leave the first one and extract the rest
        for ($i=0; $i<count($this_row['standard']); $i++) {
          if (is_array($this_row['standard'][$i])) {
            $first = array_shift($this_row['standard'][$i]);
            $this_row['repeats'][] = $this_row['standard'][$i];
            $this_row['standard'][$i] = [$first, 0];
          }
        }

        // Convert the repeats array into columns
        $temp_repeats = $this_row['repeats'];
        $num_repeats = count(current($temp_repeats));
        $this_row['repeats'] = [];
        for ($i=0; $i<$num_repeats; $i++) {
          $this_row['repeats'][$i] = array_column($temp_repeats, $i);
        }

        // Add the columns at the beginning
        array_unshift($this_row['standard'], $key+1, $response->created_at->format("d M Y H:i:s"));

        // Add the columns at the end
        array_push($this_row['standard'], html_entity_decode("&pound;") . number_format($response_data["total_price"], 2), strtoupper($response_data["payment_status"]));

        // Record metrics for special columns
        for ($j=0; $j<count($metrics); $j++) {
          switch ($metrics[$j]->column) {
            case "Response":
              // Check if we need to match to a specific value
              if ($metrics[$j]->matches != "") {
                if (strcasecmp($metrics[$j]->matches, $key+1) != 0) continue;
              }
              if ($metrics[$j]->type == 0) { $metrics[$j]->value++; }
              else { $metrics[$j]->value += $key+1; }
              break;
            case "Total Price":
              // Check if we need to match to a specific value
              if ($metrics[$j]->matches != "") {
                if (strcasecmp($metrics[$j]->matches, $response_data["total_price"]) != 0) continue;
              }
              if ($metrics[$j]->type == 0) { $metrics[$j]->value++; }
              else { $metrics[$j]->value += $response_data["total_price"]; }
              break;
            case "Payment Status":
              // Check if we need to match to a specific value
              if ($metrics[$j]->matches != "") {
                if (strcasecmp($metrics[$j]->matches, $response_data["payment_status"]) != 0) continue;
              }
              if ($metrics[$j]->type == 0) { $metrics[$j]->value++; }
              else { $metrics[$j]->value += $response_data["payment_status"]; }
              break;
          }
        }

        // Set the row span of the standard columns
        for ($i=0; $i<count($this_row['standard']); $i++) {
          if (!is_array($this_row['standard'][$i])) {
            $this_row['standard'][$i] = [$this_row['standard'][$i], $repeat_count];
          }
        }

        $rows[] = $this_row;
      }
    
      // Reformat column array
      $headers = array_merge(["Response", "Submission Date"], array_map(function($col) {
        return $col[0];
      }, $headers), ["Total Price", "Payment Status"]);

      // Display any metric involving "Total Price" with currency format
      for ($j=0; $j<count($metrics); $j++) {
        if ($metrics[$j]->column == "Total Price") {
          $metrics[$j]->value = html_entity_decode("&pound;") . number_format($metrics[$j]->value, 2);
        }
      }

      // Render page
      $this->render('forms_responses.html', [
        'title' => $f->name,
        'headers' => $headers,
        'rows' => $rows,
        'values_with_class' => ['UNPAID', 'PAID', 'DECLINED'],
        'metrics' => $metrics
      ]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }

  public function show($formId, $responseIdEnc) {
    echo Submission::find($this->decrypt_string($responseIdEnc))->data;
  }

  public function create($formId) {
    $response = Submission::create([
      "form_id" => $formId,
      "data" => $_POST["json"]
    ]);
    echo $this->encrypt_string($response->id);
  }

  private function walk_elements($arr, $repeater=false) {
    $result = [];
    array_walk($arr, function ($element, $key) use (&$result, $repeater) {
      if (property_exists($element->props, "validation") &&
          property_exists($element->props->validation, "type") &&
          $element->props->validation->type == 4) {
        // First Name fields
        $result[] = [$element->props->label . " (First)", $element->props->id . ($repeater?"_([0-9]+)":"") . "_0", $repeater];
        $result[] = [$element->props->label . " (Last)", $element->props->id . ($repeater?"_([0-9]+)":"") . "_1", $repeater];
      }
      else if (property_exists($element->props, "children")) {
        // Repeater field
        $result = array_merge($result, $this->walk_elements($element->props->children, true));
      }
      else if (property_exists($element->props, "label") && property_exists($element->props, "id")) {
        $result[] = [$element->props->label, $element->props->id . ($repeater?"_([0-9]+)":""), $repeater];
      }
    });
    return $result;
  }

  private function encrypt_string($plaintext) {
    $key = "bCa7h2Gdio7V_u3Tds";
    $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext_raw = openssl_encrypt($plaintext, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
    $hmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
    $ciphertext = base64_encode( $iv.$hmac.$ciphertext_raw );
    return $ciphertext;
  }

  private function decrypt_string($ciphertext) {
    $key = "bCa7h2Gdio7V_u3Tds";
    $c = base64_decode($ciphertext);
    $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
    $iv = substr($c, 0, $ivlen);
    $hmac = substr($c, $ivlen, $sha2len=32);
    $ciphertext_raw = substr($c, $ivlen+$sha2len);
    $original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, $options=OPENSSL_RAW_DATA, $iv);
    $calcmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary=true);
    if (hash_equals($hmac, $calcmac)) {
      return $original_plaintext;
    }
  }

}
?>