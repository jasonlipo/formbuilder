<?php
class Submission extends ActiveRecord\Model {
  static $connection = 'dev';
  static $belongs_to = array(
    array('form')
  );
}
?>