<?php
//Nooraldeen Alsmady

class Database
{

    public function connect()
    {
        $dbHost = "localhost:3306";
        $dbName = "project_company";
        $dbUser = "root";
        $dbPass = "";
        try {
            $dbConnection = new PDO('mysql:host=' . $dbHost . ';dbname=' . $dbName, $dbUser, $dbPass);
            $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $dbConnection;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

}

?>