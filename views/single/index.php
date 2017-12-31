<?php
session_start();
$whitelist = array('error','name','game_id','replay');
require '../controller/dbsettings.php';

if (isset($_SESSION["user_id"]) && isset($_SESSION["game_id"]) && $_SESSION["game_id"]>0 && $_SESSION["user_id"]>0){
		if (isset($_SERVER['HTTP_REFERER']))
		{
			$ref=$_SERVER['HTTP_REFERER'];
	  	if (strpos($ref,"wait")!==false || strpos($ref,"submitAns")!==false || strpos($ref,"user")!==false){
				if ($replay!="yes")
					header( 'Location: checkQuestion.php');
			}
		}

}


if (isset($_SESSION["name"]) && strlen($name)==0)
	$name=$_SESSION["name"];

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../style/global.css">
    <link rel="stylesheet" href="../style/form.css">
    <link rel="stylesheet" href="../style/joinQuiz.css">
  <title>Join the World Game</title>
</head>
<body>
	<?php include_once("../controller/analyticstracking.php") ?>
	<div id="jqWrap">
					<a href="http://GameOn.World" id="logoLink"><img src="../img/logo.svg" id="logo"></a>
		<h4 class="formHeader">Join the World Game </h4>

		<form action="waitingScreen.php">

			<label for="name" class="jqLabel">YOUR NAME<?php
			if ($error=="Bad Username") { echo " (That name has been used)"; $name=""; }
			if ($error=="Reject") echo " (Really, come on.  Grow up.)";
			 ?></label>
			<input type="text" name="name" id="name" value="<?php echo $name ?>" class="jqInput"maxlength="20" >

			<Center>
				<input type="submit" name="submit" value="Join" id="jqJoin" class="regButton">

			</Center>

		</form><h2 class="formHeader">in beta - getting better everyday </h2>
	</div>
	<div id="footer">
		Copyright and stuff.
	</div>


</body>
</html>
