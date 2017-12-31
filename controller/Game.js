var db = require('../db.js');

//db.connectDatabase();
class Game {
  constructor(round, type) {
    this.round = round;
    this.type = type;
  }

  static createGame(callback) {
    var game_id = Math.floor(Math.random() * 89999) + 10000;
    game_id = Game.findGameID(game_id);
    //console.log(game_id);
    db.getQuery("INSERT INTO `games` (`game_id`,`ip`) VALUES ('" + game_id + "','0')", function(err, results) {
      if (err) {
        console.log(err);
        return callback(false);
      }
      else{
          console.log("ADDED GAME");
          return callback(game_id);
      }

    });
    //return game_id;


    // db1.query("SELECT COUNT(id) as total FROM answers", function (err, result, fields) {
    //     if (err) throw err;
    //     var answers=""+result[0].total;
    //     console.log("in main"+answers);
    //   });
    // global $conn;
    // $game_id=rand(10000,99999);
    // if ($game_idSet!=null)
    // 	$game_id=1111;
    // if ($replay=="yes")$lastGame_ID=$_SESSION["game_id"];
    // date_default_timezone_set('America/New_York');
    // //die (date("z"));
    // $_SESSION["game_id"]=$game_id.(	str_pad(date("z"), 3, "0", STR_PAD_LEFT));
    // //if ($single==true)
    // if ($game_idSet!=null)
    // 	$_SESSION["game_id"]=$game_id=1111;
    // //   $_SESSION["game_id"]*=00;//, $single=false
    // //$_SESSION["game_id"] =$_GET['game_id'];
    // //$_SESSION["user_id"] =rand (0,111111111);
    // $sql = "INSERT INTO `games` (`game_id`,`ip`) VALUES ('$_SESSION[game_id]','0')";
    //
    // //$sql = "INSERT INTO `games` (`game_id`,`ip`) VALUES ('$_SESSION[game_id]','".$_SERVER['REMOTE_ADDR']."')";
    // //echo $sql;
    // $result = $conn->query($sql);
    //
    // $_SESSION["questionNumber"]=0;
    // Game::updateRound(-1);
    //
    // if ($replay=="yes"){
    // 	//SOCKET SENDING MESSAGE
    // 	$entryData = array(
    // 		'category' => "Game".$lastGame_ID."NextGame"
    // 		, 'title'    => substr($_SESSION["game_id"],0,5)
    // 	);
    //
    // 	$entryData = array(
    // 		'category' => "Game".$lastGame_ID."Status"
    // 		, 'title'    => substr($_SESSION["game_id"],0,5)
    // 		, 'type'    => "NextGame"
    // 	);
    // 	$_SESSION['JS']="replay(".$lastGame_ID.",".substr($_SESSION['game_id'],0,5).");";
    // 	//$socket->send(json_encode($entryData));

  }



  static findGame(game_id, callback) {
    game_id = Game.findGameID(game_id);
    var sql = "SELECT round,type FROM `games` WHERE `game_id` = '" + game_id + "'";
    db.getQuery(sql, function(err, results) {
      if (err || results.length==0) {
        console.log(err);
        return callback(true);
      }
      //console.log(results);
      if (results[0].length == 0)
        return callback(true);
     //console.log(results[0].round);
      var round = results[0].round;
      var type = results[0].type;
      var g=new Game(round, type)
      //console.log(round);
      return callback(false, g);
    });


  }

  static findGameID(game_id) {
    if (("" + game_id).length < 7) {
      var today = new Date();
      var date_to_reply = new Date('2017-11-01');
      var timeinmilisec = today.getTime() - date_to_reply.getTime();
      game_id += "" + Math.ceil(1000 + timeinmilisec / (1000 * 60 * 60 * 24))
    }
    return game_id;

  }

  static updateRound(game_id,questionNumber,type)
	{
		var sql = "UPDATE `games` SET `round`='"+questionNumber+"', `type`='"+type+"' WHERE `game_id` = '"+game_id+"'";
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
      }
    });
	}
}
module.exports = Game;
