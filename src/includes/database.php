<?php

require_once '../vendor/php-activerecord/ActiveRecord.php';
require_once '../vendor/phpdotenv/Dotenv.php';
require_once '../vendor/phpdotenv/Loader.php';

$dotenv = new Dotenv\Dotenv(dirname(dirname(__DIR__)));
$dotenv->load();

$database_name = getenv('DATABASE_NAME') !== false ? getenv('DATABASE_NAME') : "formbuilder";
$database_host = getenv('DATABASE_HOST') !== false ? getenv('DATABASE_HOST') : "127.0.0.1";

ActiveRecord\Config::initialize(function($cfg) use ($database_name, $database_host) {
  $cfg->set_model_directory('../src/models');
  $cfg->set_connections(array(
    'install' => 'mysql://'.getenv('DATABASE_USER').':'.getenv('DATABASE_PASSWORD').'@'.$database_host,
    'dev' => 'mysql://'.getenv('DATABASE_USER').':'.getenv('DATABASE_PASSWORD').'@'.$database_host.'/'.$database_name
  ));
});

?>
