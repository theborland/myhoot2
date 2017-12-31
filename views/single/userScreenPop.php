<?php
session_start();
require '../controller/dbsettings.php';
if (isset($_GET["question"]))
  if (Answer::checkUserSubmitted($_GET["question"],$_SESSION["user_id"])  )
    header("Location: waitingScreen.php?message=".urlencode("come on - you cant submit twice"));
    $_SESSION["questionNumber"]=Game::questionStatusRedirect();
    $theQuestion=Question::loadQuestion();

    $seconds=time();
    $timeLeft=($seconds%($lengthOfGame+$lengthOfBreak)-$lengthOfGame)*-1;

?>
<html>
  <head>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
 <link rel="stylesheet" href="../style/global.css">

<link href="../style/nouislider.min.css" rel="stylesheet">
<link rel="stylesheet" href="../style/inputSlider.css">
    <style>
      html, body {
        height: 100%;
        margin: 0px;
        padding: 0px
        background: #4449A2;
      }

      #overlayWrap{
        top:0px;
        bottom: 0px;
        height: auto;
        position: fixed;
        background: #4449A2;
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
    <script src="../scripts/mobile.js"></script>
  <script>

  window.onload = function(){
     var timeLeft = <?php echo $timeLeft; ?> * 1000;
     setUpTimer(timeLeft);
    loadSlider();
  }

  //  var nf = new Intl.NumberFormat();



    function changeValue(value) {
      //var range = document.getElementById("isRange");
      var valbox = document.getElementById("isValue");
      var answer = document.getElementById("answer");

      if(parseInt(value) > 2140){
        valbox.value = "2,000,000,000";
        answer.value = "2000000000";
      }else{
        var afterScale = Math.round(Math.pow(Math.E, (parseInt(value)/100))/100000)*100000
        valbox.value = afterScale.toLocaleString();
        answer.value = afterScale;
      }
            //Math.round(value/100)*100
        //x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }












    </script>

 </head>
 <body>
 <script src="../scripts/nouislider.min.js"></script>




  <div id="overlayWrap">
  <div id="timerBar"></div>
    			<a href="http://GameOn.World" id="logoLink"><img src="../img/logo.svg" id="logo"></a>
      <form id="form1" name="form1" method="post" action="submitAnswer.php">
        <input name="questionNumber" type="hidden" value="<?php echo $_GET["question"] ?>">
        <input type="hidden" id="answer" name="answer">


          <center id="submitWrap">
            <input type="text" id="isValue" name="isValue" value="5,000,000" readonly>
            <div id="newSlider"></div>
          </center>
                      <input type="submit" name="submit"  class="regButton" id="userMapSubmit" value="Submit!">

          <!--
          <div id="relativeWrap">
            <div id="rangeLineWrap">
              <div class="rangeLine"></div>
              <div class="rangeLine"></div>
              <div class="rangeLine"></div>
              <div class="rangeLine"></div>
              <div class="rangeLine"></div>
            </div>
            <input type="range" id="isRange" list="numbers" step="10" name="isRange" for="isValue" min="1320" max="2141.64130" value="1541" oninput="changeValue()">
            <datalist id="numbers">
              <option>10</option>
              <option label="30">30</option>
              <option label="midpoint">50</option>
              <option>70</option>
              <option>90</option>
            </datalist>
            -->

          </div>
      </form>
  </div>

  <div id="questionWrap">
    <div id="actualQuestion"><?php echo $theQuestion->getQuestionText(); ?> <?php echo $theQuestion->getLabel(); ?> <?php echo $theQuestion->getQuestionTextEnd(); ?>?</div>
  </div>



    <script type="text/javascript">

    $(document).ready(function () {
        $("#form1").submit(function () {
            $(".regButton").attr("disabled", true);
            return true;
        });
    });


function loadSlider(){



  var slider = document.getElementById('newSlider');
  var valbox = document.getElementById("isValue");
  var answer = document.getElementById("answer");

  noUiSlider.create(slider, {
    start: [10000000],
    connect: "lower",
    orientation: "vertical",
    direction: 'rtl',
    range: {
      'min': [100000],
      '10%': [2000000],
      '20%': [5000000],
      '30%': [10000000],
      '40%': [20000000],
      '50%': [40000000],
      '60%': [80000000],
      '70%': [160000000],
      '80%': [320000000],
      '90%': [1000000000],
      'max': [2000000000]
    },pips: { // Show a scale with the slider
      mode: 'steps',
      density: 2
    }
  });


  slider.noUiSlider.on('update', function( values, handle ) {
      a = (Math.round(values[handle]/100000)*100000);
      valbox.value = comma(a);
      answer.value = a;
      //changeValue(values[handle]);
  });

  labels = document.getElementsByClassName("noUi-value-large");
  for(var i=0; i<labels.length;i++){
    val = parseInt(labels[i].innerHTML);
    labels[i].innerHTML = comma(val);
    if((i)%5 != 0)
      labels[i].className = labels[i].className + " smallLabel";
  }

  markers = document.getElementsByClassName("noUi-marker-large");
  for(var i=0; i<markers.length;i++){
    //val = parseInt(markers[i].innerHTML);
    //markers[i].innerHTML = comma(val);
    if(i%5 != 0)
      markers[i].className = markers[i].className + " smallMarker";
  }



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

</script>



 </body>
 </html>
