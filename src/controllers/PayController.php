<?php
class PayController extends Controller {
  public function show($formId, $responseIdEnc) {
    $this->render('forms_pay.html', ["id" => $formId, "response" => $responseIdEnc]);
  }

  public function update($formId, $responseIdEnc) {
    $form = Form::find($formId);
    $form_structure = $form->structure();
    
    $submission = Submission::from_encrypted($responseIdEnc);
    $submit_data = json_decode($submission->data, false);
    $total_price = $submit_data->total_price;
    $this->stripe_init($form_structure);

    try {
      $customer = $this->stripe_create_customer($_POST['stripeToken'], $_POST['formpay-cardholder']);
      $charge = $this->stripe_create_charge($form, $submission, $customer, $total_price);
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
  
  private function stripe_init($form_structure) {
    $stripe_sk_key = $form_structure->props->stripe_secret_key;
    require_once "../vendor/stripe-php-5.8.0/init.php";
    \Stripe\Stripe::setApiKey($stripe_sk_key);
  }

  private function stripe_create_customer($token, $cardholder) {
    return \Stripe\Customer::create(array(
      "source" => $token,
      "description" => $cardholder
    ));
  }

  private function stripe_create_charge($form, $submission, $customer, $price) {
    return \Stripe\Charge::create(array(
      "amount" => floatval($price)*100,
      "currency" => "gbp",
      "description" => $form->name,
      "metadata" => ["form_id" => $form->id, "submission_id" => $submission->id],
      "customer" => $customer->id
    ));
  }
}
?>