<?php
//Nooraldeen Alsmady

require './Database.php';

class Service {
    public function deleteItem($id) {
        $dbObject = new Database();
        $dbConnection = $dbObject->connect();

        $sql = "DELETE FROM item WHERE iId = ?";

        $stmp = $dbConnection->prepare($sql);
        return $stmp->execute([$id]);
    }

    public function editItem($id, $name, $price, $description) {
        $dbObject = new Database();
        $dbConnection = $dbObject->connect();

        $sql = "UPDATE item SET Iname = ?, Sprice = ?, Idescription = ? WHERE iId = ?";

        $stmp = $dbConnection->prepare($sql);
        return $stmp->execute([$name, $price, $description, $id]);
    }

    public function insertItem($name, $price, $description) {
        $dbObject = new Database();
        $dbConnection = $dbObject->connect();

        $sql = "INSERT INTO item (Iname, Sprice, Idescription) VALUES (?, ?, ?)";

        $stmp = $dbConnection->prepare($sql);
        return $stmp->execute([$name, $price, $description]);
    }

    public function searchItems($query) {
        $dbObject = new Database();
        $dbConnection = $dbObject->connect();

        $sql = "SELECT * FROM item WHERE iId = ? OR Iname LIKE ?";
        
        // Attempt to convert query to an integer for ID match
        $id = is_numeric($query) ? (int) $query : 0;
        $name = "$query%";

        $stmp = $dbConnection->prepare($sql);
        $stmp->execute([$id, $name]);
        return $stmp->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>