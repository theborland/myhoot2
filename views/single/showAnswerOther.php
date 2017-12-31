<?php

session_start();
$whitelist = array('message','submit','name','place');
$_SESSION["game_id"]=$game_id=1111;
$_SESSION["single"]=true;


require '../controller/dbsettings.php';
Game::findGame()->type;
if (Game::findGame()->type!="geo" && Game::findGame()->type!="pt" && Game::findGame()->type!="places" && strpos($_SERVER['REQUEST_URI'],'Other')==false)
     header( 'Location: showAnswerOther.php') ;
//$_SESSION["questionNumber"]=428;
$theQuestion=Question::loadQuestion();
//$_SESSION["questionNumber"]=428;
$user=User::loadUserSingle();

//$_SESSION["questionNumber"]=428;
//$_SESSION["questionNumber"]=$theQuestion->
//echo $_SESSION["questionNumber"];
$allAnswers=new AllAnswers($_SESSION["questionNumber"]);

$seconds=time();
$timeLeft=($lengthOfGame+$lengthOfBreak)-$seconds%($lengthOfGame+$lengthOfBreak);
//die ($_SESSION["questionNumber"]);
//die ($theQuestion->min);
//die ($allAnswers->correctAns->value);
 ?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Waiting...</title>
  <link rel="stylesheet" href="../style/global.css">
  <link rel="stylesheet" href="../style/showAnswerOtherSingle.css">
	<link rel="stylesheet" href="../style/waitingScreen.css">
  <link rel="stylesheet" href="../style/showAnswerOther.css">

	<script src="../scripts/global.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="../scripts/socketScripts.js?ver=1"></script>
	 <script src="http://gameon.world/scripts/autobahn.min.js"></script>
   <script src="../scripts/showAnswer.js"></script>
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFCvK3FecOiz5zPixoSmGzPsh0Zv75tZs"></script>

<style>
/* Style the tab */
.answerNum {
    color: #48a59d !important;
  }
div.tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
div.tab button {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
    transition: 0.3s;
}

/* Change background color of buttons on hover */
div.tab button:hover {
    background-color: #ddd;
}

/* Create an active/current tablink class */
div.tab button.active {
    background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
    display: none;
    padding: 6px 6px;
    border: 1px solid #ccc;
    border-top: none;
    background-color: rgba(80, 85, 130, 0.6);
}
</style>
	<script>
  var currentTab=0;
  function openCity(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;

      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
      }

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
      }

      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
  }
  function nextTab(){
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        currentTab++;
        if (currentTab==3)currentTab=0;

        if (currentTab==0){
            document.getElementById('Answer').style.display = "block";
            document.getElementById('but0').className += " active";
        }
        if (currentTab==1){
            document.getElementById('Current').style.display = "block";
            document.getElementById('but1').className += " active";
        }
        if (currentTab==2){
            document.getElementById('Overall').style.display = "block";
            document.getElementById('but2').className += " active";
        }
  }


  $(window).load(function(){
    //answerWrap
    //$('#mainMessageWrap').hide();
  ///  setTimeout(function(){ $('#answerWrap').fadeOut() }, 2800);
  //  setTimeout(function(){ $('#mainMessageWrap').fadeIn() }, 3300);
  });

  window.onload = function(){
      document.getElementById('Answer').style.display = "block";
      document.getElementById('but0').className += " active";
      setTimeout(nextTab, 3000);
      setTimeout(nextTab, 5800);
      <?php if (Game::findGame()->type=="geo" || Game::findGame()->type=="pt" || Game::findGame()->type=="places"){
       ?>
      initialize();
      <?php } ?>
      var timeleft = <?php echo $timeLeft; ?> * 1000;
      console.log(timeleft);
      $('#timerBar').animate({
        width: "0%"
      }, timeleft, "linear");


      var counter=setInterval(timer, <?php echo $timeLeft; ?> * 1000); //1000 will  run it every 1 second

      function timer()
      {
           window.location.href = "userScreen.php";
           clearInterval(counter);
           count=0999;
           return;
      }


      <?php if (Game::findGame()->type!="geo" && Game::findGame()->type!="pt" && Game::findGame()->type!="places"){
       ?>
      answer = document.getElementById("answer").innerHTML;
      //alert(answer);
      answer = answer.length >= 10 ? answer :new Array(2).join("x") + answer;
      //alert(answer);
      setTimeout( function(){

        for(n=0; n < answer.length; n++){
          time = 50 + Math.round(Math.random() * 50);
          for(i=0; i < 11; i++){
              val = (answer.charAt(n) == "x".charAt(0)) ? "&nbsp;" : answer.charAt(n) + "";
              animateNum(i, n, (i==10), val, time);
          }
        }
      }, 50);
       <?php } ?>
    }

    <?php if (Game::findGame()->type=="geo" || Game::findGame()->type=="pt" || Game::findGame()->type=="places"){
     ?>
    function initialize() {
      //alert('sdf');
		  var myLatlng = new google.maps.LatLng(<?php echo $allAnswers->correctAns->location->lat; ?>,<?php echo $allAnswers->correctAns->location->longg; ?>);//ll.lat(),ll.lng());
		  var mapOptions = {
		    zoom: 3,
		        mapTypeControl: false,
		    streetViewControl: false,
		center: myLatlng
		  }
		  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		  var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      animation: google.maps.Animation.BOUNCE
		  });

		}

