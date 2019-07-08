<?php
class StructureController extends Controller {
  public function index($formId) {
    $s = Form::find($formId)->structure();
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