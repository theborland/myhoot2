<?php
session_start();
require 'controller/dbsettings.php';
$allAnswers=new AllAnswers($_SESSION["questionNumber"]);
?>
<html>
<head>
<style type="text/css">
      html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}
    </style>
</head>
<body>

Answer:
<?php
$allAnswers->getTP();
foreach ($allAnswers->allAnswers as $key => $value) {  ?>
  User: <?php echo $value->name; ?>
  Distance away:  <?php echo $value->distanceAway; ?> miles away.
  Points this round: <?php echo $value->roundPoints; ?> 
  Total miles: <?php echo $value->totalMiles; ?>
  Total points:  <?php echo $value->totalPoints; ?>
  <br>
  <?php
}


 ?>

<a href="getQuestion.php">Next Question
</a>
</body>
</html>
