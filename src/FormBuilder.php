<?php
chdir(dirname(__FILE__));
require_once "includes/database.php";
require_once "includes/router.php";
require_once "includes/twig.php";
require_once "includes/controllers.php";

class FormBuilder {
  private $path;

  public function __construct($path) {
    $this->path = trim($path, "/");
  }

  public function build($formId) {
    $controller = new FormController($this->path);
    $controller->index($formId);
  }

  public function view($formId) {
    $controller = new UIController($this->path);
    $controller->index($formId);
  }

  public function list() {
    $controller = new DashboardController($this->path);
    $controller->index();
  }

  public function responses($formId) {
    $controller = new SubmissionController($this->path);
    $controller->index($formId);
  }

  public function pay($formId, $responseId) {
    $controller = new PayController($this->path);
    $controller->show($formId);
  }
}
?>