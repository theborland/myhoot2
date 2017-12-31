<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta charset="UTF-8">
	
    <link rel="stylesheet" href="style/global.css">
    <link rel="stylesheet" href="style/joinQuiz.css">
    <link rel="stylesheet" href="style/startQuiz.css">

	<script src="mapdata.js"></script>
	<script src="continentmap.js"></script>
	<script src="http://gameon.world/scripts/autobahn.min.js"></script>
	<script src="socketScripts.js"></script>
	<script src="scripts/startQuiz.js"></script>

	<script>



	window.onload = function() {
		//alert($("#qInfoLocation").height());
	    /*if (readCookie("playMusic")=="false"){
	    	muteOff();
		}*/

	  //set originally on restart
	  <?php /*
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
	          */?>
	      
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
/*
	// loadWaitingForUsers('<?php //echo $pusherIP; ?>' ,<?php //echo $_SESSION["game_id"]; ?>);
*/
	</script>

	<title>Start Quiz</title>
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




	
</body>
</html>

 <html>
 <head>

