<?php
class FormController extends Controller {
  public function create() {
    $form = Form::create([]);
    header("Location: " . $this->variables["build_url"] . "?id=" . $form->id);
  }

  public function index($formId) {
    try {
      Form::find($formId);
      $this->render('forms_build.html', ['id' => $formId]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }  

  public function delete($formId) {
    Form::find($formId)->delete();
  }

  public function copy($formId) {
    $this_form = Form::find($formId);
    $new_structure = $this_form->structure();
    $new_name = $this_form->name . " [COPY]";
    $new_structure->props->name = $new_name;
    $new_form = Form::create([
      "name" => $new_name,
      "structure" => json_encode($new_structure),
      "metrics" => ""
    ]);
    header("Location: " . $this->variables["return_url"]);
  }
}
?>