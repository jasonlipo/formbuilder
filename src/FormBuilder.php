<?php
chdir(dirname(__FILE__));
require_once "includes/database.php";
require_once "includes/router.php";
require_once "includes/twig.php";
require_once "includes/controllers.php";

class FormBuilder {
  public function create($settings) {
    $controller = new FormController($settings);
    $controller->create();
  }

  public function build($formId, $settings) {
    $controller = new FormController($settings);
    $controller->index($formId);
  }

  public function view($formId, $settings) {
    $controller = new UIController($settings);
    $controller->index($formId);
  }

  public function show($settings) {
    $controller = new DashboardController($settings);
    $controller->index();
  }

  public function responses($formId, $settings) {
    $controller = new SubmissionController($settings);
    $controller->index($formId);
  }

  public function pay($formId, $responseId, $settings) {
    $controller = new PayController($settings);
    $controller->show($formId, $responseId);
  }
}
?>