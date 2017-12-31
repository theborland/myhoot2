function loadWaitingForUsers(gameID) {
  socket.on('connect', function(data) {
    socket.emit('create', gameID);
    console.log("listening for users");
  }); //'newUser', gameID,name,color
  socket.on('newUser', function(name, color) {
    var container = document.getElementById("nameUsers");
    var decodedName = decodeURI(name);
    name = name.replace(/%/g, "912");
    name = name.replace(/\./g, "913");
    container.innerHTML = '<div class="sqName" id="user_w_name_' + name + '" onClick="removeUser(\'' + name + '\')" style="background:#' + color + ';">' + decodedName + '<div class="sqNameRemove"><img src="img/X.png"></div></div>' + "" + container.innerHTML;
    var numUsers = document.getElementById("numUsers");
    numUsers.innerHTML = parseInt(numUsers.innerHTML) + 1;
  });

}

function notifyNewUserInGame(gameID, name, color) {
  socket.on('connect', function(data) {
    socket.emit('newUser', gameID, name, color);
    //socket.emit('send','<?php echo $_GET['id']; ?>','poop');
  });
}

function replay(gameID, newGameID) {
  socket.on('connect', function(data) {
    socket.emit('replay', gameID, newGameID);
  });
}

function inQuestion(gameID, qID) {

  socket.on('connect', function(data) {
    setTimeout(function() {
      console.log("in here");
      socket.emit('inQuestion', gameID, qID);
    }, 100);
  });


}

function submitAnswer(gameID, qID, name, miles, color) {
  socket.on('connect', function(data) {
    socket.emit('submitAnswers', gameID, qID, name, miles, color);
    console.log("submitting answers");
    //socket.emit('send','<?php echo $_GET['id']; ?>','poop');
  });
}

function alertUsers(gameID, qID, type) {
  socket.on('connect', function(data) {
    socket.emit('alertUsers', gameID, qID, type);
    //socket.emit('send','<?php echo $_GET['id']; ?>','poop');
  });
}

function loadWaitingForQuestion(gameID, name) {

  // conn.subscribe('Game'+gameID+'Status', function(topic, data) {
  console.log('Waiting for question to game' + gameID);
  //console.log(window.location.href);
  //console.log(window.location.href.indexOf("waiting")+window.location.href);
  socket.on('connect', function(data) {
    socket.emit('waiting', gameID);
  });

  socket.on('reject', function(data) {
    if (data.title.substring(0, 1) == "R" && data.title.substring(1) == encodeURI(name))
      window.location.href = 'joinQuizForm?message=Reject&game_id=' + gameID;
  });

  socket.on('place', function(data) {
    var userResults = data["n" + encodeURI(name)];
    if (userResults != null) {
      console.log(userResults);
      var comment="Ohhhh... I cant wait for the next one";
      var color="#ff0000";
      if (userResults.overallPlace<=userResults.roundPlace)
        color="#11a517";
      document.getElementById("placeNum").innerHTML = userResults.overallPlace;
      if (userResults.overallPlace == 1) document.getElementById("placeNum").innerHTML += "<sup>st</sup>";
      if (userResults.overallPlace == 2) document.getElementById("placeNum").innerHTML += "<sup>nd</sup>";
      if (userResults.overallPlace == 3) document.getElementById("placeNum").innerHTML += "<sup>rd</sup>";
      if (userResults.overallPlace > 3) document.getElementById("placeNum").innerHTML += "<sup>th</sup>";
      document.getElementById("placeNum").style.color=userResults.color;
      document.getElementById("totalNum").innerHTML = userResults.totalPlayers;
      document.getElementById("placeCommentBox").style.display = 'block';
      /*if (userResults.overallPlace < userResults.roundPlace-3)
        comment="Nice! You are moving fast up in the rankings!";
      if (userResults.overallPlace > userResults.roundPlace+3)
        comment = "Catch me, I'm falling. Let's not let that happen again.";
      if (userResults.overallPlace ==1)
        comment = "You are the best.  Beautiful and smart, a lethal combination";
      if (userResults.overallPlace ==2)
        comment = "Remember 2nd place is just first loser - go get 'em tiger";
      if (userResults.overallPlace ==3)
        comment = "Sure you might be on the podium, but they're not playing your song.  Lets do this.";
      if (userResults.overallPlace <=4 && userResults.overallPlace>=7)
        comment = "Okay, if I just log off all those people in front of you, you'd be in first.  Nice job. ";
        if (userResults.overallPlace >=12)
          comment = "I think at this point, you should just copy the answer of the nearest person.";

    if (userResults.overallPlace < userResults.roundPlace){
      document.getElementById("arrows").style.color="#11a517";
      document.getElementById("arrows").style.fontSize=48;
    }
    else
    if (userResults.overallPlace < userResults.roundPlace){
      document.getElementById("arrows2").style.color="#ff0000";
      document.getElementById("arrows2").style.fontSize=48;
    }

      document.getElementById("placeComment").innerHTML = comment;
      */
    }


  });

  socket.on('newQ', function(data) {
    // console.log("here");
    // console.log(data);
    // console.log("~"+name + "~");
    //console.log(data.title.substring(1));
    console.log(window.location.href.indexOf("waiting") + "df" + window.location.href);
    var container = document.getElementById("waitingDiv");
    if (data.type == "end")
      window.location.href = 'waitingScreenEnd';

    else if (data.title.substring(1) == "-1" && (window.location.href.indexOf("waiting") == -1 && window.location.href.indexOf("submit") == -1)) {
      console.log("REDIRECTING");
      window.location.href = 'waitingScreen?message=nosubmit';
    } else if (data.title.substring(0, 1) == "Q" && data.title != "Q-1") {
      if (data.type == "geo" || data.type == "pt" || data.type == "places")
        window.location.href = 'userScreen?question=' + data.title.substring(1);
      else {
        window.location.href = 'userScreenOther?question=' + data.title.substring(1);
      }
      // else if (data.type == "facts")
      //   window.location.href = 'userScreenDecimal?perc=no&question=' + data.title.substring(1);
      // else if (data.type == "factsMax")
      //   window.location.href = 'userScreenDecimal?perc=no&max=yes&question=' + data.title.substring(1);
      // else if (data.type == "factsPercent")
      //   window.location.href = 'userScreenDecimal?perc=yes&question=' + data.title.substring(1);
      // else if (data.type == "science" || data.type == "sports" || data.type == "entertainment" || data.type == "factsRand" || data.type == "estimation")
      //   window.location.href = 'userScreenRand?question=' + data.title.substring(1);
      // else if (data.type.substring(0, 9) == "WorldTime")
      //   window.location.href = 'userScreenWorldTime?region=' + data.type.substring(9) + '&perc=no&question=' + data.title.substring(1);
      // else if (data.type.substring(0, 4) == "time")
      //   window.location.href = 'userScreenWorldTime?sender=ss&region=4&perc=no&question=' + data.title.substring(1);
      // else
      //   window.location.href = 'userScreen' + capitalizeFirstLetter(data.type) + '?sender=ssa&question=' + data.title.substring(1);

    }
  });



}


