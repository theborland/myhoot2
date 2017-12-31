<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "myHoot";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT COUNT(*)  FROM `users`";
$result = $conn->query($sql);
$row = $result->fetch_row();


if ($result)
    echo $row[0];
else echo "0";
$conn->close();
?>
