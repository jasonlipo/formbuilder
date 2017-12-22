<?php

require_once '../vendor/php-activerecord/ActiveRecord.php';
require_once '../vendor/phpdotenv/Dotenv.php';
require_once '../vendor/phpdotenv/Loader.php';

$dotenv = new Dotenv\Dotenv("../");
$dotenv->load();

ActiveRecord\Config::initialize(function($cfg) {
  $cfg->set_model_directory('../src/models');
  $cfg->set_connections(array(
    'install' => 'mysql://'.$_ENV['DATABASE_USER'].':'.$_ENV['DATABASE_PASSWORD'].'@127.0.0.1',
    'dev' => 'mysql://'.$_ENV['DATABASE_USER'].':'.$_ENV['DATABASE_PASSWORD'].'@127.0.0.1/formbuilder'
  ));
});

?>