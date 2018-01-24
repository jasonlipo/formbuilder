<?php
chdir(dirname(__FILE__));
require_once "includes/database.php";
require_once "includes/router.php";
require_once "includes/twig.php";
require_once "includes/controllers.php";

class FormBuilder {
  public static function build($formId) {
    $controller = new FormController();
    $controller->index($formId);
  }

  public static function view($formId) {
    $controller = new UIController();
    $controller->index($formId);
  }

  public static function list() {
    $controller = new DashboardController();
    $controller->index();
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