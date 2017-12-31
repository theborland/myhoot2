var db = require('../db.js');
var Game = require("./Game.js");

class User {

  constructor(name, id) {
    this.name = name;
    this.id = id;

  }

  sortRound(allUsers){
    allUsers.sort(User.compareDistanceAway);
  }
  sortOverall(allUsers){
    allUsers.sort(User.compareTotalPoints);
  }

  static compareDistanceAway(a, b) {
    if (a.answer != null && b.answer != null) {
      if (a.answer.distanceAway < b.answer.distanceAway) {
        return -1;
      } else if (a.answer.distanceAway > b.answer.distanceAway) {
        return 1;
      } else return 0;
    } else if (a.answer != null && b.answer == null) return -1;
    else if (a.answer == null && b.answer != null) return 1;
    else return 0;
  }

  static compareTotalPoints(a, b) {
    if (a.totalPoints < b.totalPoints)
      return 1;
    if (a.totalPoints > b.totalPoints)
      return -1;
    return 0;
  }

  static zoomLevel(allUsers) {
    var maxAway = 0;
    for (var id in allUsers) {
      if (allUsers[id].answer != null) {
        if (allUsers[id].answer.distanceAway > maxAway) {
          //maxAway++;
          maxAway = allUsers[id].answer.distanceAway;
        }
      }
    }

    //return maxAway;
    if (maxAway < 40) return 8;
    else if (maxAway < 150) return 7;
    else if (maxAway < 300) return 6;
    else if (maxAway < 900) return 5;
    else if (maxAway < 2500) return 4;
    else if (maxAway < 6000) return 3;
    else return 2;
  }

  static awardPoints(allUsers) {

    allUsers.sort(User.compareDistanceAway);

    var pointsRound = allUsers.length;
    for (var i in allUsers) {
      if (allUsers[i].answer != null) {
        allUsers[i].answer.roundPoints = pointsRound;
        allUsers[i].totalPoints += pointsRound;
        pointsRound--;
      }
    }



    //no update db
    for (var i in allUsers) {
      if (allUsers[i].answer != null) {
        //console.log("updaint" + allUsers[i].name)
        db.getQuery("UPDATE `users` SET `totalPoints`= '" + allUsers[i].totalPoints + "' WHERE user_id='" +
          allUsers[i].id + "'",
          function(err, results) {
            if (err) {
              console.log(err);
            }
          });
        var sql = "UPDATE `answers` SET `points`= '" + allUsers[i].answer.roundPoints + "' WHERE user_id='" +
          +allUsers[i].id + "' AND questionNum='" + allUsers[i].answer.questionNum + "'";
        //console.log(sql);
        db.getQuery(sql,
          function(err, results) {
            if (err) {
              console.log(err);
            }
          });
      }
    }
  }

  static findKey(allUsers, user_id) {
    for (var i in allUsers) {
      if (allUsers[i].id == user_id)
        return i;
    }
    return -1;
  }


  static loadAllUsers(game_id, callback) {
    var allUsers = []

    // console.log(allUsers);
    db.getQuery("SELECT * from `users` WHERE `game_id`= '" + game_id + "'", function(err, results) {
      if (err) {
        console.log(err);
        return false;
      }
      for (var i = 0; i < results.length; i++) {
        // console.log(allUsers.length);
        allUsers[i] = new User(decodeURI(results[i].name), results[i].user_id);
        allUsers[i].color = results[i].color;
        allUsers[i].totalPoints = results[i].totalPoints;
        // console.log(allUsers[i].name)
        // console.log(allUsers.length);
      }

      return callback(false, allUsers);


    });
  }

