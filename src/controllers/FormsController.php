<?php
class FormsController extends Controller {
  public function all() {
    $this->render('forms_all.html', array('forms' => Form::all()));
  }
}
?>