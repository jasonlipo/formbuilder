<?php
/**
 * PHP and JS Form Builder
 * Main entry script
 * @author Jason Lipowicz
 * @version 0.0.1
 */

require_once "includes/database.php";
require_once "includes/router.php";
require_once "includes/twig.php";
require_once "includes/controllers.php";

$conn = ActiveRecord\ConnectionManager::get_connection("development"); 

if ($conn->query("SHOW DATABASES LIKE 'formbuilder'")->rowCount()) {
  
  $router = new \Bramus\Router\Router();

  $router->get('', 'FormsController@all');

  $router->set404(function() {
    header('HTTP/1.1 404 Not Found');
    echo "404 not found";
  });

  $router->run();

}
else {
  header("Location: /install.php");
}
?>