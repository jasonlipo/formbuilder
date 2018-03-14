<?php
require '../vendor/awss3/aws-autoloader.php';
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class FileController extends Controller {
  public function upload($formId) {
    $form = Form::find($formId);
    $structure = $form->structure();

    $bucket = $structure->props->s3_bucket;
    putenv("AWS_ACCESS_KEY_ID=".$structure->props->aws_access_key);
    putenv("AWS_SECRET_ACCESS_KEY=".$structure->props->aws_secret_key);

    if ($_FILES) {
      foreach ($_FILES as $file) {
        $filename = substr(basename($file['name']), 0, strrpos(basename($file['name']), "."));
        $extension = substr(basename($file['name']), strrpos(basename($file['name']), "."));

        try {
          // Create a S3Client
          $s3Client = new S3Client([
            'region' => 'eu-west-2',
            'version' => 'latest'
          ]);
          $path = $formId."/".time()."_".$filename.$extension;
          $result = $s3Client->putObject([
            'Bucket'     => $bucket,
            'Key'        => $path,
            'SourceFile' => $file['tmp_name'],
            'ACL'        => "public-read",
            'ContentType' => mime_content_type($file['tmp_name'])
          ]);
          echo $result['ObjectURL'];
        }
        catch (S3Exception $e) {
          echo "ERROR";
        }
      }
    
    }
  }
}
?>