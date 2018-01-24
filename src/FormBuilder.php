<?php
require_once "../src/includes/database.php";
require_once "../src/includes/router.php";
require_once "../src/includes/twig.php";
require_once "../src/includes/controllers.php";

class FormBuilder {
  public static function build($formId) {
    $controller = new FormController();
    $controller->index($formId);
  }

  public static function view($formId) {
    $controller = new UIController();
    $controller->index($formId);
  }

  public static function list($formId) {
    $controller = new DashboardController();
    $controller->index($formId);
  }

  public static function responses($formId) {
    $controller = new SubmissionController();
    $controller->index($formId);
  }

  public static function pay($formId, $responseId) {
    $controller = new PayController();
    $controller->show($formId);
  }
}
?>