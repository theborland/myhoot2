<?php
session_start();
$whitelist = array('lat','long','answer','questionNumber');
require '../controller/dbsettings.php';

if ($lat=="")$lat=0;
if ($long=="")$long=0;
$color=User::getColor();
//die ($color);
if ($_SESSION["user_id"]==0)die("Sorry this shouldnt happen - tell me about it...");
$correct=Answer::loadCorrect($questionNumber);
//place currently is true or false if they could submit (meaning 1st time)

//die ($questionNumber);
//echo $sql;
//die();
$game=Game::findGame();
$theQuestion=Question::findQuestion();

if ($game->type=="geo" || $game->type=="places"|| $game->type=="pt")
    $distanceAway=LatLong::findDistance($correct->location,new LatLong($lat,$long));
/*else if ($game->type=="age"){
  $datetime1 = date_create($answer-$correct->value);

}*/

else
   $distanceAway=abs($answer-$correct->value);

if ($answer>100000)
      $distanceAway=round($distanceAway,-5);
//die ($questionNumber);
$questionNumberSite=$game->round;
//if ($questionNumberSite!=$questionNumber)
if ($questionNumberSite<0 || $theQuestion->answer=="waiting" || $questionNumberSite!=$questionNumber)
  header( 'Location: waitingScreen.php?message='."Submit your answer in time" ) ;
else
{
  $place=Answer::addAnswer($_SESSION["user_id"],$questionNumberSite,$lat,$long,$answer,$distanceAway,$color,$game->type);
  $avg=User::updateUser($_SESSION["user_id"],$questionNumberSite,$distanceAway);
}
//NOW WE FIND THE OVERALL PERCENT PLACE THAT PERCENT DID ON THAT question_id
//Answer::findPercentPlace()

//echo $sql;
//die();
//SOCKET SENDING MESSAGE
/*
    if ($place>=0){
      $entryData = array(
          'category' => "Game".$_SESSION['game_id'].$questionNumber
        , 'title'    => stripslashes($_SESSION["name"])
        , 'miles'    => number_format($distanceAway)
        , 'color'    => $color
      );
      $context = new ZMQContext();
      $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
      $socket->connect("tcp://localhost:5555");
      $socket->send(json_encode($entryData));
    }
    //END SOCKET SENDING
    */

      $message= $theQuestion->getMessageAway($distanceAway);

  //  $place=
    //echo $correct->location->longg;
  //  die ($message);//place='.$place.
   header( 'Location: waitingScreen.php?message='.$message.'&place='.$place.'&avg='.$avg ) ;
 ?>
