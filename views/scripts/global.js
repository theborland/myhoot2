var playing = true;
var gameplaying = true;

function mute() {
  if (playing == true)
    muteOff();
  else
    muteOn();
}

function muteOn() {
  var music = document.getElementById("bgMusic");
  var button = document.getElementById("muteButton");
  music.play();
  music.volume = 1;
  playing = true;
  button.style.backgroundImage = "url(img/mute.svg)";
  document.cookie = "playMusic=true";
}

function muteOff() {
  var music = document.getElementById("bgMusic");
  var button = document.getElementById("muteButton");
  music.volume = 0;
  playing = false;
  button.style.backgroundImage = "url(img/mute2.svg)";
  document.cookie = "playMusic=false";
}

function switchGame() {
  if (gameplaying == true)
    pausegame();
  else
    playgame();
}

function switchGameWAnimation() { // same as switchGame, but pauses animation on the timer bar
  //alert('in here' + gameplaying);
  if (gameplaying == true) {
    pausegame();
    $('#timer').pause();
  } else {
    playgame();
    $('#timer').resume();
  }

}


function playgame() {
  var button = document.getElementById("playGameButton");
  gameplaying = true;
  button.style.backgroundImage = "url(img/pause.svg)";
}

function pausegame() {
  var button = document.getElementById("playGameButton");
  gameplaying = false;
  button.style.backgroundImage = "url(img/play.svg)";
}




function fullscreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}