function loadWaitingForAnswers(gameID, questionNumber, auto, numUsers, type) {
  socket.on('connect', function(data) {
    socket.emit('waitingAnswers', gameID, questionNumber);
  });
  socket.on('newA', function(name, miles, color) {
    data = {
      title: name,
      color: color,
      miles: miles
    };
    console.log('Getting name:"' + data.title);
    console.log('Getting color:"' + data.color);
    var numAnswers = document.getElementById("numAnswers");
    numAnswers.innerHTML = parseInt(numAnswers.innerHTML) + 1;
    var userAnswers = document.getElementById("userAnswers");
    var r = hexToRgb(data.color).r;
    var g = hexToRgb(data.color).g;
    var b = hexToRgb(data.color).b;
    answersWrap.innerHTML = answersWrap.innerHTML + '<div class="userAnswer" style="background-color: rgba(' + r + ',' + g + ',' + b + ',.8);">' + data.title + '<div class="userResult">' + data.miles + '</div></div>';

    //<div class="userAnswer" style="background:#38D38E;">John <div class="userResult">434,134</div></div>
    if (parseInt(numAnswers.innerHTML) == parseInt(numPlayers.innerHTML) && counter < 27 && counter > 2 && auto == "yes" && parseInt(numPlayers.innerHTML) >= numUsers) {
      counter = 50000;
      setTimeout(function() {

        if (type == "geo" || type == "places" || type == "pt")
          window.location.href = 'showAnswer';
        else
          window.location.href = 'showAnswer';
      }, 2000);
    }
  });
}

function findingNumberOfUsers(gameID, questionNumber) {
  //console.log("listening for another user");
  socket.on('anotherUser', function() {
    console.log('another user');
    var numPlayers = document.getElementById("numPlayers");
    numPlayers.innerHTML = parseInt(numPlayers.innerHTML) + 1;
  });

}

function loadWaitingForNextGame(gameID) {
  socket.on('connect', function(data) {
    socket.emit('waiting', gameID);
  });
  socket.on('replay', function(newGameID) {
    var container = document.getElementById("waitingDiv");
    window.location.href = 'joinQuizForm?replay=yes&game_id=' + newGameID;

  });

}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
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
