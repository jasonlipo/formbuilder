<?php
class InstallController extends Controller {
  public function check() {
    $conn = ActiveRecord\ConnectionManager::get_connection("install"); 
    if (!$conn->query("SHOW DATABASES LIKE 'formbuilder'")->rowCount()) {
      $conn->query(file_get_contents("../src/schema.sql"));
      echo "Installing...";
      exit;
    }
  }
}
?>