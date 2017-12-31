var db = require('../db.js');

class GameLogic {
  static setupGame(post, session, callback) {
    console.log("setting up game");
    var gamesSelected = [];
    var regionsSelected = []
    //   _SESSION["playedGames"]=array();
    if (post.r_SA == "true") {
      regionsSelected.push(2);
      regionsSelected.push(3);
      regionsSelected.push(4);
    }
    if (post.r_NA == "true") {
      regionsSelected.push(1);
    }
    if (post.r_EU == "true") {
      regionsSelected.push(6);
      regionsSelected.push(5);
    }
    if (post.r_AF == "true") {
      regionsSelected.push(8);
      regionsSelected.push(13);
    }
    if (post.r_NS == "true") {
      regionsSelected.push(11);
    }
    if (post.r_ME == "true") {
      regionsSelected.push(7);
    }
    if (post.r_SS == "true") {
      regionsSelected.push(9);
    }
    if (post.r_OC == "true") {
      regionsSelected.push(10);
    }

    if (post.statesCB == "statesCB" && post.r_NA == "true") {
      regionsSelected.push(20);
    }
    if (post.statesCB == "statesCB" && post.r_NA == "false" && regionsSelected.length == 0) {
      regionsSelected.push(20);
    }
    if (post.gsAge == "true") gamesSelected.push("age");
    if (post.gsHist == "true") gamesSelected.push("time");
    if (post.gsTemp == "true") gamesSelected.push("weather");
    if (post.gsPT == "true") gamesSelected.push("pt");
    if (post.gsPlaces == "true") gamesSelected.push("places");
    if (post.gsScience == "true") gamesSelected.push("science");
    if (post.gsSports == "true") gamesSelected.push("sports");
    if (post.gsEntertainment == "true") gamesSelected.push("entertainment");
    if (post.gsFacts == "true") gamesSelected.push("facts");
    if (post.gsEstimation == "true") gamesSelected.push("estimation");
    if (post.gsBrain == "true") gamesSelected.push("mih");
    if (post.gsGeo == "true") {
      for (var i = 0; i < gamesSelected.length; i++)
        if (gamesSelected.length <= 7)
          gamesSelected.push("geo");

    }
    if (gamesSelected.length <= 0)
      gamesSelected.push("geo");
    session.regionsSelected = regionsSelected;
    session.gamesSelected = (gamesSelected);
    session.numRounds = post.numRounds;
    session.auto = post.auto;
    session.questionNumber = 0;
    session.playedGames = [];

    // console.log(session);
    return callback(null);
  }

