<?php
class InstallController extends Controller {
  public function check() {
    $conn = ActiveRecord\ConnectionManager::get_connection("install");
    if (!$conn->query("SHOW DATABASES LIKE '".$database_name."'")->rowCount()) {
      $this->render('need_install.html', []);
      exit;
    }
  }

  public function show() {
    $conn = ActiveRecord\ConnectionManager::get_connection("install"); 
    if (!$conn->query("SHOW DATABASES LIKE '".$database_name."'")->rowCount()) {
      $conn->query(file_get_contents("../src/schema.sql"));
      $this->render('install_success.html', []);
    }
    else {
      header("Location: /");
    }
  }
}
?>