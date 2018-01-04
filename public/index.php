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

$router->get('/', 'DashboardController@index');

$router->get('/install', 'InstallController@show');

$router->get('/new', 'FormController@create');
$router->get('/form/(\d+)/build', 'FormController@index');
$router->post('/form/(\d+)/delete', 'FormController@delete');

$router->get('/form/(\d+)/view', 'UIController@index');

$router->get('/form/(\d+)/responses', 'SubmissionController@index');
$router->get('/form/(\d+)/response/(.+)', 'SubmissionController@show');
$router->post('/form/(\d+)/submit', 'SubmissionController@create');

$router->get('/form/(\d+)/structure', 'StructureController@index');
$router->post('/form/(\d+)/structure', 'StructureController@update');

$router->get('/form/(\d+)/pay/(.+)', 'PayController@show');
$router->post('/form/(\d+)/pay/(.+)', 'PayController@update');

$router->post('/form/(\d+)/metric', 'MetricController@update');

$router->set404(function() {
  header('HTTP/1.1 404 Not Found');
  echo "404 not found";
});

$router->run();
?>