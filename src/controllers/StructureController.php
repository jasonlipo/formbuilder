<?php
class StructureController extends Controller {
  public function index($formId) {
    $f = Form::find($formId, array('include' => array('submissions')));
    $s = $f->structure();

    foreach ($s->elements as $element) {
      // Loop through all Radio and Checkbox elements
      if (isset($element->props->options)) {

        // Loop through all submissions
        foreach ($f->submissions as $key => $value) {
          $submission = json_decode($value->data, true);
          $submission_value = $submission[$element->props->id];
          if (empty($submission_value)) {
            continue;
          }

          // Convert submission value to array to handle multiple selections
          if (!is_array($submission_value)) {
            $submission_value = array($submission_value);
          }

          // Add "taken" property to each element for every submission selection
          foreach ($submission_value as $sv) {
            $element->props->options = array_map(function ($op) use ($sv) {
              if ($op->value == $sv) {
                if (!isset($op->taken)) {
                  $op->taken = 0;
                }
                $op->taken++;
              }
              return $op;
            }, $element->props->options);
          }

        }
      }
    }

    if (!isset($_GET['key']) || $_GET['key'] != "kinlossadmin") {
      $s->props->aws_access_key = "hidden";
      $s->props->aws_secret_key = "hidden";
      $s->props->smtp_password = "hidden";
      $s->props->smtp_username = "hidden";
      $s->props->smtp_server = "hidden";
    }
    echo json_encode($s);
  }

  public function update($formId) {
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