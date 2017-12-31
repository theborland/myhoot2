<?php
session_start();
//echo "sdfsdf";
//echo $_SESSION["questionNumber"];
require 'controller/dbsettings.php';
//  $_SESSION["game_id"]=90993;
  //$_SESSION["questionNumber"]=7;
$allAnswers=new AllAnswers($_SESSION["questionNumber"]);
$theQuestion=Question::loadQuestion();

?>

<html>
<head>
      <link rel="stylesheet" href="style/global.css">
      <link rel="stylesheet" href="style/inputButton.css">
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
            background: url('<?php echo Question::loadImage($allAnswers->correctAns->name,Game::findGame()->type); ?>');

          }

          #overlayWrap{
            left:400px;
            height:140px;
            background: rgba(0,0,0,.7);
          }

          #scoresWrap{
            display: block;
            position: fixed;
            left: 0px;
            top: 0px;
            bottom:0px;
            padding:0px 20px;
            box-sizing:border-box;
            width: 400px;
            z-index: 10;
            background: rgba(0,0,0,.8);
            box-shadow: 0px 0px 25px rgba(0,0,0,.5);
            color: #fff;
          }

          #scoresWrap h1{
            font-size: 40px;
            font-weight: 100;

          }

          #scoresGraphWrap{
            display: block;
            height: 99%;
            overflow-y:auto;
            width: 350px;
            padding-right: 10px;
          }

          .scoresGraphLabel{
            display: block;
            font-size: 16px;
            font-weight: 300;
            color: #fff;
          }

          .scoresGraphBar{
            padding:0px 0px 15px;
            margin:5px 0px;
            border-bottom:1px solid rgba(255,255,255,0.2);ß
          }

          .scoresGraphAll{
            display: inline-block;
            box-sizing:border-box;
            margin:0px;
            padding:5px 0px 5px 10px;
            background: #1D81CF;
            font-weight: 500;
          }
          .scoresGraphNew{
            display: inline-block;
            box-sizing:border-box;
            margin:0px;
            padding:5px 0px 5px 10px;
            background: #F76116;
            margin-left:-4px;
            margin-right: 5px;
          }
          .scoresGraphBar:last-child{
            border-bottom: 0px;
          }

          .scoresGraphNewLabel{
            display: inline-block;
            font-weight: 500;
          }


          #scoresGraphWrap::-webkit-scrollbar {
              width: 10px;
          }

          #scoresGraphWrap::-webkit-scrollbar-track {
             display: none;
          }

          #scoresGraphWrap::-webkit-scrollbar-thumb {
              border-radius: 2px;
              background:rgba(255,255,255,0);
              cursor: pointer;
          }

          #scoresWrap:hover #scoresGraphWrap::-webkit-scrollbar-thumb {
              background:rgba(255,255,255,.2);
          }


          .scoresLine{
            display: block;
            font-size: 22px;
            font-weight: 300;
            border:0px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding:8px 10px;
          }

          .scoresGraphScore{
            display: inline-block;
            float: right;
            font-weight: bold;
          }
          .scoresLine:last-child{
            border-bottom: 0px;
          }

          #overlayWrap #userMapSubmit{
            top:45px;
            right:30px;
          }

          #answerLabel{
            font-weight: 500;
            color:rgba(255,255,255,.8);
            font-size: 20px;
            font-family: overpass;
            margin-left: 40px;
            margin-top:20px;
          }
          #answer{
            display: none;
          }
          .noUi-pips{
            color:#fff;
          }
          .noUi-marker-normal{
            background:rgba(255,255,255,.5);
          }
          .noUi-marker-large{
            background:rgba(255,255,255,1);
          }
          .noUi-handle{
            display: none;
          }
          .noUi-connect{
            display: none;
          }
          .noUi-target{
            background:rgba(255,255,255,0);
            border:1px solid rgba(255,255,255,1);
            box-shadow: none;
            height:8px;
          }
          .noUi-value-horizontal:last-child{
            left: calc(100% - 50px);
          }

          .nametag{
            position: absolute;
            top: -63px;
            right: -21px;
            display: inline-block;
            transform: rotate(45deg);
            background: rgba(0,0,0,.7);
            padding: 2px 10px;
            border: 1px solid #fff;
            border-radius: 5px;
          }
    </style>

  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFCvK3FecOiz5zPixoSmGzPsh0Zv75tZs"></script>
      <script>




<?php
if (isset($_SESSION["auto"]) && $_SESSION["auto"]=='yes')
{
?>
//automatically forward if automode on
setTimeout( function(){
      window.location.href='getQuestion.php';
}  , 7000 );



<?php
}
?>

