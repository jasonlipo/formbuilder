<?php
class PayController extends Controller {
  public function show($formId, $responseIdEnc) {
    $this->render('forms_pay.html', ["id" => $formId, "response" => $responseIdEnc]);
  }

  public function update($formId, $responseIdEnc) {
    $form = Form::find($formId);
    $form_structure = $form->structure();
    $stripe_sk_key = $form_structure->props->stripe_secret_key;
    
    $submission = Submission::from_encrypted($responseIdEnc);
    $submit_data = json_decode($submission->data, false);
    $total_price = $submit_data->total_price;
    
    require_once "../vendor/stripe-php-5.8.0/init.php";
    \Stripe\Stripe::setApiKey($stripe_sk_key);
    $token = $_POST['stripeToken'];

    try {
      $customer = \Stripe\Customer::create(array(
        "source" => $token,
        "description" => $_POST['formpay-cardholder']
      ));

      $charge = \Stripe\Charge::create(array(
        "amount" => floatval($total_price)*100,
        "currency" => "gbp",
        "description" => $form->name,
        "metadata" => ["form_id" => $form->id, "submission_id" => $submission->id],
        "customer" => $customer->id
      ));
    }
    catch (\Stripe\Error\Card $e) {
      $submit_data->payment_status = "declined";
    }
    catch (\Stripe\Error\ApiConnection $e) {
      $submit_data->payment_status = "stripeerror";
    }
    catch (Exception $e) {
      $submit_data->payment_status = "unknown";
    }

    if ($charge->paid === true) {
      $submit_data->payment_status = "paid";
      $submit_data->payment_date = date("Y-m-d H:i:s");
      $submit_data->payment_currency = $charge->currency;
    }

    $submission->data = json_encode($submit_data);
    $submission->save();

    header("Location: " . $form_structure->props->redirect);

  }
}
?>