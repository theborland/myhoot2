function loadWaitingForUsers(ip,gameID){
    var conn = new ab.Session('ws://'+ip+':8080',
    function() {
    //  alert('Game'+gameID);
        conn.subscribe('Game'+gameID, function(topic, data) {
            console.log('Waiting for users:"' + topic + '" : ' + data.title);
          var container = document.getElementById("nameUsers");
    container.innerHTML =data.title   + "<br>"+container.innerHTML;
            var numUsers = document.getElementById("numUsers");
    numUsers.innerHTML = parseInt(numUsers.innerHTML)  + 1;
        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
    );

}
function loadWaitingForAnswers(ip,gameID,questionNumber,auto){
    var conn = new ab.Session('ws://'+ip+':8080',
    function() {
        conn.subscribe('Game'+gameID+''+questionNumber+'', function(topic, data) {
            console.log('Getting name:"' + topic + '" : ' + data.title);
            console.log('Getting color:"' + topic + '" : ' + data.color);
            var numAnswers = document.getElementById("numAnswers");
            numAnswers.innerHTML = parseInt(numAnswers.innerHTML)  + 1;
            var userAnswers = document.getElementById("userAnswers");
            var r=hexToRgb(data.color).r;
            var g=hexToRgb(data.color).g;
            var b=hexToRgb(data.color).b;
            userAnswers.innerHTML = userAnswers.innerHTML  + '<div class="uaItem" style="background-color: rgba('+r+','+g+','+b+',.5);"><div class="uLabel">'+data.title+'</div><div class="uScore">'+data.miles+'</div></div>';
             if (parseInt(numAnswers.innerHTML) ==parseInt(numPlayers.innerHTML) && counter<27 && auto=="yes")
              setTimeout(function (){
                    window.location.href='showAnswer.php';
                  }, 2000);

         });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
    );
  }
  function findingNumberOfUsers(ip,gameID,questionNumber){
      var conn = new ab.Session('ws://'+ip+':8080',
      function() {
          conn.subscribe('InGame'+gameID+'-'+questionNumber, function(topic, data) {
              console.log('Getting answers:"' + topic + '" : ' + data.title);
              var numPlayers = document.getElementById("numPlayers");
              numPlayers.innerHTML = parseInt(numPlayers.innerHTML)  + 1;
          });
      },
      function() {
          console.warn('WebSocket connection closed');
      },
      {'skipSubprotocolCheck': true}
      );
    }
  function loadWaitingForQuestion(ip,gameID){
    var conn = new ab.Session('ws://'+ip+':8080',
    function() {
      conn.subscribe('Game'+gameID+'Status', function(topic, data) {
        console.log('Waiting for users:"' + topic + '" : ' + data.title);
        var container = document.getElementById("waitingDiv");
        if (data.title.substring(1)=="-1" && window.location.href.indexOf("waiting")==-1)
          window.location.href='waitingScreen.php';
        else if (data.title.substring(0,1)=="Q")
        {
            if (data.type=="geo")
              window.location.href='userScreen.php?question='+data.title.substring(1);
          else
              window.location.href='userScreen'+capitalizeFirstLetter(data.type)+'.php?question='+data.title.substring(1);
            /*if (data.type=="pop")
              window.location.href='userScreenPop.php?question='+data.title.substring(1);
            if (data.type=="weather")
                window.location.href='userScreenWeather.php?question='+data.title.substring(1);
            if (data.type=="age")
                window.location.href='userScreenAge.php?question='+data.title.substring(1);
            if (data.type=="user")
                window.location.href='userScreenAge.php?question='+data.title.substring(1);
            if (data.type=="time")
                window.location.href='userScreenTime.php?question='+data.title.substring(1);
            if (data.type=="rand")
                    window.location.href='userScreenRand.php?question='+data.title.substring(1);*/
        }
            });

    },
    function() {
      console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
  );
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
