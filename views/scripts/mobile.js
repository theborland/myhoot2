function setUpTimer(timeLeft){
        console.log(timeLeft);
        $('#timerBar').animate({
          width: "0%"
        }, timeLeft, "linear");


        var counter=setTimeout(timer, timeLeft); //1000 will  run it every 1 second
        }
        function timer()
        {
          //if (counter)
          //   clearInterval(counter);
           window.location.href = "showAnswerOther.php";
           count=33333;
             return;
        }


$(document).ready(function () {
    $("#form1").submit(function () {
        $(".regButton").attr("disabled", true);
        return true;
    });
});
