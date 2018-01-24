<?php
/**
 * PHP and JS Form Builder
 * Main entry script
 * @author Jason Lipowicz
 * @version 0.0.1
 */

require "../src/FormBuilder.php";

$router = new Router();

$router->before('GET', '/(?!install)(.*)', 'InstallController@check');
$router->get('/install', 'InstallController@show');
$router->get('/new', 'FormController@create');
$router->post('/(\d+)/delete', 'FormController@delete');
$router->get('/(\d+)/response/(.+)', 'SubmissionController@show');
$router->post('/(\d+)/submit', 'SubmissionController@create');
$router->post('/(\d+)/structure', 'StructureController@update');
$router->post('/(\d+)/pay/(.+)', 'PayController@update');
$router->post('/(\d+)/metric', 'MetricController@update');

$router->set404(function() {
  header('HTTP/1.1 404 Not Found');
  echo "404 Not Found";
});

$router->run();
?>