  static selectQuestion(session, callback) {
    console.log("in selecting q"+ session);
    if (session.questionNumber >= session.numRounds) {
      //     header( 'Location: endScreen.php') ;
      //     die();
      return callback(true, "gameover");
    } else {
      var gamesSelected = session.gamesSelected
      //console.log("games is "+ session)
      var playedGames = session.playedGames
      var current
      if ((playedGames.length) == 0)
        current = gamesSelected[Math.floor(Math.random() * gamesSelected.length)];
      else {
        var idealArray = {};
        for (var i = 0; i < gamesSelected.length; i++) {
          var key = gamesSelected[i];
          idealArray[key] = (idealArray[key]) ? idealArray[key] + 1 : 1;
        }
        var currentArray = {};
        for (var i = 0; i < playedGames.length; i++) {
          var key = playedGames[i];
          currentArray[key] = (currentArray[key]) ? currentArray[key] + 1 : 1;
        }

        current = gamesSelected[Math.floor(Math.random() * gamesSelected.length)];
        while (current in currentArray && currentArray[current] / playedGames.length > idealArray[current] / gamesSelected.length) {
          //echo ("current". current.(currentArray[current]/sizeof(playedGames)));
          current = gamesSelected[Math.floor(Math.random() * gamesSelected.length)];
        }
        //
      }
      //theQuestion=new Question(current);
      if (current == "age") current = "entertainment";
      if (current == "pop") current = "facts";
      playedGames.push(current);
      session.playedGames = playedGames;
      //console.log(session);
      //print_r(playedGames);
      //print_r(gamesSelected);
      return callback(null, current);
    }
  }

}
// whitelist = array('statesCB','numRounds','gsScience','gsSports','gsEntertainment','gsEstimation','gsFacts','gsPT','gsPlaces','gsGeo','gsAge','gsHist','gsPop','gsTemp','gsRand','r_SA','r_EU','r_AF','r_NS','r_SS','r_ME','r_OC','r_NA');
// require 'controller/dbsettings.php';
// //echo print_r(_GET["games"]);
//
// if (!isset(_SESSION["game_id"]) || _SESSION["game_id"]==0)
//   _SESSION["game_id"]=Game::findGameID();
//    //die("no game id");
// if (gsGeo=="false" || gsGeo=="true")
// {
//   //die (post.r_OC);
//   gamesSelected=array();
//   regionsSelected=array();
//   _SESSION["playedGames"]=array();
//   if (post.r_SA=="true"){regionsSelected.push(2;regionsSelected.push(3;regionsSelected.push(4;}
//   if (post.r_NA=="true"){regionsSelected.push(1;}
//   if (post.r_EU=="true"){regionsSelected.push(6;regionsSelected.push(5;}
//   if (post.r_AF=="true"){regionsSelected.push(8;regionsSelected.push(13;}
//   if (post.r_NS=="true"){regionsSelected.push(11;}
//   if (post.r_ME=="true"){regionsSelected.push(7;}
//   if (post.r_SS=="true"){regionsSelected.push(9;}
//   if (post.r_OC=="true"){regionsSelected.push(10;}
//   if (statesCB=="statesCB" && post.r_NA=="true"){regionsSelected.push(20;}
//   if (statesCB=="statesCB" && post.r_NA=="false" && sizeof(regionsSelected)==0){regionsSelected.push(20;}
//   if (gsAge=="true")gamesSelected.push("age";
//   if (gsHist=="true")gamesSelected.push("time";
//   if (gsTemp=="true")gamesSelected.push("weather";
//   if (gsPT=="true")gamesSelected.push("pt";
//   if (gsPlaces=="true")gamesSelected.push("places";
//   if (gsScience=="true")gamesSelected.push("science";
//   if (gsSports=="true")gamesSelected.push("sports";
//   if (gsEntertainment=="true")gamesSelected.push("entertainment";
//   if (gsFacts=="true")gamesSelected.push("facts";
//   if (gsEstimation=="true")gamesSelected.push("estimation";
//   if (gsGeo=="true"){
//     foreach (gamesSelected as key)
//         if (sizeof(gamesSelected)<=7)
//             gamesSelected.push("geo";
//   }
//   if (sizeof(gamesSelected)==0)
//      gamesSelected.push("geo";
//   //die (print_r(regionsSelected));
//   _SESSION["gamesSelected"]=gamesSelected;
//   _SESSION["regionsSelected"]=regionsSelected;
//   _SESSION["numRounds"]=numRounds;
//
//   if (isset(_GET["auto"]))
//       _SESSION["auto"]=_GET["auto"];
//   else
//       _SESSION["auto"]="";
//   //echo "her";
//   //print_r(regionsSelected);
// }
// //die (numRounds);
// if (_SESSION["questionNumber"]>=_SESSION["numRounds"]){
//     header( 'Location: endScreen.php') ;
//     die();
// }
// else {
//     gamesSelected=_SESSION["gamesSelected"];
//     playedGames=_SESSION["playedGames"];
//     if (sizeof(playedGames)==0)
//         current=gamesSelected[rand(0,count(gamesSelected)-1)];
//     else {
//         idealArray =array_count_values(gamesSelected);
//         currentArray =array_count_values(playedGames);
//         current=gamesSelected[rand(0,count(gamesSelected)-1)];
//         while (array_key_exists(current,currentArray) && currentArray[current]/sizeof(playedGames)>idealArray[current]/sizeof(gamesSelected))
//         {
//           //echo ("current". current.(currentArray[current]/sizeof(playedGames)));
//            current=gamesSelected[rand(0,count(gamesSelected)-1)];
//         }
//         //
//     }
//     theQuestion=new Question(current);
//     if (current=="age")current="entertainment";
//     if (current=="pop")current="facts";
//     playedGames.push(current;
//     _SESSION["playedGames"]=playedGames;
//     //print_r(playedGames);
//     //print_r(gamesSelected);
//   }
module.exports = GameLogic;
