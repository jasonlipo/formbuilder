<?php
class FormsController extends Controller {
  public function all() {
    $this->render('template.html', array('name' => 'World'));
  }
}
?>