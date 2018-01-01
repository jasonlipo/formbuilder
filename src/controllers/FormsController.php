<?php
class FormsController extends Controller {
  public function index() {
    $forms = Form::find('all', array('include' => array('submissions')));
    $data = [];
    foreach ($forms as $f) {
      $data[] = [
        "id" => $f->id,
        "name" => $f->name,
        "submissions" => $f->submissions
      ];
    }
    $this->render('forms_all.html', ['forms' => $data]);
  }

  public function build($formId = -1) {
    if ($formId == -1) {
      $form = Form::create([]);
      header("Location: /build/" . $form->id);
    }
    else {
      try {
        Form::find($formId);
        $this->render('forms_build.html', ['id' => $formId]);
      }
      catch (ActiveRecord\RecordNotFound $e) {
        header("Location: /");
      }
    }
  }

  public function view($formId) {
    try {
      Form::find($formId);
      $this->render('forms_view.html', ['id' => $formId]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }

  public function responses($formId) {
    try {
      // Find form data
      $f = Form::find($formId, array('include' => array('submissions')));
      $structure = json_decode($f->structure, false);

      // Get column headers
      $headers = [];
      array_walk($structure->elements, function ($element, $key) use (&$headers) {
        if (property_exists($element->props, "label") && property_exists($element->props, "id")) {
          if (property_exists($element->props, "validation") && $element->props->validation->type == 4) {
            // First Name fields
            $headers[] = [$element->props->label . " (First)", $element->props->id . "_0"];
            $headers[] = [$element->props->label . " (Last)", $element->props->id . "_1"];
          }
          else {
            $headers[] = [$element->props->label, $element->props->id];
          }
        }
      });
      
      // Get row data
      $rows = [];
      foreach ($f->submissions as $key => $response) {
        $row = [$key+1, $response->created_at->format("d M Y H:i:s")];
        $response_data = json_decode($response->data, false);
        for ($i=0; $i<count($headers); $i++) {
          $row[] = $response_data->{$headers[$i][1]};
        }
        $rows[] = $row;
      }

      // Reformat column array
      $headers = array_merge(["Response", "Submission Date"], array_map(function($col) {
        return $col[0];
      }, $headers));

      // Render page
      $this->render('forms_responses.html', [
        'title' => $f->name,
        'headers' => $headers,
        'rows' => $rows
      ]);
    }
    catch (ActiveRecord\RecordNotFound $e) {
      header("Location: /");
    }
  }

  public function delete($formId) {
    Form::find($formId)->delete();
  }

  public function submit($formId) {
    Submission::create([
      "form_id" => $formId,
      "data" => $_POST["json"]
    ]);
  }


  public function structure($formId) {
    echo Form::find($formId)->structure;
  }

  public function save($formId) {
    $json = json_decode($_POST["json"], true);
    try {
      $form = Form::find($formId);
      $form->name = $json["props"]["name"];
      $form->structure = $_POST["json"];
      $form->save();
    }
    catch (ActiveRecord\RecordNotFound $e) {
      $form = Form::create([
        "name" => $json["props"]["name"],
        "structure" => $_POST["json"]
      ]);
    }
  }
}
?>