<?php
class InstallController extends Controller {
  public function check() {
    $conn = ActiveRecord\ConnectionManager::get_connection("install"); 
    if (!$conn->query("SHOW DATABASES LIKE 'formbuilder'")->rowCount()) {
      $this->render('need_install.html', []);
      exit;
    }
  }

  public function install() {
    $conn = ActiveRecord\ConnectionManager::get_connection("install"); 
    if (!$conn->query("SHOW DATABASES LIKE 'formbuilder'")->rowCount()) {
      $conn->query(file_get_contents("../src/schema.sql"));
      $this->render('install_success.html', []);
    }
    else {
      header("Location: /");
    }
  }
}
?>