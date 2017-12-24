<?php
class FormsController extends Controller {
  public function index() {
    $this->render('forms_all.html', ['forms' => Form::all()]);
  }

  public function build($formId = -1) {
    if ($formId == -1) {
      header("Location: /build/" . (count(Form::all()) + 1));
    }
    $this->render('forms_build.html', ['id' => $formId]);
  }

  public function structure($formId) {
    echo Form::find($formId)->structure;
  }

  public function save($formId) {
    $json = json_decode($_POST["json"], true);
    try {
      $form = Form::find($formId);
      $form->structure = $_POST["json"];
      $form->save();
    }
    catch (ActiveRecord\RecordNotFound $e) {
      $form = Form::create([
        "name" => $json["name"],
        "structure" => $_POST["json"]
      ]);
    }
  }
}
?>