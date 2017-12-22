<?php
function autoload_controllers($className) {
  $extensions = array(".php", ".class.php", ".inc");
  $paths = explode(PATH_SEPARATOR, get_include_path());
  $className = str_replace("_" , DIRECTORY_SEPARATOR, $className);
  foreach ($paths as $path) {
      $filename = "controllers/" . $path . DIRECTORY_SEPARATOR . $className;
      foreach ($extensions as $ext) {
        if (is_readable($filename . $ext)) {
          require_once $filename . $ext;
          break;
        }
     }    
  }
}

spl_autoload_register('autoload_controllers');
?>