  static createUser(game_id, name, session, callback) {
    session.name = name;
    // table="users";
    // if (isset(_SESSION["single"]) && _SESSION["single"]==true)
    // 	table="usersSingle";
    // else {
    var today = new Date();
    var date_to_reply = new Date('2017-11-01');
    var timeinmilisec = today.getTime() - date_to_reply.getTime();

    game_id = Game.findGameID(game_id);
    session.game_id = game_id;
    if (name == "")
      return false;
    db.getQuery("SELECT * from `users` WHERE `game_id`= '" + game_id + "' AND `name`='" + name + "' LIMIT 1", function(err, results) {
      if (err) {
        console.log(err);
        return false;
      }
      if (results.length > 0) {
        console.log("user exists");
        return callback(true);
      }
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var timestamp = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
      var colorOptions = "ea1717,3017ea,17ea1a,eab217,ea17e7,17eaca,228e53,8e226e,e56e00,7c1717,8d9e22,3dffa4,e06650,4ca37d,0f3022".split(",");
      var color = colorOptions[Math.floor(Math.random() * colorOptions.length)];;

      var query = "INSERT INTO `users` (`game_id`, `name`,`color`,`ip`) VALUES ('" + game_id + "','" + name + "','" + color + "','" + session.sessionID + "')";
      db.getQuery(query, function(err, results) {
        if (err) {
          console.log(err);
          return false;
        }
        session.user_id = results.insertId;
        session.name = name;
        session.color = color;
        return callback(false);
        //console.log(session.user_id);
      });
    });

    // 			if (result->num_rows>0 || name=="")
    // 			   return false;
    // 		// }
    // 	//echo "😀";date("Y-m-d H:i:s")
    //     color=Game::getColor();
    // 		sql = "UPDATE games SET numOfUsers = numOfUsers+1 WHERE game_id = '".game_id."'";
    // 		result = conn->query(sql);
    // 		if (isset(_SESSION["single"]) && _SESSION["single"]==true){
    // 			  sql = "INSERT INTO `table` (`game_id`, `name`,`color`,`ip`,`created`) VALUES ('".game_id."','".name."','".color."','".session_id() ."','".date("Y-m-d H:i:s")."')";
    // 		}
    // 		else {
    // 		    sql = "INSERT INTO `table` (`game_id`, `name`,`color`,`ip`) VALUES ('".game_id."','".name."','".color."','".session_id() ."')";
    // 		}
    //
    // //mb_internal_encoding("UTF-8");
    // //echo "😀"; INSERT INTO `MyHoot`.`users` (`user_id`, `game_id`, `name`, `round`, `score`, `color`) VALUES ('51', '51', '😀', NULL, NULL, '')
    //
    // 	//fdie (sql);
    // //	echo mb_internal_encoding();
    //
    // 		result = conn->query(sql);
    // 		_SESSION["user_id"] =  conn->insert_id;
    //
    // 	 //echo mysqli_info(conn);
    // 	//	die ("s".conn->error . " ". sql);
    // 		//SOCKET SENDING MESSAGE
    // 		if (!isset(_SESSION["single"]) || _SESSION["single"]!=true){
    // 			entryData = array(
    // 				'category' => game_id
    // 				, 'title'    => stripslashes(name)
    // 					, 'color'    => color
    // 			);
    // 			//print_r(entryData);
    // 			// context = new ZMQContext();
    // 			// socket = context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
    // 			// socket->connect("tcp://127.0.0.1:5555");
    // 			// socket->send(json_encode(entryData));
    // 			_SESSION['JS']="notifyNewUserInGame(".entryData['category'].",'".entryData['title']."','".entryData['color']."'); ";
    // 			return true;
    // 	  }
    //END SOCKET SENDING
  }

}
// class User{
// 	var name;
// 	var id;
// 	var totalPoints;
// 	var color;
// 	var place;
// 	var avg;
// 	var tempAvg;
// 	var tempGames;
// 	var gamesPlayed;
// 	var singleStatsRound;
// 	var singleStatsGame;
//
//
// 	function __construct(name,id){
// 		this->name=name;
// 		this->id=id;
// 	}
//
// 	public static function findGameID(){
// 		global conn;
// 			sql = "SELECT * from `users` WHERE `ip`= '".session_id()."' ORDER by id DESC";
// 			result = conn->query(sql);
// 			if (result)
// 			{
// 				row = result->fetch_assoc();
// 				if (row){
// 					_SESSION["game_id"]= row["game_id"];
// 					_SESSION["user_id"]= row["user_id"];
// 					_SESSION["name"]= row["name"];
// 				}
//
// 			}
// 			header("index.php");
// 			die ();
// 			return null;
//
// 		}
//
//
// 	public static function createUser(game_id,name){
// 		global conn;
// 		_SESSION["name"] =name;
// 		table="users";
// 		if (isset(_SESSION["single"]) && _SESSION["single"]==true)
// 			table="usersSingle";
// 		else {
// 			sql = "SELECT * from `users` WHERE `game_id`= '".game_id."' AND `name`='".name."'";
// 			result = conn->query(sql);
// 			//if (game_id=="45920285")
// 			//die(sql);
// 			if (result->num_rows>0 || name=="")
// 			   return false;
// 		}
// 	//echo "😀";date("Y-m-d H:i:s")
//     color=Game::getColor();
// 		sql = "UPDATE games SET numOfUsers = numOfUsers+1 WHERE game_id = '".game_id."'";
// 		result = conn->query(sql);
// 		if (isset(_SESSION["single"]) && _SESSION["single"]==true){
// 			  sql = "INSERT INTO `table` (`game_id`, `name`,`color`,`ip`,`created`) VALUES ('".game_id."','".name."','".color."','".session_id() ."','".date("Y-m-d H:i:s")."')";
// 		}
// 		else {
// 		    sql = "INSERT INTO `table` (`game_id`, `name`,`color`,`ip`) VALUES ('".game_id."','".name."','".color."','".session_id() ."')";
// 		}
//
// //mb_internal_encoding("UTF-8");
// //echo "😀"; INSERT INTO `MyHoot`.`users` (`user_id`, `game_id`, `name`, `round`, `score`, `color`) VALUES ('51', '51', '😀', NULL, NULL, '')
//
// 	//fdie (sql);
// //	echo mb_internal_encoding();
//
// 		result = conn->query(sql);
// 		_SESSION["user_id"] =  conn->insert_id;
//
// 	 //echo mysqli_info(conn);
// 	//	die ("s".conn->error . " ". sql);
// 		//SOCKET SENDING MESSAGE
// 		if (!isset(_SESSION["single"]) || _SESSION["single"]!=true){
// 			entryData = array(
// 				'category' => game_id
// 				, 'title'    => stripslashes(name)
// 					, 'color'    => color
// 			);
// 			//print_r(entryData);
// 			// context = new ZMQContext();
// 			// socket = context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
// 			// socket->connect("tcp://127.0.0.1:5555");
// 			// socket->send(json_encode(entryData));
// 			_SESSION['JS']="notifyNewUserInGame(".entryData['category'].",'".entryData['title']."','".entryData['color']."'); ";
// 			return true;
// 	  }
// 		//END SOCKET SENDING
// 	}
//
// 	public function getTotalPoints(){
// 		global conn;
// 		sql = "	SELECT sum(`points`) FROM `answers` WHERE `user_id`=".this->id."'";
// 		//echo sql;
// 		result = conn->query(sql);
// 		if (result)
// 		{
// 			row = result->fetch_assoc();
// 			this->totalPoints = row['sum(points)'];
// 		}
// 	}
//
// 	public static function updateUser(userID,questionNumber,distanceAway){
// 		  global conn;
//
// 			sql = "SELECT * from `usersSingle` WHERE `user_id`= '".userID."'";
// 			result = conn->query(sql);
// 			if (result)
// 			{
// 				row = result->fetch_assoc();
// 				lastRound=row["round"];
// 				gamesPlayed=row["gamesPlayed"];
// 				avg=row["avg"];
// 				User::seeIfPlayed(userID,questionNumber);
// 				last5Avg=User::findLast5(userID,questionNumber);
// 				//echo "avg is ".last5Avg;
// 				//die();
// 				tempAvg=last5Avg;
// 				gamesPlayed++;
// 				gamesRow=0;
// 				if (!is_numeric(last5Avg)){
// 	            splits=explode("~",last5Avg);
// 	            tempAvg=-splits[2];
// 							gamesRow=splits[1];
// 				}
// 				sql = "UPDATE `usersSingle` SET `tempAvg` = '".tempAvg."',`tempGames`='".gamesRow."',`score`='".distanceAway."', `gamesPlayed` = '".gamesPlayed."', `round` = '".questionNumber."' WHERE user_id = '".userID."'";
// 				result = conn->query(sql);
// 				//die (sql);
// 				if (substr(last5Avg,0,1)!="~" && last5Avg>avg){
// 					gamesPlayed++;
// 					//newAvg=round((avg*(gamesPlayed-1)+place)/gamesPlayed,2);
// 					sql = "UPDATE `usersSingle` SET `avg` = '".last5Avg."' WHERE user_id = '".userID."'";
// 					result = conn->query(sql);
// 					//die (sql);
//
// 				}
// 				return last5Avg;
// 			}
//
// 		}
//
// 		public static function addSkip(userID){
// 			  global conn;
// 				sql = "SELECT * FROM `answers` WHERE game_id ='"._SESSION["game_id"]."' AND user_id='".userID."' ORDER by questionNum DESC";
// 				result = conn->query(sql);
// 				//echo sql;
// 				if (result && row = result->fetch_assoc())
// 				{
// 						if (row["avg"]!=0)
// 				    {
// 								sql = "UPDATE `answers` SET avg=0 WHERE game_id ='"._SESSION["game_id"]."' AND user_id='".userID."' AND questionNum=".row["questionNum"];
// 								result = conn->query(sql);
// 						}
// 				}
//
// 		}
// /*
// 		public static function findTop5Users(){
// 				global conn;
// 				sql = "SELECT * from `usersSingle` ORDER by avg DESC limit 5";
// 				result = conn->query(sql);
// 				top5=array();
// 				place=1;
// 				while (row = result->fetch_assoc())
// 				{
// 					user=new self(row["name"],place);
// 					user->avg=row["avg"];
// 					top5[place]=user;
// 					place++;
// 				}
//
// 				return top5;
// 		}
// */
//
// 		public static function addToPlacesArray		(userID,place){
// 			global conn;
// 			sql = "SELECT * from `usersSingle` WHERE `user_id`= '".userID."'";
// 			result = conn->query(sql);
// 			if (result)
// 			{
// 				row = result->fetch_assoc();
// 				places=unserialize(row["placeArray"]);
// 				places[]=round(place,2);
// 				placesSerialed=mysql_escape_string(serialize(places));
// 				sql = "UPDATE `usersSingle` SET `placeArray`='".placesSerialed."' WHERE `user_id`= '".userID."'";
// 				result = conn->query(sql);
// 			}
// 		}
//
// 		public static function seeIfPlayed(userID,questionNumber){
// 				 global conn;
// 				 sql = "SELECT * FROM `answers` WHERE game_id ='"._SESSION["game_id"]."' AND questionNum='".questionNumber."' AND user_id='".userID."'";
// 				 result = conn->query(sql);
// 				 //echo sql;
// 					 if (result && row = result->fetch_assoc())
// 							if (row["avg"]!=0){
// 									return;
// 								}
//
// 					 User::addToPlacesArray(userID,0);
//
// 		}
//
//
//
// 		public static function findLast5(userID,questionNumber){
// 				 last5Avg=0;
// 				 global conn;
// 				 for (i=questionNumber;i>questionNumber-5;i--)
// 				 {
// 					 sql = "SELECT * FROM `answers` WHERE game_id ='"._SESSION["game_id"]."' AND questionNum='".i."' AND user_id='".userID."'";
// 					 result = conn->query(sql);
// 					 //echo sql;
// 					 if (result && row = result->fetch_assoc())
// 					    if (row["avg"]!=0){
// 								  //echo "sss";
// 					  			last5Avg+=row["avg"];
// 								}
// 					 		else {
// 								 //echo "in";
// 								 numPlayed=questionNumber-i;
// 								 return "~".numPlayed."~".(last5Avg/numPlayed);
// 							}
// 					 else
// 					 {
// 							echo "in";
// 							numPlayed=questionNumber-i;
// 							if (numPlayed==0)return "~0~0";
// 							else return "~".numPlayed."~".(last5Avg/numPlayed);
// 					 }
// 				 }
// 				 return last5Avg/5;
//
//
//
// 		}
//
// 	public static function getTP(id){
// 		global conn;
// 		sql = "	SELECT sum(`points`) FROM `answers` WHERE `user_id`='".id."'";
// 		//echo sql;
// 		result = conn->query(sql);
// 		if (result)
// 		{
// 			row = result->fetch_assoc();
// 			//zecho id .';'.row['sum(`points`)']."<br>";
// 			if (row['sum(`points`)']>0)
// 			return row['sum(`points`)'];
// 			else return 0;
//
// 		}
// 	}
//
//   public static function getColor(){
// 		global conn;
// 		sql = "SELECT * from `users` WHERE `game_id`= '"._SESSION['game_id']."' AND `name`='"._SESSION['name']."'";
// 		result = conn->query(sql);
//     row = result->fetch_assoc();
//     return row['color'];
//
// 	  }
//
// 		public static function loadUserSingle(){
// 			global conn;
// 			sql = "SELECT * from `usersSingle` WHERE `user_id`= '"._SESSION['user_id']."'";
// 			result = conn->query(sql);
// 			if (result){
// 		    row = result->fetch_assoc();
// 				user=new self(row["name"],_SESSION['user_id']);
// 				user->place=row["score"];
// 				user->avg=round(row["avg"],2);
// 				user->tempAvg=round(row["tempAvg"],2);
// 				user->tempGames=row["tempGames"];
// 				//print_r(sql);
// 				//die();
// 				if (row["tempAvg"]<0)
// 					user->gamesPlayed=-1*row["tempAvg"];
// 				user->singleStatsRound=new SingleStats(user->place,"distanceAway",0);
// 				user->singleStatsGame=new SingleStats(user->avg,'avg',user->tempAvg);
// 				return user;
// 			}
// 			else return new self(_SESSION["name"],_SESSION['user_id']);;
// 		}
//
// 		public static function getUserNameSingle(id){
// 			global conn;
// 			sql = "SELECT * from `usersSingle` WHERE `user_id`= '".id."'";
// 			result = conn->query(sql);
// 			//die (sql);
// 			if (result){
// 				row = result->fetch_assoc();
// 				return row["name"];
// 			}
// 			else return "";
// 		}
//
// }
//
// function random_color_part() {
//     return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
// }
//
// function get_random_color() {
//     return random_color_part() . random_color_part() . random_color_part();
// }
//
// class SingleStats{
// 	var topFive;
// 	var place;
// 	var numOfPlayers;
// 	var tempPlace;
//
// 	function __construct(score,type,tempAvg){
// 		global conn;
// 		weekAgo= date('Y-m-d H:i:s', strtotime('-1 month'));
//
// 		if (type=="avg"){
// 		 sql = "SELECT * from `usersSingle`  WHERE `avg`!=0 AND `created`>'".weekAgo."' ORDER BY `avg` DESC LIMIT 5";
// 		 sql2= "select count(*) total, sum(case when `avg` > '".(score+.001)."' then 1 else 0 end) worse from `usersSingle` WHERE `avg`!=0 AND `created`>'".weekAgo."'";
//
// 	 }
// 	 else if (type=="distanceAway"){
// 		sql = "SELECT * from `answers`  WHERE questionNum='".abs(_SESSION["questionNumber"])."' AND `game_id`='1111' ORDER BY `distanceAway` ASC LIMIT 5";
// 		sql2= "select count(*) total, sum(case when `distanceAway` > 'score' then 1 else 0 end) worse from `answers` WHERE questionNum='".abs(_SESSION["questionNumber"])."' AND `game_id`='1111' ";
//
// 	}
// 		else {
// 				sql = "SELECT * from `usersSingle` WHERE round='".abs(_SESSION["questionNumber"])."' ORDER BY `score` ASC LIMIT 5";
// 				sql2= "select count(*) total, sum(case when type < 'score' then 1 else 0 end) worse from `usersSingle` WHERE round='".abs(_SESSION["questionNumber"])."'";
// 			}
// 			//echo sql;
// 		 result = conn->query(sql);
// 		 this->topFive=array();
// 		 //echo sql;
// 		 if (result){
// 			 i=1;
// 			 while (row = result->fetch_assoc()){
// 				 //die (sql);
// 				 if (type=="distanceAway"){
// 				 		row["name"]=User::getUserNameSingle(row["user_id"]);
// 						//die (User::getUserNameSingle(row["user_id"]));
// 					}
//
// 				 this->topFive[i]=new User(row["name"],i);
//
// 				 this->topFive[i]->avg=row[type];
// 				 i++;
// 				 //if (type=="avg")echo sql;
// 			 }
// 		 }
// 		 //die(sql);
//
// 		 result = conn->query(sql2);
// 		// die(sql2);
// 		 //echo sql2;
// 		 if (result)
// 		 {
// 				 row = result->fetch_assoc();
// 				 this->numOfPlayers=row ['total'];
// 				 if (type=="distanceAway")
// 				 		this->place=row ['total']-row['worse'];
// 				 else
// 				 		this->place=row['worse']+1;
//
//
// 		 }
//
// 		 if (tempAvg>0 && score!=tempAvg && type!="distanceAway")
// 		 {
// 			 sql2= "select count(*) total, sum(case when type > '".(tempAvg+.01)."' then 1 else 0 end) worse from `usersSingle` WHERE `avg`!=0 AND `created`>'".weekAgo."'";
// 			 // echo sql2;
// 				result = conn->query(sql2);
// 				row = result->fetch_assoc();
// 				//die (sql2);
// 			 this->tempPlace=row['worse']+1;
// 		 }
// 		 //now lets see if tempAvg is not a streak of 5 but just OutOfBoundsException
// 		 if (!is_numeric(tempAvg) && score!=tempAvg  && type!="distanceAway")
// 		 {
//
// 			 sql2= "select count(*) total, sum(case when type > 'tempAvg' then 1 else 0 end) worse from `usersSingle` ";
// 			  //echo sql2;
// 				result = conn->query(sql2);
// 				row = result->fetch_assoc();
// 				//die (sql2);
// 			 this->tempPlace=row['worse']+1;
// 		 }
// 	}
//
// }
module.exports = User;
