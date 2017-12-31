<?php
//phpinfo();
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
$min=date("m");
$datetime2 = mktime($hour, $min, 59);//next day at midnight
$timeUntilStop= $datetime1+2;
//die("time is ".$datetime1);


set_time_limit(0);


//$sql = "DELETE FROM `questionsSingle`";

//$result = $conn->query($sql);

$counter=0;
$skippedRound=false;
while ($timeUntilStop>strtotime("now")){
  echo "time is ".$timeUntilStop . "\n";
  //e
  echo memory_get_usage()."\n";
   $counter++;
   echo "$counter \n";
   //$datetime1 = strtotime("now");//current datetime object
   $hour=date("H");
   $min=date("m");

       usleep(500000);


}

 ?>
