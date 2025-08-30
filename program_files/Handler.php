<?php
//Nooraldeen Alsmady

require './Service.php';

$service = new Service();

// Get the POST data
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);
$type = $data['type'] ?? '';

$response = ["success" => false];

// Determine the action based on the 'type' variable
switch ($type) {
    case 'delete':
        $id = $data['iId'] ?? null;
        if ($id) {
            $response["success"] = $service->deleteItem($id);
        }
        break;

    case 'edit':
        $id = $data['id'] ?? null;
        $name = $data['name'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? 0;
        if ($id) {
            $response["success"] = $service->editItem($id, $name, $price, $description);
        }
        break;

    case 'insert':
        $name = $data['name'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? 0;
        $response["success"] = $service->insertItem($name, $price, $description);
        break;

    case 'search':
        $query = $data['query'] ?? '';
        $response = $service->searchItems($query);
        break;

    default:
        $response["error"] = "Invalid action type";
        break;
}

echo json_encode($response);

?>