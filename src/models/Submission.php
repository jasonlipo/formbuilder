<?php
class Submission extends ActiveRecord\Model {
  static $connection = 'dev';
  static $belongs_to = array(
    array('form')
  );

  public static function from_encrypted($encID) {
    return Submission::find($this->id_crypt($encID, 'd'));
  }

  public function encrypt_id() {
    return $this->id_crypt($this->id);
  }

  private function id_crypt($string, $action = 'e') {
    $secret_key = 'secret_key';
    $secret_iv = 'secret_iv';
  
    $output = false;
    $encrypt_method = "AES-256-CBC";
    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
  
    if ($action == 'e') {
      $output = base64_encode(openssl_encrypt($string, $encrypt_method, $key, 0, $iv));
    }
    else if ($action == 'd'){
      $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }
    return $output;
  }

  public function data() {
    return json_decode($this->data, true);
  }
}
?>