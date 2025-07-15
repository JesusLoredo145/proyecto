<?php
// db_config.php - Configuración centralizada de la base de datos

class Database {
    private $host = 'sql105.infinityfree.com';
    private $dbname = 'task_manager';
    private $username = 'if0_38944859';
    private $password = 'Jesuspro12';
    private $pdo;
    
    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Error de conexión: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    public function closeConnection() {
        $this->pdo = null;
    }
}

// Función helper para obtener la conexión
function getDBConnection() {
    static $database = null;
    if ($database === null) {
        $database = new Database();
    }
    return $database->getConnection();
}

// Función helper para configurar headers JSON
function setJSONHeaders() {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Función helper para enviar respuesta JSON
function sendJSONResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode($data);
    exit;
}

// Función helper para manejar errores
function handleError($e, $defaultMessage = 'Error interno del servidor') {
    if ($e instanceof PDOException) {
        sendJSONResponse([
            'success' => false,
            'message' => 'Error de base de datos: ' . $e->getMessage()
        ], 500);
    } else {
        sendJSONResponse([
            'success' => false,
            'message' => $e->getMessage() ?: $defaultMessage
        ], 400);
    }
}
?>