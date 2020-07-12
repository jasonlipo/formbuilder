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
    $rows = [$submission_controller->submission_table($structure, $headers, 0, $submission)];

    $headers = array_map(function($col) {
      return $col[0];
    }, $headers);

    $table = "";
    for ($i=0; $i<count($headers); $i++) {
      $row = $rows[0]["standard"][$i][0];
      if (empty($row)) {
        $row = "<em>No response recorded</em>";
      }
      $table .= "<b>{$headers[$i]}</b><br />{$row}<br /><br />";
    }

    $message = nl2br($props->email_confirmation_message);
    $message = str_replace("{booking_name}", $email_to, $message);
    $message = str_replace("{form_name}", $props->name, $message);
    $message = str_replace("{form_data}", $table, $message);

    self::send_email($props, $confirmation_email, 'Booking Confirmation - ' . $props->name, $message);

    $notification_props = $props;
    $notification_to = $props->confirmation_from_email;
    $notification_props->confirmation_from_email = "web@kinloss.org.uk";
    self::send_email($props, $notification_to, 'Kinloss Forms [' . $props->name . ']', "Submission recorded<br />-----------<br /><br />" . $message, [$confirmation_email, $email_to]);
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

    $message = nl2br($props->pay_confirmation_message);
    $message = str_replace("{booking_name}", $email_to, $message);
    $message = str_replace("{form_name}", $props->name, $message);
    $message = str_replace("{amount}", "&pound;".number_format($total_price, 2), $message);
    $message = str_replace("{transaction}", $response_data->payment_transaction, $message);

    self::send_email($props, $confirmation_email, 'Payment Confirmation - ' . $props->name, $message);
  }

  private static function send_email($props, $to, $subject, $message, $reply_to = false) {

    require_once dirname(dirname(dirname(__DIR__))) . "/lib/email_template.php";
    $mail = new PHPMailer(true);
    try {
      $mail->isSMTP();
      $mail->Host = $props->smtp_server; 
      $mail->SMTPAuth = true;
      $mail->Username = $props->smtp_username;
      $mail->Password = $props->smtp_password;
      $mail->SMTPSecure = 'tls';
      $mail->Port = intval($props->smtp_port);

      $mail->addReplyTo($reply_to ? $reply_to[0] : $props->confirmation_from_email, $reply_to ? $reply_to[1] : $props->confirmation_from_name);
      $mail->setFrom($props->confirmation_from_email, $props->confirmation_from_name);
      $mail->addAddress($to);

      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body    = generate_email($message);

      $mail->send();
    }
    catch (Exception $e) {
      echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }
  }
}
?>