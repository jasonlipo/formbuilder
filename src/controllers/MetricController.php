<?php
class MetricController extends Controller {
  public function update($formId) {
    $form = Form::find($formId);
    $new_metric = $_POST['data'];
    if (is_null($form->metrics)) {
      $form->metrics = "[]";
    }
    $metrics = json_decode($form->metrics, true);
    $metrics[] = $new_metric;
    $form->metrics = json_encode($metrics);
    $form->save();
  }
}
?>