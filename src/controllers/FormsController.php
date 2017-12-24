<?php
class FormsController extends Controller {
  public function index() {
    $this->render('forms_all.html', ['forms' => Form::all()]);
  }

  public function build($formId=-1) {
    if ($formId == -1) {
      header("Location: /build/" . count(Form::all()));
    }
    $this->render('forms_build.html', ['id' => $formId]);
  }
}
?>