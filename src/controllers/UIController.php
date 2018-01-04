<?php
class UIController extends Controller {
  public function index($formId) {
    try {
      Form::find($formId);
      $this->render('forms_view.html', ['id' => $formId]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }
}
?>