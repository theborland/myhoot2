<?php

session_start();
$whitelist = array('message','submit','name','place','avg');
$_SESSION["game_id"]=$game_id=1111;
$_SESSION["single"]=true;


require '../controller/dbsettings.php';

$seconds=time();
$timeLeft=($seconds%($lengthOfGame+$lengthOfBreak)-$lengthOfGame)*-1;
//die ($seconds . " ". $lengthOfGame . " " . $timeLeft);
if ($message=="noSubmit"){
  User::addSkip($_SESSION["user_id"],$_SESSION["game_id"]);
}
if ($submit=="Join"){
    // $name=substr($name,0,20);
    // User::createUser($game_id,$name);

    date_default_timezone_set('America/New_York');
    //I have padded game id with 3 digit code for this date
    User::createUser($_SESSION["game_id"],$name);
    $_SESSION["game_id"]=$game_id;
    $game=Game::findGame();
    $questionNumber=$game->round;
    header( 'Location: userScreen.php') ;
}
$theQuestion=Question::loadQuestion();
 ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Waiting...</title>
	<link rel="stylesheet" href="../style/global.css">
	<link rel="stylesheet" href="../style/waitingScreen.css">

	<script src="../scripts/global.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>


<style>
  #mainMessageWrap{
  background:rgba(255,255,255,0.9);
  color:#333;
  padding:20px;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 10px;
  font-size:25px;
  font-weight: 300;
}

#mainMessageExtra{
  margin-top:5px;
  font-size:18px;
  font-weight:300;
  color:rgba(0,0,0,0.5);
}

#timerBar{
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 5px;
  background: #17DB91;
}

</style>
	<script>




      window.onload = function(){


      var timeleft = <?php echo $timeLeft; ?> * 1000;
      console.log(timeleft);
      $('#timerBar').animate({
        width: "0%"
      }, timeleft, "linear");


      var counter=setInterval(timer, <?php echo $timeLeft; ?> * 1000); //1000 will  run it every 1 second

      function timer()
      {
   window.location.href = "showAnswerOther.php";
        clearInterval(counter);
        count=33333;
        return;
      }

    }

	</script>
</head>
<style>
body{
  background: linear-gradient(to bottom, #3b9c99 0%,#c4ffc8 100%);
  }
#bgImage{

  background-image: url('<?php echo $theQuestion->loadImage(); ?>');
  background-attachment : fixed;
  background-position:0px 150px;
  background-size:cover;
  width: 100%;
  height: 800px;
  margin: 0;
  margin-top: 83px;
  z-index: -1;
  position: absolute;
}
</style>
<body>
<div id="bgImage"></div>
<div id="headerContainer">
				<a href="#" id="logoLink"><img src="../img/logo.svg" id="logo"></a>
    	<div id="waiting">Waiting...</div>
<span id="timer2"></span>
<div id="timerBar"></div>

</div>
<div id="messageWrap">

  <div id="mainMessageWrap">

      <?php if ($submit=="Join") { ?>
        <div id="welcome">Game on, <?php echo $name; ?>!</div>
      <?php  }
       else if ($message=="noSubmit"){ ?>
        <div id="score"><div style="font-size:30px;">The question is over - remember to hit submit next time.</div>
      <?php  }
       else if ($message=="noQ"){ ?>
        <div id="score"><div style="font-size:30px;">There is no question currently.</div>
      <?php }
      else if (is_numeric($message)){ ?>
        <div id="score"><div style="font-size:30px;">Your answer was</div><br> <?php echo round($message,2) ; ?> miles away.</div>
      <?php } else {
        echo $message;
       }  ?>

        <div id="mainMessageExtra">
          <?php if (is_numeric($place) && $place>0){ ?>You were closer than <?php echo $place ?>% of other people worldwide.
      <?php }  ?>
      <?php if (is_numeric($avg) && $avg>0){ ?><br>You last five average is now <b><?php echo $avg ?>%</b>
  <?php }  ?>
      <?php if (substr($avg,0,1)=="~"){
            $splits=explode("~",$avg);
            //print_r($splits);
            $questions=$splits[1];
            $runningAvg=$splits[2];
        ?><br>Your avg is <b><?php echo round($runningAvg,2) ?>%</b> of the last  <?php echo $questions ?> games.
<?php }  ?>
    </div>

  </div>

</div>

</body>
</html>
