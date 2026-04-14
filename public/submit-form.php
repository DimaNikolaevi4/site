<?php
/**
 * Обработчик формы обратной связи для хостинга Beget
 * 
 * Разместите этот файл в корне сайта как submit-form.php
 */

// Настройки
$adminEmail = 'info@sit-saljsk.rf'; // Реальный email для заявок
$maxFileSize = 5 * 1024 * 1024; // 5 МБ
$allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
$uploadDir = __DIR__ . '/uploads/forms/';

// Создаём директорию для загрузок, если не существует
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Функция для безопасного ответа в JSON
function jsonResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Неверный метод запроса');
}

// Проверка honeypot (защита от спама)
if (!empty($_POST['honeypot'])) {
    // Тихо игнорируем спам-ботов
    jsonResponse(true, 'Сообщение отправлено');
}

// Получаем и очищаем данные
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Валидация обязательных полей
$errors = [];

if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
} elseif (strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Имя должно быть от 2 до 100 символов';
}

if (empty($email)) {
    $errors[] = 'Email обязателен для заполнения';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный формат email';
}

if (empty($message)) {
    $errors[] = 'Сообщение обязательно для заполнения';
} elseif (strlen($message) < 10 || strlen($message) > 5000) {
    $errors[] = 'Сообщение должно быть от 10 до 5000 символов';
}

if (!empty($errors)) {
    jsonResponse(false, implode(', ', $errors));
}

// Обработка загруженного файла
$fileName = '';
$fileSize = '';

if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['attachment'];
    
    // Проверка размера
    if ($file['size'] > $maxFileSize) {
        jsonResponse(false, 'Файл слишком большой (макс. 5 МБ)');
    }
    
    // Проверка расширения
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExtensions)) {
        jsonResponse(false, 'Недопустимый тип файла');
    }
    
    // Проверка MIME-типа
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png'
    ];
    
    if (!in_array($mimeType, $allowedMimes)) {
        jsonResponse(false, 'Недопустимый тип файла');
    }
    
    // Генерируем уникальное имя файла
    $newFileName = uniqid('form_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
    $uploadPath = $uploadDir . $newFileName;
    
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        jsonResponse(false, 'Ошибка при загрузке файла');
    }
    
    $fileName = $newFileName;
    $fileSize = round($file['size'] / 1024, 2) . ' КБ';
}

// Формируем письмо
$subject = 'Новое сообщение с сайта ГБПОУ РО "СИТ"';
$date = date('d.m.Y H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Неизвестно';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Неизвестно';

$body = "
<h2>Новое сообщение с формы обратной связи</h2>
<p><strong>Дата:</strong> {$date}</p>
<p><strong>IP:</strong> {$ip}</p>
<hr>
<p><strong>Имя:</strong> {$name}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Сообщение:</strong></p>
<p>{$message}</p>
";

if ($fileName) {
    $body .= "<hr><p><strong>Прикреплённый файл:</strong> {$fileName} ({$fileSize})</p>";
}

// Отправка письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: no-reply@sit-saljsk.rf\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($adminEmail, $subject, $body, $headers)) {
    // Логирование успешной отправки
    $logEntry = sprintf(
        "[%s] Успешно: %s <%s>, IP: %s, Файл: %s\n",
        $date,
        $name,
        $email,
        $ip,
        $fileName ?: 'нет'
    );
    file_put_contents(__DIR__ . '/forms.log', $logEntry, FILE_APPEND);
    
    jsonResponse(true, 'Сообщение успешно отправлено! Спасибо за обращение.');
} else {
    jsonResponse(false, 'Ошибка при отправке письма. Попробуйте позже.');
}
?>
