<?php

session_start();
$whitelist = array('message','submit','name','game_id');
require 'controller/dbsettings.php';

if ($submit=="Join"){
     //$name=substr($name,0,20);
     $_SESSION["game_id"] =$game_id;
    // User::createUser($game_id,$name);
    if (Game::findGame()==null)
         header( 'Location: joinQuiz.php?error=Bad Game');
    if (!User::createUser($game_id,$name))
         header( 'Location: joinQuiz.php?error=Bad Username');
    $game=Game::findGame();
    $questionNumber=$game->round;
    if ($questionNumber!=-1){
        if ($game->type=="geo")
          header( 'Location: userScreen.php?question='.$questionNumber ) ;
        else {
          $type=ucwords($game->type);
          header( 'Location: userScreen'.$type.'.php?question='.$questionNumber ) ;
        }
    }
}

 ?>
 <html>
 <head>
    <link rel="stylesheet" href="style/global.css">
    <link rel="stylesheet" href="style/joinQuiz.css">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
		body{
			background:#e1e1e1;
		}

		#jqWrap{
			background:#333;
			box-shadow: 0px 0px 30px rgba(0,0,0,.5);
			color:#fff;
			border:0px;
		}
		#score{
			font-weight: 100;
			font-size: 30px;
		}
		#waitingDiv{
			font-size:17px;
			color:#b1b1b1;
		}
		#gameID{
			text-align: center;
			color: #a1a1a1;
			font-size: 15px;
		}
		#joinHere:link, #joinHere:visited{
			color:#fff;
			text-decoration: none;
			display: inline-block;
			border:1px solid #fff;
			padding:1px 4px;
			border-radius: 3px;
		}
		#everyonePlaying{
			color:#a1a1a1;
			display: inline;
		}
		#waitingDiv{
			display: inline;
		}
		hr{
			border:0px;
			height: 1px;
			background: #a1a1a1;
			margin:15px 0px;
		}
    </style>
	 <script src="http://gameon.world/scripts/autobahn.min.js"></script>
	 <script src="socketScripts.js"></script>
	 <script>
	   loadWaitingForQuestion('<?php echo $pusherIP; ?>' ,'<?php echo $_SESSION["game_id"]; ?>');
	 </script>

</script>
 </head>
 <body>

	<div id="jqWrap">
		<img src="logo.svg" id="logo">
		<h4>Waiting</h4>
		<hr>
    <?php if (is_numeric($message)){ ?>
	 	<div id="score"><div style="font-size:18px;font-weight:bold;">Your answer was</div> <?php echo $message . "<br>"; ?> miles away.</div>
<?php } else { ?>
  <div id="score"><div style="font-size:18px;font-weight:bold;"> <?php echo $message . "<br>"; ?> </div>
<?php }  ?>
  	<hr>
		<div id="waitingDiv">We are waiting... </div><div id="everyonePlaying">Everybody else playing? <a href="checkQuestion.php" id="joinHere">Try here.</a></div>
		<br><br>
		<div id="gameID">Game id: <?php echo $_SESSION["game_id"]; ?></div>
	</div>
 </body>
 </html>
