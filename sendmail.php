<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Подключение PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method Not Allowed']));
}

require 'vendor/autoload.php';

$response = ['success' => false, 'message' => '', 'errors' => []];
$name = trim($_POST['name'] ?? '');
$number = trim($_POST['number'] ?? '');

// Валидация
if (empty($name)) $response['errors']['name'] = 'Введите имя';
if (empty($number)) $response['errors']['number'] = 'Введите номер';

if (!empty($response['errors'])) {
    echo json_encode($response);
    exit;
}

try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    
    // Настройки Mailtrap
    $mail->isSMTP();
    $mail->Host = 'sandbox.smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Username = '78556994972052';
    $mail->Password = '0c758e9c835a3b';
    $mail->Port = 2525;
    $mail->SMTPSecure = 'tls';

    $mail->setFrom('dzhienbulatov@bk.ru', 'Site Form');
    $mail->addAddress('dzienbulatovrail@gmail.com'); // Исправьте на свой email
    
     // Тема письма
    $mail->Subject = 'Новое сообщение с сайта от ' . $name;

    // Тело письма
    $mail->Body = "
        <h2>Новое сообщение с сайта</h2>
        <p><strong>Имя:</strong> {$name}</p>
        <p><strong>Номер телефона:</strong> {$number}</p>
    ";
    $mail->isHTML(true);

    $mail->send();
    $response['success'] = true;
    $response['message'] = 'Данные отправлены!';
} catch (Exception $e) {
    $response['message'] = "Ошибка: {$e->getMessage()}";
}

echo json_encode($response);