<?php
class FormsController extends Controller {
  public function index() {
    $forms = Form::find('all', array('include' => array('submissions')));
    $data = [];
    foreach ($forms as $f) {
      $data[] = [
        "id" => $f->id,
        "name" => $f->name,
        "submissions" => $f->submissions
      ];
    }
    $this->render('forms_all.html', ['forms' => $data]);
  }

  public function build($formId = -1) {
    if ($formId == -1) {
      $form = Form::create([]);
      header("Location: /build/" . $form->id);
    }
    else {
      try {
        Form::find($formId);
        $this->render('forms_build.html', ['id' => $formId]);
      }
      catch (ActiveRecord\RecordNotFound $e) {
        header("Location: /");
      }
    }
  }

  public function view($formId) {
    try {
      Form::find($formId);
      $this->render('forms_view.html', ['id' => $formId]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }

  public function responses($formId) {
    try {
      // Find form data
      $f = Form::find($formId, array('include' => array('submissions')));
      $structure = json_decode($f->structure, false);

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
                $this_field[] = $response_data[$matches[1]];
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

        // Add the response count and timestamps
        array_unshift($this_row['standard'], $key+1, $response->created_at->format("d M Y H:i:s"));

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
      }, $headers));

      // Render page
      $this->render('forms_responses.html', [
        'title' => $f->name,
        'headers' => $headers,
        'rows' => $rows
      ]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
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

  public function delete($formId) {
    Form::find($formId)->delete();
  }

  public function pay($formId, $responseIdEnc) {
    $this->render('forms_pay.html', ["id" => $formId, "response" => $responseIdEnc]);
  }

  public function response($formId, $responseIdEnc) {
    echo Submission::find($this->decrypt_string($responseIdEnc))->data;
  }

  public function submit($formId) {
    $response = Submission::create([
      "form_id" => $formId,
      "data" => $_POST["json"]
    ]);
    echo $this->encrypt_string($response->id);
  }


  public function structure($formId) {
    echo Form::find($formId)->structure;
  }

  public function save($formId) {
    $json = json_decode($_POST["json"], true);
    try {
      $form = Form::find($formId);
      $form->name = $json["props"]["name"];
      $form->structure = $_POST["json"];
      $form->save();
    }
    catch (ActiveRecord\RecordNotFound $e) {
      $form = Form::create([
        "name" => $json["props"]["name"],
        "structure" => $_POST["json"]
      ]);
    }
  }
}
?>