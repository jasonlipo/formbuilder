<?php
/**
 * PHP and JS Form Builder
 * Main entry script
 * @author Jason Lipowicz
 * @version 0.0.1
 */

require_once "../src/includes/database.php";
require_once "../src/includes/router.php";
require_once "../src/includes/twig.php";
require_once "../src/includes/controllers.php";

$router = new Router();

$router->before('GET', '/(?!install)(.*)', 'InstallController@check');

$router->get('/', 'FormsController@index');
$router->get('/install', 'InstallController@install');
$router->get('/new', 'FormsController@build');

$router->get('/form/(\d+)/build', 'FormsController@build');
$router->get('/form/(\d+)/view', 'FormsController@view');

$router->get('/form/(\d+)/structure', 'FormsController@structure');
$router->post('/form/(\d+)/structure', 'FormsController@save');

$router->set404(function() {
  header('HTTP/1.1 404 Not Found');
  echo "404 not found";
});

$router->run();
?>