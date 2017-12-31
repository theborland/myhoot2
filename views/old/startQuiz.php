<?php
session_start();
//$_SESSION = array();
//$_SESSION["auto"]="";
require 'controller/dbsettings.php';
//create game
Game::createGame();

//die ($_SESSION["auto"]);
 ?>
 <html>
 <head>
 	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="style/global.css">
    <link rel="stylesheet" href="style/joinQuiz.css">
    <link rel="stylesheet" href="style/startQuiz.css">

	<script src="mapdata.js"></script>
	<script src="continentmap.js"></script>
	<script src="http://gameon.world/scripts/autobahn.min.js"></script>
	<script src="socketScripts.js"></script>
	<script src="scripts/startQuiz.js"></script>
	<script src="scripts/music.js"></script>
<script>



window.onload = function() {
	//alert($("#qInfoLocation").height());
    if (readCookie("playMusic")=="false"){
    	muteOff();
	}

  //set originally on restart
  <?php
  $games = array('gsGeo', 'gsPop', 'gsTemp', 'gsAge', 'gsHist', 'gsRand');
  $match=array('geo','pop','weather','age','time','rand');
  for ($i=0;$i<6;$i++)
      if (isset($_SESSION["gamesSelected"]) && in_array($match[$i],$_SESSION["gamesSelected"]) ||
         ($i==0 && !isset($_SESSION["gamesSelected"]))
      ){
  ?>
        var check="<?php echo $games[$i] ?>";
        var name="<?php echo "gs".($i+1); ?>";
        var cs = document.getElementById(name).children;
        var child = null;
        for(i=0; i<cs.length; i++){
          if(cs[i].className == "gsCheck"){
            child = cs[i];
          }
        }
        child.style.display = "block";
        document.getElementById(name).classList.add("gsSel");
        document.getElementById(check).value = "true";
  <?php
      }
      // now autoplay

      if (!isset($_SESSION["auto"]) || $_SESSION["auto"]=="yes")
          echo 'document.getElementById("autoplayCB").checked = "true";'."\n";
      if (isset($_SESSION["numRounds"]))
          echo "var rounds=".$_SESSION["numRounds"].";\n";
      else
          echo "var rounds=15;\n";
          ?>
      var allRounds = document.getElementById("numRounds");
      for (i = 0; i < allRounds.options.length; i++) {
          if  (allRounds.options[i].value==rounds){
             allRounds.selectedIndex=i;
           }
      }


	var games = ['gsGeo', 'gsPop', 'gsTemp', 'gsAge', 'gsHist', 'gsRand'];

    for(var i = 0; i < 6; i++) {
        var gs = document.getElementById("gs"+(i+1));
       var c = gs.className;
       gs.onclick = function() {
        	var name = games[parseInt(this.id.charAt(this.id.length-1)) - 1];
        	var cs = this.children;
        	var check = null;
        	for(i=0; i<cs.length; i++){
        		if(cs[i].className == "gsCheck"){
        			check = cs[i];
        		}
        	}

            if(this.className.indexOf("gsSel") >= 0){
            	this.classList.remove("gsSel");
            	check.style.display = "none";
            	document.getElementById(name).value = "false";
            }else{
            	this.classList.add("gsSel");
            	check.style.display = "block";
            	document.getElementById(name).value = "true";
            }
        }
    }


    /*  ----   ---- */



    setTimeout(function(){
        for(var i = 0; i < continents.length; i++) {
        var gs = document.getElementsByClassName(continents[i]);
       //var c = gs.className;
       //alert(gs.className);
       	gs[0].classList.add("pathSelected");
        gs[0].onclick = function() {
            if(((String)(this.classList)).indexOf("pathSelected") >= 0){
            	this.classList.remove("pathSelected");
            	document.getElementById(((String)(this.classList)).split(" ")[0]).value = "false";
            	selected--;
            }else{
            	this.classList.add("pathSelected");
            	document.getElementById(((String)(this.classList)).split(" ")[0]).value = "true";
				selected++;
            }
            animateSelectAll();
        }
    }

    }, 100);



}

 loadWaitingForUsers('<?php echo $pusherIP; ?>' ,<?php echo $_SESSION["game_id"]; ?>);

</script>
 </head>
 <body>

<audio id="bgMusic" autoplay loop enablejavascript="yes">
  <source src="title.mp3"  type="audio/mpeg">
	Your browser does not support the audio element.
</audio>

<input type="button" id="muteButton" onclick="mute()">

