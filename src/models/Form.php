<?php
class Form extends ActiveRecord\Model {
  static $connection = 'dev';
  static $has_many = array(
    array('submissions')
  );

  public function metrics() {
    if (is_null($this->metrics)) {
      $this->metrics = "[]";
    }
    return json_decode($this->metrics, true);
  }

  public function structure() {
    return json_decode($this->structure, false);
  }
}
?>