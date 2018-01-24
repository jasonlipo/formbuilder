<?php
class Controller {
  public $twig;
  public $path;

  public function __construct($path="") {
    $this->path = $path;
    $loader = new Twig_Loader_Filesystem('../src/views');
    $this->twig = new Twig_Environment($loader);
  }

  protected function render($view, $data) {
    echo $this->twig->render($view, array_merge($data, ['path' => $this->path]));
  }
}
?>