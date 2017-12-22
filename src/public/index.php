<?php
/**
 * PHP and JS Form Builder
 * Main entry script
 * @author Jason Lipowicz
 * @version 0.0.1
 */

require_once "../includes/database.php";

$conn = ActiveRecord\ConnectionManager::get_connection("development"); 

if ($conn->query("SHOW DATABASES LIKE 'formbuilder'")->rowCount()) {
  header("Location: /forms.php");
}
else {
  header("Location: /install.php");
}
?>