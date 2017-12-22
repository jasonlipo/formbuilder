<?php
class Controller {
  private $twig;

  public function __construct() {
    $loader = new Twig_Loader_Filesystem('../src/views');
    $this->twig = new Twig_Environment($loader);
  }

  protected function render($view, $data) {
    echo $this->twig->render($view, $data);
  }
}
?>