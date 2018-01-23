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

    $message = "Dear Member ---<br /><br />";
    $message .= "This email is confirmation that we have received your details for " . $props->name . ".<br /><br />";
    $message .= $props->email_confirmation_message . "<br /><br />Here are the details you have submitted: <br /><br />";
    $message .= $table . "<br /><br />";
    $message .= "<b>NOTICE: This email is not confirmation of payment, you will receive a separate email for this.</b><br /><br />";
    $message .= "Kind Regards,<br />Mill Hill Synagogue";

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
      $mail->addAddress($confirmation_email);

      $mail->isHTML(true);
      $mail->Subject = 'Booking Confirmation - ' . $props->name;
      $mail->Body    = $message;

      $mail->send();
    }
    catch (Exception $e) {
      echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }
  }
}
?>