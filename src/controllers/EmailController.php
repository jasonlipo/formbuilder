<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/PHPMailer-6.0.3/Exception.php';
require '../vendor/PHPMailer-6.0.3/PHPMailer.php';
require '../vendor/PHPMailer-6.0.3/SMTP.php';

class EmailController extends Controller {
  public static function confirm_booking(Submission $submission) {
    $response_data = json_decode($submission->data, true);
    $structure = json_decode($submission->form->structure, false);
    $props = $structure->props;
    $confirmation_email = $response_data[$props->email_confirmation];
    
    if (!empty($props->email_to)) {
      if (isset($response_data[$props->email_to])) {
        $email_to = $response_data[$props->email_to];
      }
      else {
        $email_to = $response_data[$props->email_to . "_0"] . " " . $response_data[$props->email_to . "_1"];
      }
    }
    else {
      $email_to = "Guest";
    }

    $submission_controller = new SubmissionController();
    $headers = $submission_controller->walk_elements($structure->elements);
    $rows = [$submission_controller->submission_table($headers, 0, $submission)];

    $headers = array_map(function($col) {
      return $col[0];
    }, $headers);

    $table = $submission_controller->twig->render('response_table.html', [
      'headers' => $headers,
      'rows' => $rows
    ]);

    $message = "Dear {$email_to},<br /><br />";
    $message .= "This email is confirmation that we have received your details for {$props->name}.<br /><br />";
    $message .= "{$props->email_confirmation_message}<br /><br />Here are the details you have submitted: <br /><br />";
    $message .= "{$table}<br /><br />";
    if ($response_data["total_price"] > 0) {
      $message .= "<b>This email is not confirmation of payment, you will receive a separate email for this.</b><br /><br />";
    }
    $message .= "Kind Regards,<br />Mill Hill Synagogue";

    self::send_email($props, $confirmation_email, 'Booking Confirmation - ' . $props->name, $message);
  }

  public static function confirm_payment(Submission $submission) {
    $response_data = json_decode($submission->data, true);
    $total_price = $response_data["total_price"];
    $structure = json_decode($submission->form->structure, false);
    $props = $structure->props;
    $confirmation_email = $response_data[$props->email_confirmation];

    if (!empty($props->email_to)) {
      if (isset($response_data[$props->email_to])) {
        $email_to = $response_data[$props->email_to];
      }
      else {
        $email_to = $response_data[$props->email_to . "_0"] . " " . $response_data[$props->email_to . "_1"];
      }
    }
    else {
      $email_to = "Guest";
    }

    $message = "Dear {$email_to},<br /><br />";
    $message .= "This email is confirmation that we have received your payment for {$props->name}.<br /><br />";
    $message .= "<b>You have paid &pound;".number_format($total_price, 2).".</b><br /><br />";
    $message .= "Kind Regards,<br />Mill Hill Synagogue";

    self::send_email($props, $confirmation_email, 'Payment Confirmation - ' . $props->name, $message);
  }

  private static function send_email($props, $to, $subject, $message) {

    $mail = new PHPMailer(true);
    try {
      $mail->isSMTP();
      $mail->Host = $props->smtp_server; 
      $mail->SMTPAuth = true;
      $mail->Username = $props->smtp_username;
      $mail->Password = $props->smtp_password;
      $mail->SMTPSecure = 'tls';
      $mail->Port = intval($props->smtp_port);

      $mail->setFrom('admin@shul.co.uk', 'Mill Hill Synagogue');
      $mail->addAddress($to);

      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body    = $message;

      $mail->send();
    }
    catch (Exception $e) {
      echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }
  }
}
?>