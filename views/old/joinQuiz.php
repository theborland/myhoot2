<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="style/global.css">
    <link rel="stylesheet" href="style/joinQuiz.css">
    <style>
	body{
		background: url('paris.jpeg');
		background-size: cover;
		background-repeat: no-repeat;
	}

	</style>
	<title>Join a Quiz</title>
</head>
<body>
	<div id="jqWrap">
		<img src="logo.svg" id="logo">
		<h4>Join a Quiz</h4>
		<form action="waitingScreen.php">
			<label for="game_id" class="jqLabel"> QUIZ ID </label>
			<input type="text" name="game_id" id="game_id" class="jqInput">

			<label for="name" class="jqLabel">YOUR NAME</label>
			<input type="text" name="name" id="name"class="jqInput">

			<Center><input type="submit" name="submit" value="Join" id="jqJoin"></Center>
		</form>
	</div>
	<div id="footer">
		Copyright and stuff.
	</div>


</body>
</html>

