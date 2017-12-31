<?php
//  tail -f name of file to view in process
// ./script.sh
// killall -9 php  kill php processes
//  lsof -t -i:5555
//  ps -ef | grep php
// kill -9 pid
// kill `lsof -t -i:5555`
// sudo env EDITOR=nano crontab -e
// # sync; echo 3 > /proc/sys/vm/drop_caches   ?
// crontab -e
//import database  mysql -u root -p  MyHoot <3.sql
//     kill -9 $(lsof -i:5555 -t)``
///Users/jeffborland/web/launchSingle.sh >> /Users/jeffborland/web/results.log
date_default_timezone_set('America/New_York');
$datetime1 = strtotime("now");//current datetime object
$hour=date("H");
$datetime2 = mktime($hour, 59, 59);//next day at midnight
$timeUntilStop= ($datetime2 - $datetime1);///10;
//die("time is ".$timeUntilStop);


set_time_limit(0);
require '../controller/dbsettings.php';
include ('../controller/siteFunctions.php');
include ('../controller/Question.php');
include ('../controller/Game.php');
include ('../controller/Answer.php');
include ('../controller/User.php');

//$sql = "DELETE FROM `questionsSingle`";

//$result = $conn->query($sql);

$sql = "DELETE FROM `questionsSingle` WHERE `active`='0' OR `active`='3'";
$result = $conn->query($sql);

$_SESSION["single"]=true;
$playedGames=array();
$_SESSION["regionsSelected"]=$regionsSelected=array(1,2,3,4,5,6,7,8,9,10,11);
$gamesSelected=array("time","pt","places","places","facts","facts");//,"geo","geo","geo","geo","geo");//weather
//$gamesSelected=array("time");

Game::createGame(false,true);
$_SESSION["questionNumber"]=getLastQuestion()+1;
echo $_SESSION["questionNumber"]."<Br>Starting";
$counter=0;
$skippedRound=false;
while ($timeUntilStop>($lengthOfGame+$lengthOfBreak)){
  echo "time is ".$timeUntilStop . "\n";
  echo memory_get_usage()."\n";
   $counter++;
   echo "$counter \n";
  /*
    if (sizeof($playedGames)==0)
        $current=$gamesSelected[rand(0,count($gamesSelected)-1)];
    else {
        $idealArray =array_count_values($gamesSelected);
        $currentArray =array_count_values($playedGames);
        $current=$gamesSelected[rand(0,count($gamesSelected)-1)];
        while (array_key_exists($current,$currentArray) && $currentArray[$current]/sizeof($playedGames)>$idealArray[$current]/sizeof($gamesSelected))
        {
          //echo ("current". $current.($currentArray[$current]/sizeof($playedGames)));
           $current=$gamesSelected[rand(0,count($gamesSelected)-1)];
        }
        //
    }
*/
    $current=$gamesSelected[rand(0,count($gamesSelected)-1)];
    echo $current;
    $theQuestion=new Question($current);
    echo "got question";
    if ($current=="age")$current="entertainment";
    if ($current=="pop")$current="facts";
    //$playedGames[]=$current;
    echo $theQuestion->getLabel()."\n";
    $seconds=time();
    while ($seconds%($lengthOfGame+$lengthOfBreak)!=$lengthOfGame)
    {
       usleep(500000);
       $seconds=time();
     }
    $allAnswers=new AllAnswers($_SESSION["questionNumber"]);
    $numUsers=sizeof($allAnswers->allAnswers);
    echo "Question:".$_SESSION["questionNumber"]." Num Users:".$numUsers."\n";
    //$theQuestion->alertUsers(-1);
    if ($numUsers>0){
      $sql = "UPDATE `questionsSingle` set `active`='1' WHERE `questionNum`='".$_SESSION["questionNumber"]."'";
      $result = $conn->query($sql);
      $skippedRound=false;
    }
    else{
      //sleep(3);
        if ($skippedRound){
          $sql = "DELETE FROM `questionsSingle` WHERE `questionNum`='".$_SESSION["questionNumber"]."'";
          $result = $conn->query($sql);
          $_SESSION["questionNumber"]--;
        }
        else {
          $sql = "UPDATE `questionsSingle` set `active`='3' WHERE `questionNum`='".$_SESSION["questionNumber"]."'";
          $result = $conn->query($sql);
          $skippedRound=true;
        }
    }
    //$theQuestion->alertUsers(-1);

    $seconds=date("s");
    $seconds=time();
    while ($seconds%($lengthOfGame+$lengthOfBreak)!=0)
    {
       sleep(1);
       $seconds=time();
     }
    //sleep(7);
    //echo $theQuestion->getLabel();
    $datetime1 = strtotime("now");//current datetime object
    //$datetime2 = mktime($hour, 59, 50);//next day at midnight
    //echo $datetime1 . " " . $datetime2;
    $timeUntilStop= ($datetime2 - $datetime1);///10;
    //echo "time is ".$timeUntilStop;
    sleep(1);

}

function getLastQuestion(){
  global $conn;
  $sql = "SELECT * FROM `questionsSingle` WHERE gameid ='1111' ORDER BY `questionNum` DESC LIMIT 1";
  $result = $conn->query($sql);
  if ($result)
  {
      $row = $result->fetch_assoc();
      return $row["questionNum"];
    }
}
 ?>
