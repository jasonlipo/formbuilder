<?php
class DashboardController extends Controller {
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
}
?>