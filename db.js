var mysql = require('mysql');
var pool = mysql.createPool({
  //host: '54.174.113.122',
  host: 'localhost',
  user: 'root',
  password: 'MyHoot' ,
  port: '3306',
  database: 'MyHoot',
  connectionLimit: 10
  // host     : 'localhoast',
  // user     : 'root',
  // password : 'myhoot',
  // database : 'MyHoot'
});
// host: 'myhoot.c6pmgtbtrwoa.us-east-1.rds.amazonaws.com',
// user: 'root2017',
// password: 'myhoot2017',
// port: '3306',
// database: 'MyHoot'
class DB {
  static getNumAnswers(callback) {
    DB.getQuery("SELECT COUNT(id) as total FROM answers", function(err, results) {
      if (err) {
        //console.log("in dhere" + err);
        return "";
      }
      results = "" + (results[0].total);
      callback(false, results);
    });
  }

  static getQuery(query, callback) {
    //var sql = "SELECT name FROM users WHERE city=?";
    // get a connection from the pool
    //console.log(query);
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        callback(true);
        return;
      }
      // make the query
      connection.query(query, function(err, results) {
        connection.release();
        if (err) {
          console.log(err);
          callback(true);
          return;
        }
        //console.log(results);
        callback(false, results);
      });
    });
  };

}

module.exports = DB;



// app.post('/submitAnswer2', function(req, res) {
//   //req.query
//   console.log("Submitting an answer");
//   // req.session.game_id ? "" : req.session.game_id = "100001026";
//
//   var theGame;
//   //console.log(req.session);
//   async.waterfall( //you will need to check to see if question is still active and also get type
//     [
//       function checkStuff(callback) {
//         var required = 0;
//         var alreadyRet = false;
//         // console.log(req);
//         // console.log("here");
//         Game.findGame(req.session.game_id, function(err, g) {
//           //console.log("return"+g.type);
//           if (err) {
//             if (!alreadyRet) {
//               alreadyRet = true;
//               return callback(true, "no game");
//             }
//
//           } else if (g.round != req.body.questionNumber) {
//             if (!alreadyRet) {
//               alreadyRet = true;
//               return callback(true, "wrong q");
//             }
//           } else {
//             theGame = g;
//             required++;
//             console.log("req is 1" + alreadyRet);
//             if (required == 2 && !alreadyRet) {
//               alreadyRet = true;
//               return callback(false);
//             }
//           }
//         })
//         Answer.Answer.firstSubmit(req.session.game_id, req.session.user_id, req.body.questionNumber, function(err) {
//           if (err) {
//             if (!alreadyRet) {
//               alreadyRet = true;
//               return callback(true, "already");
//             }
//           } else {
//             required++;
//             console.log("req is2 " + alreadyRet);
//             if (required == 2 && !alreadyRet) {
//               alreadyRet = true;
//               return callback(false);
//             }
//           }
//         })
//       },
//
//       function findCorrect(callback) {
//         //console.log(req.body);
//         //console.log("fidning corroect");
//         Answer.Answer.loadCorrect(req.body.questionNumber, req.session.game_id, callback)
//       },
//       function findDistanceAway(correctAnswer, callback) {
//         // console.log("correct");
//         // console.log(correctAnswer);
//         if (req.body.lat != null)
//           var distanceAway = Answer.LatLong.findDistance(correctAnswer.location.lat, correctAnswer.location.longg, req.body.lat, req.body.long);
//
//         else
//           var distanceAway = Math.abs(req.body.answer - correctAnswer.value);
//         return callback(false, distanceAway);
//       },
//       function addAnswer(distanceAway, callback) {
//         var io = socket.getSocket();
//         //  console.log("adding answer");
//         Answer.Answer.addAnswer(req.session.game_id, req.session.user_id, req.body.questionNumber, req.body.lat, req.body.long, req.body.answer,
//           distanceAway, req.session.color,
//           function(err, qID) {
//             //console.log("done adding answer");
//             if (err) return callback(true);
//             else return callback(false, distanceAway, qID)
//           });
//         if (theGame.type == "pop")
//           distanceAway = Math.round(distanceAway / 1000) * 1000;
//         io.in("host" + req.session.game_id + "-" + req.body.questionNumber).emit('newA', decodeURI(req.session.name), Number(distanceAway).toLocaleString(), req.session.color);
//
//         //return callback(false, distanceAway,"geo66")
//       },
//       function findPlace(distanceAway, qID, callback) {
//         Answer.Answer.findPlace(distanceAway, qID, callback);
//         //return callback(false, distanceAway);
//       }
//     ],
//     function(err, distanceAway, place) {
//       if (err == false) {
//         //console.log(distanceAway);
//         res.render(dir + '/waitingScreen', {
//           socketIP: "http://" + socketIP,
//           game_id: req.session.game_id,
//           message: "Off by: " + Question.getUnitsAway(theGame.type, distanceAway),
//           place: place,
//           name: req.query.name
//         });
//       } else
//         res.render(dir + '/waitingScreen', {
//           socketIP: "http://" + socketIP,
//           game_id: req.session.game_id,
//           message: distanceAway,
//           place: "",
//           name: req.query.name
//         });
//
//     }
//     //console.log("it is "+JSON.stringify(question))
//     //console.log("Dist away" + distanceAway);
//     //console.log(distanceAway);
//     //res.render(dir+'/getQuestion', {session: req.session,socketIP:"http://"+socketIP,question:(question)})
//     // Node.js and JavaScript Rock!
//
//   );
//
// })
