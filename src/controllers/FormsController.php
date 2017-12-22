<?php
class FormsController extends Controller {
  public function index() {
    $this->render('forms_all.html', ['forms' => Form::all()]);
  }

  public function build() {
    $this->render('forms_build.html', []);
  }
}
?>