db = require('../db.js');
var Question = require("./Question.js");
var User = require("./User.js");
var async = require('async');

//db.connectDatabase();
class Answers {
  //  allAnswers;
  //  correctAns;
  // // wording;
  static loadAnswers(users, questionNumber, game_id, callback) {
    var sql = "SELECT * FROM `answers` WHERE game_id ='" + game_id + "' AND questionNum='" + questionNumber + "' order by submitTime ASC";
    //echo sql;
    console.log(sql);
    var pointsAwarded = false;
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      } else {
        for (var i = 0; i < results.length; i++) {
          var lat1 = results[i].lat;
          var long1 = results[i].longg
          var ans = results[i].answer
          var user_id = results[i].user_id
          var qID = results[i].id
          var points = results[i].points
          var color = results[i].color
          var avg = results[i].avg
          var distanceAway = results[i].distanceAway
          //questionNum,loc,ans,roundPoints
          if (points > 0)
            pointsAwarded = true;
        //     console.log("herererererererer");
        //   console.log(users);
        //   console.log("herererererererer");
        // console.log(user_id);
          //  console.log(User.findKey(users, user_id));
          if (users[User.findKey(users, user_id)]!=null)
            users[User.findKey(users, user_id)].answer = new Answer(questionNumber, new LatLong(lat1, long1), ans, distanceAway, points,i);

        }
        return callback(false, pointsAwarded)

      }
    });
  }


  // this.awardPoints();

  //Question::alertUsers("-1");

  //echo "loc is ".this.correctAns.location.lat;

  //
  // //this will find the zoom level for the map when shown
  //   zoomLevel(){
  //     maxAway=0;
  //     foreach(this.allAnswers as key=>answer){
  //       if (answer.distanceAway>maxAway){
  //         //maxAway++;
  //         maxAway=answer.distanceAway;
  //       }
  //     }
  //     //return maxAway;
  //     if (maxAway<40)return 8;
  //     else if (maxAway<150)return 7;
  //     else if (maxAway<300)return 6;
  //     else if (maxAway<900)return 5;
  //     else if (maxAway<2500)return 4;
  //     else if (maxAway<6000)return 3;
  //     else return 2;
  // }
  //
  //
  //   awardPoints(){
  //   if (Game::findGame().round>0){
  //     if (!isset(_SESSION["single"]) || _SESSION["single"]!=true)
  //         this.fillMissingAnswers();
  //     usort(this.allAnswers, array("Answer", "sortMiles"));
  //     totalPoints=count(this.allAnswers);
  //     foreach (this.allAnswers as key=>answer){
  //       answer.updateAnswer(totalPoints--);
  //     }
  //     Game::updateRound(-1*_SESSION["questionNumber"]);
  //   }
  // }
  //
  //   findPlace(id){
  //   place=1;
  //   foreach (this.allAnswers as key=>answer)
  //   {
  //     //echo "id is ".answer.user_id ." and ". answer.distanceAway;
  //     if (answer.user_id==id)
  //        return place;
  //     else place++;
  //   }
  // }
  //
  // //in case a user does not submit on time
  //   fillMissingAnswers()
  // {
  //      global conn;
  //      allUsers=array();
  //      sql = "SELECT * from `users` WHERE `game_id`= '"._SESSION['game_id']."'";
  //      result = conn.query(sql);
  //      //row = result.fetch_assoc();
  //      //echo sql. " rea".result;
  //      //print_r(this.allAnswers);
  //      while(row = result.fetch_assoc()){
  //       // echo sql;
  //        name = results[0].name"];
  //        user_id = results[0].user_id"];
  //        color=results[0].color"];
  //        ans=-999;
  //        if (!array_key_exists(user_id,this.allAnswers))
  //        {
  //           Answer::addAnswer(user_id,_SESSION["questionNumber"],-99,-99,ans,-1,color,"no");
  //           this.allAnswers[]=Answer::addUser(_SESSION["questionNumber"],new LatLong(-99,-99),ans,user_id,0,0,color);
  //        }
  //      }
  //
  // }
  //
  //   getTP(){
  //   //usort(this.allAnswers, array("Answer", "sortMiles"));
  //   foreach (this.allAnswers as key=>answer){
  //     //echo "<br>".answer.name. " has " . User::getTP(answer.user_id) . " total Points";
  //     answer.totalPoints=User::getTP(answer.user_id) ;
  //     if (answer.totalPoints==0 || answer.name=="" )
  //        unset(this.allAnswers[key]);
  //   }
  //   usort(this.allAnswers, array("Answer", "sortTotalMiles"));
  //
  // }
  //
  //   getMin(){
  //   min=this.correctAns.value;
  //   foreach (this.allAnswers as key=>answer){
  //     if (min>answer.ans && answer.ans!=-999)
  //        min=answer.ans;
  //   }
  //   return min;
  // }
  //   getMax(){
  //   max=this.correctAns.value;
  //   foreach (this.allAnswers as key=>answer){
  //     if (max<answer.ans  && answer.ans!=-999)
  //        max=answer.ans;
  //   }
  //   return max;
  // }
  //
  //
  //   getLocations(){
  //   returnString="[";
  //   i=0;
  //   foreach(this.allAnswers as key=>answer){
  //     returnString.="['".addslashes(answer.name)."', ".answer.location.lat.", ".answer.location.longg.", '".answer.color."']";
  //     if (++i!= count(this.allAnswers))
  //     returnString.= ",";
  //   }
  //   returnString.="]";
  //   return returnString;
  // }
}

