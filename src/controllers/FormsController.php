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

  public function delete($formId) {
    Form::find($formId)->delete();
  }

  public function submit($formId) {
    Submission::create([
      "form_id" => $formId,
      "data" => $_POST["json"]
    ]);
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