<?php
header('Content-Type: application/json');
// Подключение PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$response = ['success' => false, 'message' => '', 'errors' => []];

// Валидация на сервере
$name = trim($_POST['name'] ?? '');
$number = trim($_POST['number'] ?? '');

// Проверка данных
if (empty($name)) {
    $response['errors']['name'] = 'Поле имени обязательно для заполнения';
}

if (empty($number)) {
    $response['errors']['number'] = 'Поле number обязательно для заполнения';
}

// Если есть ошибки, возвращаем их
if (!empty($response['errors'])) {
    echo json_encode($response);
    exit;
}

try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';  // Устанавливаем кодировку
    $mail->Encoding = 'base64';

    // Настройки SMTP (используйте свои)
    $mail->isSMTP();
    $mail->Host = 'sandbox.smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Username = '2d162d8814616c';
    $mail->Password = '3c7737db28bb9f';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 2525;

    // От кого
    $mail->setFrom('dzhienbulatov@bk.ru', 'Your Name');

    // Кому
    $mail->addAddress('pogruzchik-off@mail.ru', 'Recipient Name');

    // Тема письма
    $mail->Subject = 'Новое сообщение с сайта от ' . $name;

    // Тело письма
    $mail->Body = "
        <h2>Новое сообщение с сайта</h2>
        <p><strong>Имя:</strong> {$name}</p>
        <p><strong>Номер телефона:</strong> {$number}</p>
    ";

    $mail->AltBody = "Имя: {$name}\nНомер телефона: {$number}";
    $mail->isHTML(true);

    $mail->send();
    $response['success'] = true;
    $response['message'] = 'Сообщение успешно отправлено';
} catch (Exception $e) {
    $response['message'] = 'Не удалось отправить сообщение. Ошибка: ' . $mail->ErrorInfo;
}

echo json_encode($response);

// require __DIR__ . '/vendor/autoload.php';

// $mail = new PHPMailer\PHPMailer\PHPMailer(true);

// try {
//     // Тестовый режим - письмо не отправляется, а сохраняется
//     $mail->isSMTP();
//     $mail->Host = 'sandbox.smtp.mailtrap.io';
//     $mail->SMTPAuth = true;
//     $mail->Username = '2d162d8814616c';
//     $mail->Password = '3c7737db28bb9f';
//     $mail->SMTPSecure = 'tls';
//     $mail->Port = 2525;

//     $mail->setFrom('from@example.com', 'Mailer');
//     $mail->addAddress('dzhienbulatov@mail.ru', 'Recipient');

//     $mail->isHTML(true);
//     $mail->Subject = 'Test Subject';
//     $mail->Body = 'This is the HTML message body <b>in bold!</b>';
//     $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

//     // Сохраняем письмо в файл вместо отправки
//     $mail->send();
//     file_put_contents('last_email.html', $mail->getSentMIMEMessage());

//     echo json_encode(['success' => true, 'message' => 'Письмо сохранено в last_email.html']);
// } catch (Exception $e) {
//     echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
// }
