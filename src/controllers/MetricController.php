<?php
class MetricController extends Controller {
  public function update($formId) {
    $form = Form::find($formId);
    $new_metric = $_POST['data'];
    $metrics = $form->metrics();
    $metrics[] = $new_metric;
    $form->metrics = json_encode($metrics);
    $form->save();
  }

  public function delete($formId, $metricIndex) {
    $form = Form::find($formId);;
    $metrics = (array) $form->metrics();
    array_splice($metrics, $metricIndex, 1);
    $form->metrics = json_encode($metrics);
    $form->save();
  }
}
?>