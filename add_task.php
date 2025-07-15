<?php
// add_task.php - Agregar nueva tarea a la base de datos

// Configuración de headers para JSON y CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos - ACTUALIZAR SEGÚN TU HOSTING
$host = 'sql105.infinityfree.com'; // O la IP que te proporcione tu hosting
$dbname = 'if0_38944859_task_manager'; // El nombre real de tu base de datos
$username = 'if0_38944859'; // Tu usuario de base de datos
$password = 'Jesuspro12'; // Tu contraseña de base de datos

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Obtener datos JSON del cuerpo de la petición
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar que se recibió la tarea
    if (!isset($input['task']) || empty(trim($input['task']))) {
        throw new Exception('La tarea no puede estar vacía');
    }
    
    $task = trim($input['task']);
    
    // Validar longitud de la tarea
    if (strlen($task) > 255) {
        throw new Exception('La tarea es demasiado larga (máximo 255 caracteres)');
    }
    
    // Preparar y ejecutar la consulta para insertar la tarea
    $stmt = $pdo->prepare("INSERT INTO tasks (text, created_at) VALUES (?, NOW())");
    $stmt->execute([$task]);
    
    // Obtener el ID de la tarea recién creada
    $taskId = $pdo->lastInsertId();
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Tarea agregada exitosamente',
        'task_id' => $taskId
    ]);
    
} catch (PDOException $e) {
    // Error de base de datos
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    // Otros errores
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>