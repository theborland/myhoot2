<?php
session_start();

require 'controller/dbsettings.php';


$sql = "SELECT *  FROM `users` WHERE game_id ='".$_SESSION["game_id"]."'";
$result = $conn->query($sql);
if ($result)
{ 
   while($row = $result->fetch_assoc())
       echo $row['name'].",";
}
else "";
$conn->close();
?>