class Answer {
  // var location;
  // var ans;
  // var name;
  // var user_id;
  // var qID;
  // var questionNum;
  // var distanceAway;
  // var totalMiles;
  // var totalPoints;
  // var roundPoints;
  // var value;
  // var color;
  // var avg;

  constructor(questionNum, loc, ans, distanceAway, roundPoints,i) {
    this.questionNum = questionNum;
    this.loc = loc;
    this.ans = ans;
    this.distanceAway = distanceAway
    this.roundPoints = roundPoints;
    this.submitOrder=i;
  }

  static firstSubmit(game_id, user_id, questionNum, callback) {
    var sql = "SELECT COUNT(id) as total FROM `answers` WHERE game_id ='" + game_id + "' AND questionNum='" + questionNum + "' AND user_id='" + user_id + "'";
    db.getQuery(sql, function(err, results) {
      //console.log(results[0]);
      if (err || results[0].total > 5) { //tmp

        //console.log(err);
        return callback(true);
      } else
        return callback(false);
    });
  }

  static loadCorrectSimple(question,callback) {
    //table="questions";
    // if (isset(_SESSION["single"]) && _SESSION["single"]==true)
    //   table="questionsSingle";
      var answer = new Answer();
      answer.location = new LatLong(question.lat, question.longg);
      answer.questionNum = question.questionNumber;
      //answer.name = results[0].wording;
      answer.value = question.answer;
      // console.log("answer");
      //       console.log(answer);
      return callback(false, answer);

    //echo sql;

  }

