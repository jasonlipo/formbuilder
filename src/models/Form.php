<?php
class Form extends ActiveRecord\Model {
  static $connection = 'dev';
  static $has_many = array(
    array('submissions')
  );
}
?>