<form action="getQuestion.php">
<div id="mapBlur"  onclick="hidemap()"></div>
<div id="mapWrap">
	<h1>
		Select Regions
		<div id="statesWrap">
			<label for="statesCB" class="jqLabel" id="statesLabel">US STATES</label>
			<input type="checkbox" id="statesCB" name="statesCB" value="statesCB" checked>
		</div>
	</h1>

	<div id="map"></div>

	<div id="mapFootnote">
		<input type="button" id="selectAll" onclick="selectall()">
		These selections apply to Geography, Population and Weather categories.
		<div id="closeMap" onclick="hidemap()">Done</div>
	</div>
</div>

	<div id="jqWrap" method="GET">
		<img src="logo.svg" id="logo">
		<h4>Starting a Quiz</h4>

		<div id="colsWrap">
			<div id="col1">
				<label class="jqLabel"><div id="numUsers" style="display:inline-block;">0</div> USERS IN THE GAME</label>
				<div id="usersWrap">
					<div id="nameUsers">
					</div>
				</div>

			</div>
			<div id="col2">
				<div id="gsWrap">
				<label class="jqLabel" style="margin-left:10px;text-align: left;">GAME TYPES</label>
					<div class="gsItem" id="gs1">
						<img src="img/map.png" class="gsImg" alt="">
						<div class="gsCheck" style="display:none;"></div>
						<div class="gsName">GEOGRAPHY</div>
					</div>
					<div class="gsItem" id="gs2">
						<img src="img/population.png" class="gsImg" alt="">
						<div class="gsCheck"></div>
						<div class="gsName">POPULATIONS</div>
					</div>
					<div class="gsItem" id="gs3">
						<img src="img/temp.png" class="gsImg" alt="">
						<div class="gsCheck"></div>
						<div class="gsName">WEATHER</div>
					</div>
					<div class="gsItem" id="gs4">
						<img src="img/star.png" class="gsImg" alt="">
						<div class="gsCheck"></div>
						<div class="gsName">CELEBRITY AGES</div>
					</div>
					<div class="gsItem" id="gs5">
						<img src="img/history.png" class="gsImg" alt="">
						<div class="gsCheck"></div>
						<div class="gsName">HISTORY</div>
					</div>
         			<div class="gsItem" id="gs6">
						<img src="img/temp.png" class="gsImg" alt="">
						<div class="gsCheck"></div>
						<div class="gsName">RANDOM</div>
					</div>
					<div id="showMap" onclick="showmap()">Select Regions</div>
				</div>
			</div>
			<div id="col3">
				<label class="jqLabel">QUIZ ID</label>
				<div id="quizidWrap">
					<div id="quizid">
						<?php echo $_SESSION["game_id"] ; ?>
					</div>
				</div>
				<br>

					<input type="hidden" name="gsGeo" id="gsGeo" value="false">
					<input type="hidden" name="gsAge" id="gsAge" value="false">
					<input type="hidden" name="gsHist" id="gsHist" value="false">
					<input type="hidden" name="gsPop" id="gsPop" value="false">
					<input type="hidden" name="gsTemp" id="gsTemp" value="false">
   					<input type="hidden" name="gsRand" id="gsRand" value="false">

					<!--regions-->
					<input type="hidden" name="r_SA" id="sm_state_SA" value="true">
					<input type="hidden" name="r_NA" id="sm_state_NA" value="true">
					<input type="hidden" name="r_EU" id="sm_state_EU" value="true">
					<input type="hidden" name="r_AF" id="sm_state_AF" value="true">
					<input type="hidden" name="r_NS" id="sm_state_NS" value="true">
					<input type="hidden" name="r_SS" id="sm_state_SS" value="true">
					<input type="hidden" name="r_ME" id="sm_state_ME" value="true">
					<input type="hidden" name="r_OC" id="sm_state_OC" value="true">

						<label for="numRounds" class="jqLabel" id="numRoundsLabel">
							NUMBER OF ROUNDS
							<select id="numRounds" name="numRounds">
	              <option value="2">2</option>
              	<option value="10">10</option>
								<option value="15">15</option>
								<option value="20">20</option>
								<option value="9999">infinite</option>
							</select>
						</label>
						<label for="autoplayCB" class="jqLabel" id="autoplayLabel">
							AUTOPLAY
							<input type="checkbox" id="autoplayCB" name="auto" value="yes">
						</label>
						<input type="submit" id="jqJoin" value="Start">
			</div>
		</div>
	</form>



	</div>
	<div id="joinHere">
		Join at <div id="link">myonlinegrades.com/j</div>
	</div>
	<div id="footer">
		Copyright and stuff.
	</div>

 </body>
 </html>
