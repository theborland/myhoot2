<?php
session_start();
require '../controller/dbsettings.php';
$_SESSION["game_id"]=1111;
$game=Question::findQuestion();
$_GET["question"]=abs($game->qID);
if ($game->type!="geo" && $game->type!="pt" && $game->type!="places")
{
  if ($game->answer=="waiting")
    header("Location: waitingScreen.php?message=noQ");
  if ($game->type=="age")
    header("Location: userScreenAge.php?question=".$_GET["question"]);
  if ($game->type=="pop")
    header("Location: userScreenPop.php?question=".$_GET["question"]);
  if ($game->type=="temp" || $game->type=="weather" )
    header("Location: userScreenWeather.php?question=".$_GET["question"]);
  if ($game->type=="facts" && $game->max==-100)
    header("Location: userScreenDecimal.php?perc=yes&question=".$_GET["question"]);
  if ($game->type=="facts")
    header("Location: userScreenDecimal.php?question=".$_GET["question"]);
  if ($game->type=="time"){
    if ($game->answer<-200)$region=0;
    else if ($game->answer<600)$region=1;
    else if ($game->answer<1200)$region=2;
    else if ($game->answer<1600)$region=3;
    else $region=4;
    header("Location: userScreenWorldTime.php?region=".$region."&question=".$_GET["question"]);
  }
//  if ($game->type=="temp")
//    header("Location: userScreenWeather.php");
  die($game->type);
}





if (isset($_GET["question"]))
  if (Answer::checkUserSubmitted($_GET["question"],$_SESSION["user_id"]))
    header("Location: waitingScreen.php?message=".urlencode("come on - you cant submit twice"));
  $_SESSION["questionNumber"]=Game::questionStatusRedirect();
  $theQuestion=Question::loadQuestion();

  $seconds=time();
  $timeLeft=($seconds%($lengthOfGame+$lengthOfBreak)-$lengthOfGame)*-1;
?>
 <html>
 <head>
<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../style/global.css">
    <style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
      #timerBar{
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 5px;
        background: #17DB91;
      }

      #questionWrap{
        position: fixed;
        bottom: 0px;
        right:0px;
        left:0px;
        height:60px;
        font-size: 20px;
        font-weight: 500;
        color:#fff;
        padding:15px;
        background-color: rgba(30,30,30,.9);
        z-index: 1000;
      }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="../scripts/mobile.js"></script>
    <script>

 window.onload = function(){
       var timeLeft = <?php echo $timeLeft; ?> * 1000;
       setUpTimer(timeLeft);
    }

var map;
var worldCenter = new google.maps.LatLng(20.6743890, -3.9455); //starting position
var inputMarker;
var MY_MAPTYPE_ID = 'custom_style';

function initialize() {
  var featureOpts = [
    {
      elementType: 'labels',
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      stylers: [{ visibility: 'off' }]
    },
      { featureType: "administrative.province", stylers: [ { visibility: "on" } ] },
      {  featureType: "administrative.province",elementType: "labels",  stylers: [    { visibility: "off" }
          ]
        },
    { featureType: "road", stylers: [ { visibility: "off" } ] },
    {
      featureType: 'water',
      stylers: [
        { color: '#57AAC5' }
      ]
    }


  ];

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var mapOptions = {
    zoom: 3,
    minZoom: 2,
    maxZoom:8,
    center: worldCenter,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: MY_MAPTYPE_ID


  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var styledMapOptions = {
    name: 'Custom Style'
  };

  inputMarker = new google.maps.Marker({
    position: worldCenter,
    map: map,
    icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" +"<?php echo User::getColor(); ?>")
  });


  google.maps.event.addListener(map, 'click', function(e) {
    document.getElementById('lat').value = e.latLng.lat();
    document.getElementById('long').value = e.latLng.lng();
    inputMarker.setPosition(e.latLng);
  });
  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);


}

function moveMarker(position) {
  inputMarker.setPosition(position);
}
google.maps.event.addDomListener(window, 'load', initialize);



// TEST CODE START

// bounds of the desired area
// TEST CODE END



    </script>


 </head>
 <body>

  <div id="overlayWrap">
    <div id="timerBar"></div>
    			<a href="http://GameOn.World" id="logoLink"><img src="../img/logo.svg" id="logo"></a>
      <form name="form1" id="form1" method="post" action="submitAnswer.php">
        <input name="questionNumber" type="hidden" value="<?php echo $_GET["question"] ?>">
        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="long" name="long">
        <input type="submit" name="submit" id="userMapSubmit" class="regButton" value="Submit!">
      </form>

  </div>

    <div id="questionWrap">
      <div id="actualQuestion"><?php echo $theQuestion->getQuestionText(); ?> <?php echo $theQuestion->getLabel(); ?> <?php echo $theQuestion->getQuestionTextEnd(); ?>?</div>
    </div>


    <div id="map-canvas"></div>
 </body>
 </html>
