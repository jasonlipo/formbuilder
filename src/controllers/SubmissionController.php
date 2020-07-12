<?php
class SubmissionController extends Controller {
  private $metrics, $special_before, $special_after;

  public function show($formId, $responseIdEnc) {
    echo Submission::from_encrypted($responseIdEnc)->data;
  }

  public function delete($formId, $responseIdEnc) {
    echo Submission::from_encrypted($responseIdEnc)->delete();
  }

  public function create($formId) {
    $response = Submission::create([
      "form_id" => $formId,
      "data" => $_POST["json"]
    ]);
    EmailController::confirm_booking($response);
    echo $response->encrypt_id();
  }

  public function index($formId) {
    try {
      $f = Form::find($formId, array('include' => array('submissions')));
      $structure = $f->structure();
      $this->metrics = json_decode($f->metrics, false);
      
      $this->init_metrics();
      $headers = $this->walk_elements($structure->elements);

      $this->special_before = [];
      $this->special_after = [];
      $rows = [];

      foreach ($f->submissions as $key => $response) {
        $rows[] = $this->submission_table($structure, $headers, $key, $response, true);
      }
    
      $headers = $this->reformat_headers($headers);

      // Render page
      $this->render('forms_responses.html', [
        'title' => $f->name,
        'id' => $f->id,
        'headers' => $headers,
        'rows' => $rows,
        'values_with_class' => ['UNPAID', 'PAID', 'DECLINED'],
        'metrics' => $this->metrics
      ]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }

  public function submission_table($structure, $headers, $key, $response, $special=false) {
    $repeat_count = 1;
    $this_row = ['standard' => [], 'repeats' => []];

    for ($i=0; $i<count($headers); $i++) {
      if ($headers[$i][2]) {
        $this_field = $this->match_repeater_field($response->data(), $headers[$i]);
        $this_row['standard'][$i] = $this_field;
        $repeat_count = max($repeat_count, count($this_field));
      }
      else {
        $this_row['standard'][$i] = $this->match_regular_field($response->data(), $headers[$i]);
      }
    }
    
    $this->extract_first_repeat($this_row);
    $this->rotate_repeats($this_row);
    if ($special) {
      $this->special_columns($structure, $this_row, $response, $key);
    }
    $this->row_span($this_row, $repeat_count);
    return $this_row;     
  }

  private function match_repeater_field($response_data, $to_match) {
    $this_field = [];
    foreach (array_keys($response_data) as $k) {
      if (preg_match("/^(".$to_match[1] . ")$/", $k, $matches)) {
        $value = $response_data[$matches[1]];
        $this->record_metric($value, $to_match[0]);
        if (is_array($value)) {
          $value = implode(", ", $value);
        }
        $this_field[] = $value;
      }
    }
    return $this_field;
  }

  private function match_regular_field($response_data, $to_match) {
    $value = $response_data[$to_match[1]];
    $this->record_metric($value, $to_match[0]);
    if (is_array($value)) {
      $value = implode("<br />", $value);
    }
    return $value;
  }

  private function extract_first_repeat(&$this_row) {
    for ($i=0; $i<count($this_row['standard']); $i++) {
      if (is_array($this_row['standard'][$i])) {
        $first = array_shift($this_row['standard'][$i]);
        $this_row['repeats'][] = $this_row['standard'][$i];
        $this_row['standard'][$i] = [$first, 1];
      }
    }
  }

  private function rotate_repeats(&$this_row) {
    $temp_repeats = $this_row['repeats'];
    $num_repeats = count($temp_repeats) > 0 ? count(current($temp_repeats)) : 0;
    $this_row['repeats'] = [];
    for ($i=0; $i<$num_repeats; $i++) {
      $this_row['repeats'][$i] = array_column($temp_repeats, $i);
    }
  }

  private function special_columns($structure, &$this_row, $response, $key) {
    $this->special_before = [
      "Submission Id" => $response->encrypt_id(),
      "Response" => $key+1,
      "Submission Date" => $response->created_at->format("d M Y H:i:s")
    ];
    if ($structure->props->payment) {
      $this->special_after = [
        "Total Price" => $response->data()["total_price"],
        "Payment Status" => strtoupper($response->data()["payment_status"])
      ];
    }
    else {
      $this->special_after = [];
    }
    $this->special_columns_values($this_row, $this->special_before, $this->special_after);
    $this->special_columns_metrics($this_row);
  }

  private function special_columns_values(&$this_row, $before, $after) {
    foreach (array_reverse($before, true) as $key => $value) {
      array_unshift($this_row['standard'], $value);
    }
    foreach ($after as $key => $value) {
      array_push($this_row['standard'], $value);
    }
  }

  private function special_columns_metrics(&$this_row) {
    $special = array_merge($this->special_before, $this->special_after);
    for ($j=0; $j<count($this->metrics); $j++) {
      if (in_array($this->metrics[$j]->column, array_keys($special))) {
        $val = $special[$this->metrics[$j]->column];
        if ($this->metrics[$j]->matches != "") {
          if (strcasecmp($this->metrics[$j]->matches, $val) != 0) continue;
        }
        if ($this->metrics[$j]->type == 0) { $this->metrics[$j]->value++; }
        else { $this->metrics[$j]->value += $val; }
      }
    }
  }

  private function row_span(&$this_row, $repeat_count) {
    for ($i=0; $i<count($this_row['standard']); $i++) {
      if (!is_array($this_row['standard'][$i])) {
        $this_row['standard'][$i] = [$this_row['standard'][$i], $repeat_count];
      }
    }
  }

  public function reformat_headers($headers) {
    return array_merge(array_keys($this->special_before), array_map(function($col) {
      return $col[0];
    }, $headers), array_keys($this->special_after));
  }

  private function init_metrics() {
    for ($i=0; $i<count($this->metrics); $i++) {
      $this->metrics[$i]->value = 0;
    }
  }

  private function record_metric($value, $to_match) {
    for ($j=0; $j<count($this->metrics); $j++) {
      if ($this->metrics[$j]->column == $to_match) {
        if ($this->metrics[$j]->matches != "") {
          if (is_array($value)) {
            if (!in_array(strtolower($this->metrics[$j]->matches), array_map('strtolower', $value))) continue;
          }
          else {
            if (strcasecmp($this->metrics[$j]->matches, $value) != 0) continue;
          }
        }
        if ($this->metrics[$j]->type == 0 && !empty($value)) { $this->metrics[$j]->value++; }
        else { $this->metrics[$j]->value += str_replace('£', '', $value); }
      }
    }
  }

  public function walk_elements($arr, $repeater=false) {
    $result = [];
    array_walk($arr, function ($element, $key) use (&$result, $repeater) {
      if (property_exists($element->props, "validation") &&
          property_exists($element->props->validation, "type") &&
          $element->props->validation->type == 4) {
        // First Name fields
        $result[] = [$element->props->label . " (First)", $element->props->id . ($repeater?"_([0-9]+)":"") . "_0", $repeater];
        $result[] = [$element->props->label . " (Last)", $element->props->id . ($repeater?"_([0-9]+)":"") . "_1", $repeater];
      }
      else if (property_exists($element->props, "validation") &&
          property_exists($element->props->validation, "type") &&
          $element->props->validation->type == 5) {
        // Address fields
        for ($i=1; $i<=$element->props->validation->address; $i++) {
          $result[] = [$element->props->label . " ($i)", $element->props->id . ($repeater?"_([0-9]+)":"") . "_" . strval($i-1), $repeater];
        }
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

}
?>