  static loadCorrect(questionNum, game_id, callback) {
    //table="questions";
    // if (isset(_SESSION["single"]) && _SESSION["single"]==true)
    //   table="questionsSingle";
    var sql = "SELECT * FROM `questions` WHERE gameid ='" + game_id + "' AND questionNum='" + questionNum + "' ORDER by questionID DESC";
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      }
      console.log(results);
      var answer = new Answer();
      answer.location = new LatLong(results[0].lat, results[0].longg);
      answer.questionNum = questionNum;
      answer.name = results[0].wording;
      answer.value = results[0].answer;
      // console.log("answer");
      //       console.log(answer);
      return callback(false, answer);
    });
    //echo sql;

  }

  static addAnswer(game_id, user_id, questionNumber, lat, longg, answer, distanceAway, color, callback) {

    Question.findQID(game_id, questionNumber, function(qID) {
      if (qID == -1)
        return callback(false);
      else {
        var sql = "INSERT INTO `answers` (`game_id`,`user_id`,`questionNum`,`lat`,`longg`,`answer`,`distanceAway`,`color`,`question_id`) VALUES" +
          "('" + game_id + "', '" + user_id + "', '" + questionNumber +
          "','" + lat + "', '" + longg + "', '" + answer + "', '" + distanceAway +
          "', '" + color + "', '" + qID + "')";
        db.getQuery(sql, function(err, results) {
          if (err) {
            console.log(err);
            return callback(true);
          } else return callback(false, qID);
        });
      }
    });
  }
  static findPlace(distanceAway, question_id, callback) {
    //now find place
    var sql = "select question_id, count(*) total, sum(case when distanceAway >= '" + distanceAway + "' then 1 else 0 end) worse from `answers` WHERE question_id='" + question_id + "' AND distanceAway>=0";
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      } else {
        if (results[0].total > 5) {
          var place = Math.round(results[0].worse / results[0].total * 1000) / 10
          return callback(false, distanceAway, place);
        } else return callback(false, distanceAway, 0);
      }
    });
    //  sql = "UPDATE `answers` SET `avg`='place' WHERE `game_id`='_SESSION[game_id]' AND `user_id`='userID' AND `questionNum`='questionNumber'";

  }





  //
  //
  //  static  checkUserSubmitted(questionNum,user_id){
  //   global conn;
  //   sql = "SELECT * FROM `answers` WHERE game_id ='"._SESSION["game_id"]."' AND questionNum='".substr(questionNum,0)."' AND user_id='".user_id."'";
  //   result = conn.query(sql);
  //   //echo sql;
  //   if (result)
  //   if(row = result.fetch_assoc()){
  //     //echo "here";
  //     return true;
  //
  //   }
  //
  //
  //   return false;
  // }
  //Answer.addUser(new LatLong(lat1,long1),ans,distanceAway,user_id,pointsRound,points,color,avg);
  static addUser(loc, ans, distanceAway, userID, points, color, avg = null) {
    answer = new self();
    answer.user_id = userID;
    answer.avg = avg;
    answer.location = loc;
    answer.ans = ans;
    answer.qID = qID;
    answer.distanceAway;
    // if (ans==-999)//meaning they didnt submit
    //   answer.distanceAway=-999.99;
    // else if (!is_object(correct))//meaning end of game
    //   answer.distanceAway=-999.99;
    // else if (Game::findGame().type=="geo" || Game::findGame().type=="pt" || Game::findGame().type=="places")
    //   answer.distanceAway=LatLong::findDistance(correct.location,loc);
    // else
    //   answer.distanceAway=abs(ans-correct.value);
    // if (ans>100000)
    //    answer.distanceAway=round(answer.distanceAway,-5);
    // answer.getUserInfo();
    // answer.updateUser();
    answer.roundPoints = points;
    return answer;
  }
  //
  //   getUserInfo(){
  //   global conn;
  //   table="users";
  //   if (isset(_SESSION["single"]) && _SESSION["single"]==true)
  //      table="usersSingle";
  //   sql = "SELECT * FROM `table` WHERE user_id ='".this.user_id."'";
  //   //echo sql;
  //
  //   result = conn.query(sql);
  //   if (result)
  //   {
  //     row = result.fetch_assoc();
  //     this.name= results[0].name"];
  //     this.totalMiles= results[0].score"]+this.distanceAway;
  //     //this.totalPoints= results[0].totalPoints"];
  //   }
  // }
  //
  //   updateAnswer(points)
  // {
  //   global conn;
  //   if (this.ans==-999)points=0;//meaning they didnt submit
  //   sql = "UPDATE `answers` SET points='".points."' WHERE id='".this.qID."'";
  //   this.roundPoints=points;
  //   result = conn.query(sql);
  // }
  //
  //   updateUser()
  // {
  //   global conn;
  //   sql = "UPDATE `users` SET score='".this.totalMiles."' WHERE user_id='".this.user_id."'";
  //   result = conn.query(sql);
  // }
  //
  // static  sortMiles(a,b){
  //   return a.distanceAway-b.distanceAway;
  // }
  // static  sortTotalMiles(a,b){
  //   return b.totalPoints-a.totalPoints;
  // }
}

class LatLong {


  constructor(lat, longg) {
    this.lat = lat;
    this.longg = longg;
  }

  static findDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
      dist = dist * 1.609344
    }
    if (unit == "N") {
      dist = dist * 0.8684
    }
    dist = Math.round(dist);
    return dist
  }
}

module.exports = {
  Answers: Answers,
  Answer: Answer,
  LatLong: LatLong
}
