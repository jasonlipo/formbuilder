<?php
class Controller {
  public $twig;
  public $variables;

  public function __construct($variables=[]) {
    $this->variables = $variables;
    $loader = new Twig_Loader_Filesystem('../src/views');
    $this->twig = new Twig_Environment($loader);
  }

  protected function render($view, $data) {
    echo $this->twig->render($view, array_merge($data, $this->variables));
  }
}
?>