</script>
</head>
<body>
<script src="nouislider.min.js"></script>
<a id="endGameLink" href="endScreen.php">end game</a>
<div id="overlayWrap">
  <div id="answerLabel"> <?php echo $theQuestion->getQuestionText(); ?> <?php echo $theQuestion->getLabel(); ?></div>
  <div id="answerWrap">
    <?php for ($i=0;$i<=strlen($allAnswers->correctAns->value);$i++){  ?>
       <div class="answerNum" id="answerNum<?php echo $i; ?>">0</div>
       <?php if ((strlen($allAnswers->correctAns->value)+1-$i)%3==1 && $i!=strlen($allAnswers->correctAns->value)){   ?>
         <div class="answerNum noB" id="answerNumC">&nbsp;</div>
       <?php  }  ?>
    <?php } ?>
    <div class="answerNum noB" id="answerNumC"  style="width:70px;"><?php echo $theQuestion->getQuestionUnits(); ?></div>
  </div>

  <a href="showScoreBoard.php" style="display:none;">ScoreBoard</a>
  <a href="getQuestion.php" id="userMapSubmit">Next Question</a>
</div>
<div id="scoresWrap">
    <div id="scoresGraphWrap">

      <h1>Scoreboard</h1>
      <?php
        $allAnswers->getTP();
        //echo($allAnswers->allAnswers[0]->color);
           foreach ($allAnswers->allAnswers as $key => $value)
            { ?>
              <div class="scoresLine">
                <div class="scoresName" style="background:#<?php echo $value->color; ?>"><?php echo stripslashes($value->name); ?></div>
                <div class="scoresGraphScore"><?php echo $value->totalPoints; ?></div>
                <div class="roundPoints"><?php echo $value->roundPoints; ?></div>
              </div>
      <?php }?>
    </div>


</div>
<div id="timelineWrap">

  <?php
  $max=$allAnswers->getMax();
  $min=$allAnswers->getMin();
  if ($max-$min==0)
      $max=($allAnswers->correctAns->value)*2;
  $rounding=(strlen($max)-3)*-1;
  if ($rounding>0)$rounding=0;
  //echo "sdfd".$max;
  $reg0=round($min,$rounding);
  $reg1=round((($max-$min)*.25)+$min,$rounding);
  $reg2=round((($max-$min)*.5)+$min,$rounding);
  $reg3=round((($max-$min)*.75)+$min,$rounding);
  $reg4=round($max,$rounding);
  $correctLoc=($allAnswers->correctAns->value-$reg0)/($reg4-$reg0);
  ?>

  <div id="timeline">
    <div class="timelineMarker" id="timelineCA" style="border-color:#E12027;margin-left:calc(<?php echo $correctLoc*100; ?>% - 10px);">&nbsp;</div>
    <?php foreach ($allAnswers->allAnswers as $key => $value)
    {
        $loc=($value->ans-$reg0)/($reg4-$reg0);
        ?>
    <div class="timelineMarker" style="border-color:#<?php echo $value->color ?>;margin-left:calc(<?php echo $loc*100; ?>% - 10px);">&nbsp;</div>
    <?php } ?>

  </div>
</div>
<div id="answer"><?php echo ($allAnswers->correctAns->value); ?></div>
<script>

window.onload = function(){

function animateNum(i, n, fin, finNum, time){
      setTimeout( function(){
        if(fin)
          document.getElementById("answerNum" + n).innerHTML = finNum;
        else
          document.getElementById("answerNum" + n).innerHTML = Math.round(Math.random() * 9);
    }, Math.pow(i, 1.05) * time);

}

  answer = document.getElementById("answer").innerHTML;
  //alert(answer);
  answer = answer.length >= 10 ? answer :new Array(2).join("x") + answer;
  //alert(answer);
  setTimeout( function(){

    for(n=0; n < answer.length; n++){
      time = 50 + Math.round(Math.random() * 50);
      for(i=0; i < 25; i++){
          val = (answer.charAt(n) == "x".charAt(0)) ? "&nbsp;" : answer.charAt(n) + "";
          animateNum(i, n, (i==24), val, time);
      }
    }
  }, 500);





var timeline = document.getElementById('timeline');

noUiSlider.create(timeline, {
  start: [<?php echo $reg2 ?>],
  connect: "upper",
  direction: 'ltr',
  range: {
    'min': [<?php echo $reg0 ?>],
    '25%': [<?php echo $reg1 ?>],
    '50%': [<?php echo $reg2 ?>],
    '75%': [<?php echo $reg3 ?>],
    'max': [<?php echo $reg4 ?>]
  },pips: { // Show a scale with the slider
    mode: 'steps',
    density: 2
  }
});

  labels = document.getElementsByClassName("noUi-value-large");
  for(var i=0; i<labels.length;i++){
    val = parseInt(labels[i].innerHTML);
    labels[i].innerHTML = comma(val);
  }




  function comma(num){
    num = num+"";
    arr = num.split("");
    newS = "";
    for(var i=0; i<arr.length; i++){
      if((arr.length - i)%3 == 0 && i!=0)
        newS = newS + "," + arr[i];
      else
        newS = newS + arr[i];
    }
    return newS;
  }




};

</script>
</body>
</html>
