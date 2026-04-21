<?php
/**
 * Обработчик формы обратной связи
 * Отправляет данные формы на email администратора
 */

// Конфигурация
$admin_email = 'admin@sit-salsk.ru'; // Замените на ваш email
$site_name = 'ГБПОУ РО "СИТ"';
$success_redirect = '/contacts/?status=success';
$error_redirect = '/contacts/?status=error';

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Location: ' . $error_redirect);
    exit;
}

// Проверка CSRF токена (если используется)
if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
    http_response_code(403);
    header('Location: ' . $error_redirect);
    exit;
}

// Получение и санитизация данных
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$subject = sanitize_input($_POST['subject'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Валидация обязательных полей
$errors = [];

if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Введите корректный email';
}

if (empty($message)) {
    $errors[] = 'Сообщение обязательно для заполнения';
}

if (!empty($errors)) {
    $_SESSION['form_errors'] = $errors;
    header('Location: ' . $error_redirect);
    exit;
}

// Обработка загруженных файлов
$attachments = [];
if (!empty($_FILES['attachments']['name'][0])) {
    $upload_dir = __DIR__ . '/../../uploads/temp/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $allowed_types = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    $max_file_size = 5 * 1024 * 1024; // 5MB
    
    foreach ($_FILES['attachments']['tmp_name'] as $key => $tmp_name) {
        if ($_FILES['attachments']['error'][$key] === UPLOAD_ERR_OK) {
            $file_name = basename($_FILES['attachments']['name'][$key]);
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            
            if (!in_array($file_ext, $allowed_types)) {
                $errors[] = "Недопустимый тип файла: {$file_name}";
                continue;
            }
            
            if ($_FILES['attachments']['size'][$key] > $max_file_size) {
                $errors[] = "Файл слишком большой: {$file_name}";
                continue;
            }
            
            $safe_name = uniqid() . '_' . $file_name;
            $upload_path = $upload_dir . $safe_name;
            
            if (move_uploaded_file($tmp_name, $upload_path)) {
                $attachments[] = $upload_path;
            }
        }
    }
}

if (!empty($errors)) {
    $_SESSION['form_errors'] = $errors;
    header('Location: ' . $error_redirect);
    // Удаляем загруженные файлы при ошибке
    foreach ($attachments as $file) {
        unlink($file);
    }
    exit;
}

// Формирование письма
$headers = [
    'From: ' . $site_name . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

$email_subject = 'Новое сообщение с формы обратной связи: ' . $subject;

$email_body = "Новое сообщение с формы обратной связи\n";
$email_body .= "========================================\n\n";
$email_body .= "От кого: {$name}\n";
$email_body .= "Email: {$email}\n";
$email_body .= "Телефон: {$phone}\n";
$email_body .= "Тема: {$subject}\n\n";
$email_body .= "Сообщение:\n";
$email_body .= "----------------------------------------\n";
$email_body .= "{$message}\n";
$email_body .= "----------------------------------------\n\n";
$email_body .= "IP адрес: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "Дата отправки: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";

// Отправка письма с вложениями
if (!empty($attachments)) {
    $boundary = md5(time());
    
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
    
    $body = "--" . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $email_body . "\r\n";
    
    foreach ($attachments as $file_path) {
        $file_name = basename($file_path);
        $file_content = file_get_contents($file_path);
        $file_encoded = chunk_split(base64_encode($file_content));
        
        $body .= "--" . $boundary . "\r\n";
        $body .= "Content-Type: application/octet-stream; name=\"" . $file_name . "\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $file_encoded . "\r\n";
        
        // Удаляем временный файл
        unlink($file_path);
    }
    
    $body .= "--" . $boundary . "--";
    
    $mail_sent = mail($admin_email, '=?UTF-8?B?' . base64_encode($email_subject) . '?=', $body, implode("\r\n", $headers));
} else {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $mail_sent = mail($admin_email, '=?UTF-8?B?' . base64_encode($email_subject) . '?=', $email_body, implode("\r\n", $headers));
}

// Перенаправление после отправки
if ($mail_sent) {
    header('Location: ' . $success_redirect);
} else {
    header('Location: ' . $error_redirect);
}

exit;

/**
 * Санитизация входных данных
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Генерация CSRF токена
 */
function generate_csrf_token() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Проверка CSRF токена
 */
function verify_csrf_token($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
