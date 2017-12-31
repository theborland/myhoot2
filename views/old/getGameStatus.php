<?php
session_start();

require 'controller/dbsettings.php';


$sql = "SELECT * FROM `games` WHERE game_id ='".$_SESSION["game_id"]."'";
$result = $conn->query($sql);
if ($result)
{
   $row = $result->fetch_assoc();
   $status = $row["round"];
   echo $status;
}
$conn->close();


?>
