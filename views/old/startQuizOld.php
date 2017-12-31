<?php
session_start();
$_SESSION = array();
$_SESSION["auto"]="";
require 'controller/dbsettings.php';
//create game
Game::createGame();
 ?>
 <html>
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
		padding:0px;
		padding-top: 5%;
}
	#jqWrap{
		width:600px;
	}
	#jqWrap h4{
		font-size:30;
		margin-top:38px;
		margin-bottom:20px;
	}
	#jqWrap #logo{
		width:160px;
	}
	#jqWrap .jqLabel{
		font-size:18px;
	}
	#jqWrap #quizidWrap{
		display: block;
		text-align: center;
	}
	#jqWrap #quizid{
		display: inline-block;
		text-align: left;
		font-size:50px;
		font-weight: 300;
		color:#fff;
		padding:5px 30px;
		border:1px solid #fff;
		border-radius: 5px;
		background:rgba(0,0,0,.3);
	}

	input[type="checkbox"]{
		-webkit-appearance:none;
		width: 18px;
		height: 18px;
		border:3px solid rgba(0,0,0,0);
		outline: 1px solid #fff;
		background:rgba(0,0,0,0);
		border-radius: 0px;
		cursor: pointer;
		position: relative;
		top:5px;
		-moz-background-clip: padding;     /* Firefox 3.6 */
		-webkit-background-clip: padding;  /* Safari 4? Chrome 6? */
		background-clip: padding-box;      /* Firefox 4, Safari 5, Opera 10, IE 9 */
	}
	input[type='checkbox']:checked {
		border:3px solid rgba(0,0,0,0);
		outline: 1px solid #fff;
		background:#fff;
		-moz-background-clip: padding;     /* Firefox 3.6 */
		-webkit-background-clip: padding;  /* Safari 4? Chrome 6? */
		background-clip: padding-box;      /* Firefox 4, Safari 5, Opera 10, IE 9 */
	}
	#jqJoin{
		position: relative;
		vertical-align: middle;
	}
	#usersWrap{
		border:1px solid #fff;
		border-radius: 5px;
		background:rgba(0,0,0,.3);
		margin-bottom: 20px;
		padding:7px 5px 7px 0px;
	}
	#nameUsers{
		min-height: 200px;
		max-height: 270px;
		overflow-y:auto;
		font-size: 18px;
		font-weight: 300;
		color:#fff;
		padding:10px 20px;
	}

	#nameUsers::-webkit-scrollbar {
		width: 10px;
	}

	#nameUsers::-webkit-scrollbar-track {
		display: none;
	}


	#nameUsers::-webkit-scrollbar-thumb {
		border-radius: 2px;
		background:rgba(255,255,255,.4);
		cursor: pointer;
	}


	#colsWrap{
		border-top:1px solid rgba(255,255,255,.5);
		padding-top:20px;
	}
	#col1{
		display: inline-block;
		width: 290px;
	}
	#col2{
		display: inline-block;
		width: 290px;
		padding-left:15px;
		vertical-align: top;
	}

	</style>

 <script src="http://gameon.world/scripts/autobahn.min.js"></script>
 <script src="socketScripts.js"></script>
<script>
  loadWaitingForUsers('<?php echo $pusherIP; ?>' ,<?php echo $_SESSION["game_id"]; ?>);
</script>
 </head>
 <body>


	<div id="jqWrap" method="GET">
		<img src="logo.svg" id="logo">
		<h4>Creating a Quiz</h4>

		<div id="colsWrap">
			<div id="col1">
				<label class="jqLabel"><div id="numUsers" style="display:inline-block;">0</div> USERS IN THE GAME</label>
				<div id="usersWrap">
					<div id="nameUsers">
					</div>
				</div>

			</div>
			<div id="col2">
				<label class="jqLabel" style="margin-left:25px;">QUIZ ID</label>
				<div id="quizidWrap">
					<div id="quizid">
						<?php echo $_SESSION["game_id"] ; ?>
					</div>
				</div>
				<br><Br>
				<form action="getQuestion.php">
					<center >
						<label for="autoplayCB" class="jqLabel" style="display:inline-block; margin-right:10px;position:relative; top:7px;">
							AUTOPLAY
							<input type="checkbox" id="autoplayCB" name="auto" value="yes"></label>
              <select name="type">
  <option value="geo" selected>Geo</option>
  <option value="pop">Pop</option>
  <option value="weather">Weather</option>
  <option value="age">People</option>
  <option value="time">Timeline</option>
  <option value="user">User</option>
  <option value="random">Random</option>
</select>
						<input type="submit" id="jqJoin" value="Start">
					</Center>
				</form>
			</div>
		</div>




	</div>
	<div id="footer">
		Copyright and stuff.
	</div>

 </body>
 </html>