//google.maps.event.addDomListener(window, 'load', initialize);
<?php }  ?>
	</script>
</head>
<body>
<style>
           #map-canvas {
             width: 100%;
             height: 800px;
             margin: 0;
             margin-top: 83px;
             /* padding: 200px; */
             /*padding-top: 200px;*/
             z-index: -1;
             position: absolute;

             <?php
             if (Game::findGame()->type!="geo" && Game::findGame()->type!="pt" && Game::findGame()->type!="places"){
             ?>
             background-image: url('<?php echo $theQuestion->loadImage(); ?>');
             background-attachment : fixed;
             background-position:0px 110px;
              background-size: cover;
             <?php   } ?>
               }

           #Answer{
              background-color: rgba(80, 85, 130, 0.6);

           }
           #smallLabel{
             font-size: 10px;
           }
           .answerNum {

     padding: 0px 2px !important;
    font-size:25px !important;
}
             		body{
                  background: linear-gradient(to bottom, #3b9c99 0%,#c4ffc8 100%);


                }
       </style>
          <div id="map-canvas"></div>
<div id="headerContainer"  data-role="page">
				<a href="#" id="logoLink"><img src="../img/logo.svg" id="logo"></a>

        <div class="tab">
          <button class="tablinks" id="but0" onclick="openCity(event, 'Answer')">Answer</button>
          <button class="tablinks" id="but1" onclick="openCity(event, 'Current')">Current Round</button>
          <button class="tablinks" id="but2" onclick="openCity(event, 'Overall')">Overall</button>
        </div>

        <div id="Answer" class="tabcontent">
          <div id="mainMessageWrap" >


        <?php if (Game::findGame()->type!="geo" && Game::findGame()->type!="pt" && Game::findGame()->type!="places"){
         ?>
           <?php echo $theQuestion->getLabel(); ?>
            <div id="answerWrapSingle">
              <?php for ($i=0;$i<=strlen($allAnswers->correctAns->value);$i++){  ?>
                 <div class="answerNum" id="answerNum<?php echo $i; ?>">0</div>
                 <?php if (strlen($allAnswers->correctAns->value)!=4&& (strlen($allAnswers->correctAns->value)+1-$i)%3==1 && $i!=strlen($allAnswers->correctAns->value)){   ?>
                   <div class="answerNum noB" id="answerNumC">&nbsp;</div>
                 <?php  }  ?>
              <?php } ?>
              <div class="answerNum noB" id="answerNumC"  style="width:70px;"><?php echo $theQuestion->getQuestionUnits(); ?></div>
            </div>
            <div id="answer"><?php echo ($allAnswers->correctAns->value); ?></div>
        <?php } else { ?>  <?php echo $theQuestion->getLabel(); ?>

        <?php } ?>  <div class="contentText">
        <?php

        $statsRound=$user->singleStatsRound;
        //echo sizeOf($allAnswers->allAnswers);
        if ($user->avg>0 && isset($allAnswers->allAnswers[$user->id])){
           echo "This round you were ". $theQuestion->getUnitsAway($user->place). " away.  This is better than ".
                   $allAnswers->allAnswers[$user->id]->avg . "% of the people worldwide!";
           if ($user->singleStatsRound->numOfPlayers>1)
                echo "<br>You placed " .$user->singleStatsRound->place. " out of ".$user->singleStatsRound->numOfPlayers.".";
           }
         ?></div>
          </div>
        </div>

        <div id="Current" class="tabcontent">

          <div id="mainMessageWrap" >This round - winners: <div id="smallLabel">(in <?php echo $theQuestion->getUnitsAway("millions of "); ?> away)</div>
          <div id="saoTable">

            <?php //CURRENT!!!
            $statsGame=$user->singleStatsRound;
            foreach ($statsGame->topFive as $key=>$value)
            {
              ?>
                    <div class="saoItem">
                      <div class="saoNumber"><?php echo $key ?> </div>
                      <div class="saoName">
                           <?php
                           if ($statsGame->place==$key)  //meaning the user is in a place
                              echo "<b>";
                           echo $value->name;
                           if ($statsGame->place==$key)  //meaning the user is in a place
                             echo "</b>";
                           ?>
                      </div>
                      <div class="saoAve"><?php if ($theQuestion->type=="pop")echo round ($value->avg/1000000,1);
                      else echo $value->avg;  ?></div>
                    </div>
            <?php
            }
            if ($statsGame->place>5){
            ?>
                    <div class="saoItem">
                      <div class="saoNumber"><?php echo $statsGame->place ?> </div>
                      <div class="saoName">
                           <b>You</b>
                      </div>
                      <div class="saoAve"><?php echo $user->place  ?></div>
                    </div>
            <?php
                }
            ?>

          </div>




          </div>

        </div>

        <div id="Overall" class="tabcontent">

          <div id="mainMessageWrap" >
          <div id="saoTable">
            <?php
            //OVERALL
            $statsGame=$user->singleStatsGame;
            foreach ($statsGame->topFive as $key=>$value)
            {
              ?>
                    <div class="saoItem">
                      <div class="saoNumber"><?php echo $key ?> </div>
                      <div class="saoName">
                           <?php
                           if ($statsGame->place==$key)  //meaning the user is in a place
                              echo "<b>";
                           echo $value->name;
                           if ($statsGame->place==$key)  //meaning the user is in a place
                             echo "</b>";
                           ?>
                      </div>
                      <div class="saoAve"><?php echo $value->avg  ?>%</div>
                    </div>
            <?php
            }
            if ($statsGame->place>5 && $user->avg>0){
            ?>
                    <div class="saoItem">
                      <div class="saoNumber"><?php echo $statsGame->place ?> </div>
                      <div class="saoName">
                           Your best
                      </div>
                      <div class="saoAve"><?php echo $user->avg  ?>%</div>
                    </div>
            <?php
          }//$user->avg>0 &&
            if (isset($allAnswers->allAnswers[$user->id])){
            if ($statsGame->tempPlace>5 && $user->tempAvg>0){
            ?>
                    <div class="saoItem">
                      <div class="saoNumber"><?php echo $statsGame->tempPlace ?> </div>
                      <div class="saoName">
                           Your current streak
                      </div>
                      <div class="saoAve"><?php echo $user->tempAvg  ?>%</div>
                    </div>
            <?php
          }
            if ($user->tempAvg<0){
            ?>
                    <div class="saoItem">
                      <div class="saoNumber"> </div>
                      <div class="saoName temp">
                           Your current streak of <?php echo $user->tempGames;  ?> games
                      </div>
                      <div class="saoAve"><?php echo -1*$user->tempAvg;  ?>%</div>
                    </div>

            <?php }}
            ?>

          </div>




          </div>


        </div>

    	<div id="waiting"></div>
<span id="timerBar"></span>
</div>


</div>

</body>
</html>
