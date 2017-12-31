<?php
session_start();
//$_SESSION["questionNumber"]=7;
//die();
//echo "sdfsdf";
  //die ($_SESSION["questionNumber"]);
//$_SESSION["game_id"]=39407;
require 'controller/dbsettings.php';
//die ($_SESSION["questionNumber"]);
//$_SESSION["questionNumber"]=2;
//$_SESSION["questionNumber"]--;
//echo ($_SESSION["questionNumber"]);
$allAnswers=new AllAnswers($_SESSION["questionNumber"]);
$allAnswers->fillMissingAnswers();
//$theQuestion=Question::loadQuestion();
//$allAnswers->getTP();
//print_r(sizeof($allAnswers->allAnswers ));
//die();
//die ($_SESSION["questionNumber"]);
?>

<html>
<head>
      <link rel="stylesheet" href="style/global.css">
      <link rel="stylesheet" href="style/inputButton.css">
      <link rel="stylesheet" href="style/endScreen.css">
      <link href="nouislider.min.css" rel="stylesheet">
      <style type="text/css">
            html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}
          html{
            background:#000;
          }

          body{
            <?php if($theQuestion->type == "age"){ ?>
              background-size: contain;
            <?php }else{ ?>
              background-size: cover;
            <?php } ?>
            background-repeat: no-repeat;
            background-position:center center;
            background: url('paris.jpeg');

          }

    </style>
  <script src="scripts/music.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFCvK3FecOiz5zPixoSmGzPsh0Zv75tZs"></script>
      <script>

window.onload = function() {
  if (readCookie("playMusic")=="false"){
      muteOff();
  }
}



</script>
</head>
<body>
<script src="nouislider.min.js"></script>
<script src="socketScripts.js"></script>
<audio id="bgMusic" autoplay loop enablejavascript="yes">
  <source src="end.mp3"  type="audio/mpeg">
  Your browser does not support the audio element.
</audio>


  <div id="scoresWrap">
    <div id="scoresGraphWrap">

      <h1>Scoreboard</h1>
      <?php
        $allAnswers->getTP();
        //echo($allAnswers->allAnswers[0]->color);
        //echo sizeof($allAnswers);
           foreach ($allAnswers->allAnswers as $key => $value)
            { ?>
              <div class="scoresLine">
                <div class="scoresName" style="background:#<?php echo $value->color; ?>"><?php echo stripslashes($value->name); ?></div>
                <div class="scoresGraphScore"><?php echo $value->totalPoints; ?></div>
              </div>
      <?php }?>

    </div>


</div>


<div id="winnerStandAligner">
  <div id="winnerStandWrap">
    <h1>WINNERS</h1>

    <div id="standsWrap">
      <?php if (sizeof($allAnswers->allAnswers )>=2){ ?>
      <div class="standWrap">
        <div class="winnerStand" id="ws2">2</div>
        <div class="winnerNameWrap" id="wn2">
            <div class="winnerName" style="background:#<?php echo $allAnswers->allAnswers[1]->color; ?>;"><?php
            echo stripslashes($allAnswers->allAnswers[1]->name);
            ?></div>
        </div>
      </div>
        <?php  } if (sizeof($allAnswers->allAnswers )>=1){ ?>
      <div class="standWrap">
        <div class="winnerStand" id="ws1">1</div>
        <div class="winnerNameWrap" id="wn1">
            <div class="winnerName" style="background:#<?php echo $allAnswers->allAnswers[0]->color; ?>;"><?php
                 echo stripslashes($allAnswers->allAnswers[0]->name);
            ?></div>
        </div>
      </div>
      <?php  } if (sizeof($allAnswers->allAnswers )>=3){ ?>
      <div class="standWrap">
        <div class="winnerStand" id="ws3">3</div>
        <div class="winnerNameWrap" id="wn3">
            <div class="winnerName" style="background:#<?php echo $allAnswers->allAnswers[2]->color; ?>;"><?php
                 echo stripslashes($allAnswers->allAnswers[2]->name);
            ?></div>
        </div>
      </div>
      <?php } ?>
    </div>
      <a href="startQuiz.php" id="restart">Restart</a>
  </div>
</div>

</body>
</html>
