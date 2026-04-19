<?php
// Newsletter form handler
header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    
    if ($email) {
        // Here you would typically save to database or send email
        // For now, just return OK
        echo 'OK';
    } else {
        echo 'Неверный формат email';
    }
} else {
    echo 'Метод не разрешён';
}
