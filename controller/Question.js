var db = require('../db.js');

//db.connectDatabase();
class Question {

  constructor(type, session, callback) {
    this.city = "";
    this.country = "";
    this.lat = "";;
    this.longg = "";;
    this.answer = "";;
    this.image = "";;
    this.qID = "";; //this keeps track of the id of question from rand or geo or whatever
    this.min = "";;
    this.max = "";
    if (session != null)
      this.game_id = session.game_id;
    this.alertString = "";;
    this.timesRepeated = 0;
    var s = 0;
    this.session = session;
    // console.log("in cons");
    // console.log(type)
    if (type != null) {
      session.questionNumber++;
      this.questionNumber = session.questionNumber;

      this.type = type;
      if (type == "geo")
        this.getLocation(type, callback);
      else if (type == "weather")
        this.getWeather(callback);
      //else if (type=="age")
      //		this.getAge();
      else if (type == "entertainment")
        this.getEntertainment(callback);
      else if (type == "pt")
        this.getPPT("pt", callback);
      else if (type == "places")
        this.getPPT("places", callback);
      else if (type == "sports")
        this.getQuestion(type, callback);
      else if (type == "science")
        this.getQuestion(type, callback);
      else if (type == "time")
        this.getTime(callback);
      else if (type == "estimation")
        this.getEstimation(callback);
      else if (type == "mih")
        this.getMIH(callback);
      else if (type == "facts")
        this.getFacts(callback);
      // else
      // 		this.getQuestion(type);
      //if (type=="user")
      //		this.getUserQuestion();

      ////////this.addAnswer();
      //echo "in here again";
      ////////Game::updateRound(_SESSION["questionNumber"],this.type);

    }


  }

  getLocation(type, callback) {
    // console.log("in get location" +this.session);
    // console.log(this.session);
    // global conn;
    var regionsSelected = this.session.regionsSelected;
    var sql = "SELECT * FROM `data-geo` WHERE ( ";
    for (var i = 0; i < regionsSelected.length; i++)
      sql += " `location` = '" + regionsSelected[i] + "' OR";
    sql = sql.substring(0, sql.length - 3);
    sql += "  )";
    if (type == "pop" || type == "population")
      sql += " AND `population`>0";

    if (Math.random() < .7)
      sql += " AND `population`>1000000";

    sql += " ORDER BY rand() LIMIT 1";
    //sql = "SELECT * FROM `data-geo` WHERE id='218'";
    //console.log(sql);
    // if (type=="pop" || type=="population" || this.type=="pop")
    // 	sql.=" AND `population`>0";
    //
    // //die (sql);
    // //" WHERE `id`='3'";
    // //	sql = "SELECT * FROM `data-geo`   WHERE `country`='Antigua and Barbuda'";
    //var sql = "SELECT * FROM `data-geo` WHERE `id`=281";
    // result = conn.query(sql);

    var alias = this;
    console.log(this.type);
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("found game");
      //console.log(that.alias);
      //console.log(results[0].country);

      alias.country = results[0].country;
      alias.city = results[0].city;
      alias.lat = results[0].lat;
      alias.longg = results[0].longg;
      alias.answer = results[0].population;
      var url = results[0].image;
      alias.qID = results[0].id;
      console.log(alias.city);
      alias.image = Question.getRandomUrl(url);
      //console.log(alias);
      //console.log("question num"+this.qID)
      return callback(null, alias);
    });
  }

  getEntertainment(callback) {
    //either get a cel age (75% of time )
    if (Math.random() > .65)
      return this.getQuestion('entertainment', callback);
    else {
      this.type = "age";
      this.getAge(callback);

    }
  }


  getQuestion(type, callback) {
    var sql = "SELECT * FROM `data-" + type + "` ORDER BY rand() LIMIT 1"; //" WHERE `id`='3'";
    var alias = this;
    // console.log(sql);
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      } else {
        alias.country = results[0].wording;
        alias.answer = results[0].answer;
        alias.lat = results[0].min;
        alias.longg = results[0].max;
        alias.min = results[0].min;
        alias.max = results[0].max;
        var url = results[0].image;
        alias.qID = results[0].id;
        alias.image = Question.getRandomUrl(url);
        //console.log(alias);
        //console.log("question num"+this.qID)
        return callback(null, alias);
      }

    })
  }

  getAge(callback) {

    var sql = "SELECT * FROM `data-age`  ORDER BY rand() LIMIT 1"; //" WHERE `id`='3'";
    var alias = this;
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      }
      alias.country = results[0].name;
      alias.city = "";

      alias.lat = 0;
      alias.longg = 100;
      var bday = results[0].birthday;
      // var from = bday.split("-");
      // console.log("HERERERERERERERERERERERER");
      // //console.log(from);
      // var f = new Date(from[0], from[1] - 1, from[2]);
      // console.log(from);
      var ageDifMs = Date.now() - bday.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      alias.answer = Math.abs(ageDate.getUTCFullYear() - 1970);

      var url = results[0].image;
      alias.qID = results[0].id;
      alias.image = Question.getRandomUrl(url);
      //console.log(alias);
      //console.log("question num"+this.qID)
      return callback(null, alias);
    });
  }

  getWeather(callback) {
    this.getLocation("weather", function(err, loc) {
      var url = 'http://api.wunderground.com/api/766deb6baf5fc335/almanac/conditions/forecast/q/' + loc.lat + ',' + loc.longg + '.json';
      var request = require('request');
      request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body) // Print the google web page.
          loc.answer = (jsonData["almanac"]["temp_high"]["normal"]["F"])
          if (loc.answer > 0)
            return callback(false, loc);
          else
            return loc.getWeather(callback);

        } else return callback(true);
      })

    });
  }
  // 		//latLong=LatLong::findLatLong(this.city,this.country);
  // 		url='http://api.wunderground.com/api/766deb6baf5fc335/almanac/conditions/forecast/q/'.this.lat.','.this.longg.'.json';
  // 		jsonData =file_get_contents( url);
  // 		phpArray = json_decode(jsonData,true);
  // 		//echo url;
  // 		this.answer=phpArray["almanac"]["temp_high"]["normal"]["F;
  // 		if (this.answer=="" || this.answer<=0)
  // 		{
  // 			this.type="geo";
  // 			this.getLocation(this.type);
  // 		}
  //
  //   }

  getPPT(type, callback) {
    var rand = Math.random();
    var regionsSelected = this.session.regionsSelected;
    var table;
    if (rand < .7)
      table = "people";
    else table = "products";

    if (type == "places") table = "places";

    var sql = "SELECT * FROM `data-geo-" + table + "` WHERE ( ";
    for (var i = 0; i < regionsSelected.length; i++)
      sql += " `region` = '" + regionsSelected[i] + "' OR";
    sql = sql.substring(0, sql.length - 3);
    sql += "  )";
    sql += " ORDER BY rand() LIMIT 1";

    var alias = this;
    console.log(this.type);
    db.getQuery(sql, function(err, results) {
      if (err || results.length == 0) {
        console.log(err);
        return alias.getPPT("people", callback);
      }
      if (table == "places") {
        alias.country = results[0].place;
        alias.city = "place";
      }
      if (table == "people") {
        alias.country = results[0].name;
        alias.city = results[0].type;
      }
      if (table == "products") {
        alias.country = results[0].product;
        alias.city = results[0].basedOrStarted;
      }
      alias.lat = results[0].lat;
      alias.longg = results[0].longg;
      alias.answer = results[0].population;
      var url = results[0].image;
      alias.qID = results[0].id;
      console.log(alias.city);
      alias.image = Question.getRandomUrl(url);
      //console.log(alias);
      //console.log("question num"+this.qID)
      return callback(null, alias);
    });
  }
  // https: //upload.wikimedia.org/wikipedia/commons/9/9f/Europe_in_814%2C_Charlemagne%2C_Krum%2C_Nicephorus_I.png
  //   https: //upload.wikimedia.org/wikipedia/commons/9/9f/Europe_in_814, _Charlemagne, _Krum, _Nicep
  //   horus_I.png
  getTime(callback) {
    var regionsSelected = this.session.regionsSelected;
    var sql = "SELECT * FROM `data-time` WHERE `imageUpdatedDate` IS NOT null AND (";
    for (var i = 0; i < regionsSelected.length; i++)
      sql += " `region` = '" + regionsSelected[i] + "' OR";
    sql = sql.substring(0, sql.length - 3);
    sql += "  )";
    sql += " ORDER BY rand() LIMIT 1";
    var alias = this;
    // console.log(sql);
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return;
      } else {
        alias.country = results[0].wording;
        alias.answer = results[0].answer;
        var url = results[0].image;
        alias.qID = results[0].id;
        alias.image = Question.getRandomUrl(url);
        //console.log(alias);
        //console.log("question num"+this.qID)
        return callback(null, alias);
      }

    })
  }

  getFacts(callback) {
    console.log("facts");
    if (Math.random() < .8) { //tmp .7
      this.type = "pop";
      return this.getLocation("pop", callback);
    } else {
      var regionsSelected = this.session.regionsSelected;
      var sql = "SELECT * FROM `data-facts` WHERE `imageUpdatedDate` IS NOT null AND (";
      for (var i = 0; i < regionsSelected.length; i++)
        sql += " `region` = '" + regionsSelected[i] + "' OR";
      sql = sql.substring(0, sql.length - 3);
      sql += "  )";
      sql += " ORDER BY rand() LIMIT 1";
      var alias = this;
      db.getQuery(sql, function(err, results) {
        if (err) {
          console.log(err);
          return;
        } else {
          alias.country = results[0].wording + " " + results[0].country + " (" + results[0].year + ")";
          alias.answer = results[0].answer;
          alias.lat = 0;
          alias.longg = results[0].max;
          if (results[0].max == -100) alias.longg = 100;
          var url = results[0].image;
          alias.qID = results[0].id;
          console.log(alias);
          alias.image = Question.getRandomUrl(url);
          //console.log(alias);
          //console.log("question num"+this.qID)
          return callback(null, alias);
        }

      })
    }
  }

  // 	function read(file, vars) {
  // 	 ob_start();
  // 	 extract(vars, EXTR_SKIP);
  // 	 include(file);
  // 	 content = ob_get_contents();
  // 	 ob_end_clean();
  // 	//  loc=strrpos(content,"link");
  // 	//  img=substr(content,loc);
  //
  // 	 return content;
  //  }
  getSimulationFile(file, vars, callback) {
    var fs = require('fs');
    console.log("trying to read");
    console.log(vars);
    var alias = this;
    //console.log("werreh er");
    //console.log(this);
    fs.readFile("controller/estimation/" + file + ".js", 'utf8', function(err, contents) {
      if (err) {
        console.log("error with file in simulation" + err);
        return;
      }
      alias.image = (contents);
      for (var key in vars) {
        var needle = "~" + key
        var re = new RegExp(needle, "g");
        //console.log(re);
        alias.image = alias.image.replace(re, vars[key]);

      }
      if (callback != null) return callback(null, alias);
    });
  }

  getURL(file, vars, callback) {
    var stuff = '';
    for (var key in vars) {
      stuff += key + "=" + vars[key] + "&";
    }
    var http = require('http');
    var url = 'http://34.207.151.231:8080/controller/estimation/' + file + '?' + stuff;
    var alias = this;
    http.get(url, (resp) => {
      return callback(null, alias);
    });
    console.log(url);

  }

  getEstimation(callback) {
    // 		  //either get a cel age (75% of time )

    var random = rand(1, 6);
    console.log("get ready" + random)
    if (random == 1) {
      this.country = "colHt";
      this.answer = rand(30, 1000);
      this.min = 0;
      this.max = 1000;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var height1 = rand(30, 1000);
      var height2 = rand(30, 1000);
      while ((height1 < height2 * 2 && height2 < height1 * 2) || height1 < height2 / 8 || height2 < height1 / 8) {
        height1 = rand(1, 1000);
        height2 = rand(1, 1000);
      }


      this.city = Math.round(height1 * (this.answer) / height2);
      console.log(this.city)
      this.qID = "colHt" + this.answer;
      var vars = {
        target: this.answer,
        scaled: this.city,
        showAnswerTarget: '',
        showAnswerValue: '100%'
      };
      return this.getSimulationFile('columnHeight', vars, callback);
    } else if (random == 2) {
      this.country = "piePerc";
      this.city = "piePerc";
      this.answer = rand(1, 99);
      this.min = 0;
      this.max = 100;
      this.lat = this.min;
      this.longg = this.max;
      while (this.answer == 50 || this.answer == 25 || this.answer == 75) {
        this.answer = rand(1, 99);
      }
      this.qID = this.answer;
      //vars = array('startin''perc' => this.answer, 'showAnswer' => 'no');
      //this.image = this.read('piePercent', vars);
      var vars = {
        startingAngle: rand(10, 350),
        percRem: (100 - this.answer),
        perc: this.answer,

        showAnswer: 'none'
      };
      return this.getSimulationFile('piePercent', vars, callback);
    } else if (random == 3) {
      this.country = "howMany";
      this.city = "howMany";
      this.answer = rand(30, 300);
      this.min = 0;
      this.max = 300;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var vars = {
        count: this.answer
      };
      return this.getSimulationFile('howMany', vars, callback);

    } else if (random == 4) {

      var target = rand(30, 1000);

      this.country = "mapDist";
      this.city = "m" + rand(1, 10000);
      this.answer = target;
      this.min = 0;
      this.max = 1000;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var vars = {
        target: this.answer,
        rand: this.city
      };

      this.image = '<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;  margin-right: auto;"><img src="http://34.207.151.231:8080/controller/estimation/tmp/' + this.city + '.png"></div>';
      this.getURL('mapDistance2.php', vars, callback);
    } else if (random == 5) {


      target = rand(1, 99);
      this.country = "percSq";
      this.city = "s" + rand(1, 10000);
      this.answer = target;
      this.min = 0;
      this.max = 100;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var vars = {
        targetPercent: this.answer,
        rand: this.city
      };

      this.image = '<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;  margin-right: auto;"><img src="http://34.207.151.231:8080/controller/estimation/tmp/' + this.city + '.png"></div>';
      this.getURL('percentSquare2.php', vars, callback);

    } else if (random == 6) {


      target = rand(30, 1000);
      this.country = "ellipse";
      this.city = rand(2001, 3000);
      this.answer = target;
      this.min = 0;
      this.max = 1000;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var vars = {
        target: this.answer,
        rand: this.city
      };

      this.image = '<div id="chart_div" style="width: 1000px; height: 600px;    margin-left: auto;  margin-right: auto;"><img src="http://34.207.151.231:8080/controller/estimation/tmp/' + this.city + '.png"></div>';
      this.getURL('circleSize2.php', vars, callback);

    }

  }


  getMIH(callback) {
    // 		  //either get a cel age (75% of time )
    var css = "width: 1000px; overflow-wrap: break-word;   font-size: 200;    text-align: center;    position: absolute;    padding: 20px;    left: 50%;    top: 50%;    transform: translateX(-50%) translateY(-50%);    var random = rand(1, 4);";
    var random = rand(5, 5);
    console.log("get ready" + random)

    if (random == 1) {

      var num1 = rand(22, 99);
      while (num1 % 10 == 0)
        num1 = rand(22, 99);
      var num2 = rand(4, 15);
      this.country = "SolveX";
      // this.city = rand(2001, 3000);
      this.answer = num1 * num2;
      this.min = 0;

      this.max = 2000;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var text = num1 + " x " + num2;
      this.city = text;
      this.image = '<div id="brain_div" style="font-size: 200; ' + css + '">' + text + '</div>';
      callback(null, this);

    } else if (random == 2) {

      var num1 = rand(1000, 9999);
      var num2 = rand(1000, 9999);
      this.country = "SolveP";
      // this.city = rand(2001, 3000);
      this.answer = num1 + num2;
      this.min = 0;

      this.max = 20000;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var text = num1 + "<br>+ " + num2;
      this.answer = num1 + num2;
      if (rand(1, 2) == 1) {
        while (num1 < num2) {
          num1 = rand(1000, 9999);
          num2 = rand(1000, 9999);
        }
        var text = num1 + "<br>- " + num2;
        this.answer = num1 - num2;
      }
      this.city = text;
      this.image = '<div id="brain_div" style="font-size: 200; ' + css + '">' + text + '</div>';
      callback(null, this);

    } else if (random == 3) {

      var num1 = rand(22, 99);
      var num2 = rand(55, 99);
      var num3 = rand(4, 99);
      var num4 = rand(55, 99);
      var num5 = rand(22, 99);
      var num6 = rand(5, 99);
      this.country = "SolveP";
      // this.city = rand(2001, 3000);
      this.answer = num1 + num2 + num3 + num4;
      this.min = 0;

      this.max = 500;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      //var show=rand(4,6);
      var text = num1 + " + " + num2 + " + " + num3 + " + " + num4;
      this.city = text;
      this.image = '<div id="brain_div" style="font-size: 120; ' + css + '">' + text + '</div>';
      callback(null, this);

    } else if (random == 4) {

      var num1 = rand(200, 1000);
      var num2 = rand(15, 59);
      this.country = "SolveD";
      // this.city = rand(2001, 3000);
      this.answer = Math.round(num1 / num2);
      this.min = 0;

      this.max = 100;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;
      var text = num1 + " / " + num2;
      this.city = text;
      this.image = '<div id="brain_div" style="font-size: 200; ' + css + '">' + text + '</div>';
      callback(null, this);

    } else if (random == 5) {
      var text = "";
      var answer = 0;
      for (var i = 0; i < rand(4, 8); i++) {
        var num1 = rand(2, 9);
        answer += num1;
        text += num1 + "+";
      }
      this.answer = answer;
      text = text.substring(0, text.length - 1);
      this.country = "Solve";
      // this.city = rand(2001, 3000);

      this.min = 0;

      this.max = 100;
      this.lat = this.min;
      this.longg = this.max;
      this.qID = this.answer;

      this.city = text;
      this.image = '<div id="brain_div" style="font-size: 200; ' + css + '">' + text + '</div>';
      callback(null, this);

    }


  }


  // 			else if (random==7){
  // 				target=rand(3,50);
  // 				this.country="tri";
  // 				this.city=rand(3001,4000);
  // 				this.answer=target;
  // 				this.min=0;
  // 				this.max=50;
  // 				this.qID="rect".this.answer;
  // 				vars = array( 'target'=>this.answer, 'randomFileName' => this.city,'showAnswer'=>'no');
  // 				img=this.read('estimation/rectangle.php',vars);
  // 				this.image='<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 		    margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 			}
  //
  // 	}


  getLabel() {
    if (this.country == "percSq")
      return "What percent is red";
    if (this.country == "ellipse")
      return "Find the circumference of the ellipse";
    if (this.country == "colHt")
      return "What is the height of the red bar";
    if (this.country == "piePerc")
      return "What is the percent of the red region";
    if (this.country == "howMany")
      return "How many dots are there";
    if (this.country == "mapDist")
      return "Using the scale shown, how long is the line";
    if (this.country == "SolveD")
      return "Round to nearest integer";
    if (this.country.substring(0, 5) == "Solve")
      return "Solve";

    else if (this.type == "geo" || this.type == "weather")
      return this.city + ", " + this.country;
    //	else if (this.country=="places," )
    //			return substr(this.country,0);
    //if (this.type=="pop" )
    else
      return this.country;

  }

  getQuestionUnits() {
    if (this.type == "geo")
      return "Where is ";
    if (this.type == "geo")
      return "Where is ";
    if (this.type == "pop")
      return "";
    if (this.type == "weather")
      return "°F";
    if (this.type == "age")
      return "";
    if (this.type == "time")
      return "";

  }

  getQuestionTextEnd() {
    if (this.type == "pt") {
      if (this.city == "based" || this.city == "started" || this.city == "born")
        return this.city;
      if (this.city == "lived" || this.city == "live")
        return "live";
      if (this.city == "bus")
        return " ride her famous bus";
      if (this.city == "worked" || this.city == "works")
        return "work";
    }
    return "";
  }

  getQuestionText() {
    if (this.type == "geo" || this.type == "places")
      return "Where is ";
    if (this.type == "pt") {
      if (this.city == "hometown")
        return "Where was the hometown of ";
      else if (this.city == "started" || this.city == "born")
        return "Where was ";
      else if (this.city == "lived" || this.city == "worked" || this.city == "bus")
        return "Where did ";
      else if (this.city == "live" || this.city == "works")
        return "Where does ";
      else if (this.city == "resting place")
        return "Where is the resting place of ";
      else if (this.city == "place")
        return "Where is ";
      else return "Where is ";
    }
    if (this.type == "pop")
      return "What is the population of ";
    if (this.type == "weather")
      return "What is the normal high temp today in ";
    if (this.type == "age")
      return "How old is ";
    if (this.type == "time")
      return "Guess the Year: ";
    if (this.type == "rand")
      return this.city.charAt(0).toUpperCase() + this.city.slice(1);
  }

  static getUnitsAway(type, distanceAway) {
    var message;
    if (distanceAway > 1000)
      distanceAway = distanceAway.toLocaleString();
    if (type == "pop")
      message = distanceAway + " people";
    if (distanceAway == "millions of ")
      distanceAway = "";
    else if (type == "weather")
      message = distanceAway + " degrees";
    else if (type == "age" || type == "time")
      message = distanceAway + " years";
    else if (type == "geo" || type == "pt" || type == "places")
      message = distanceAway + " miles";
    else //if (game.type=="rand")
      message = distanceAway + "";
    //die (this.type);
    return message;
  }

  getMessageAway(distanceAway) {
    var message;
    units = ""; //this.getUnitsAway(distanceAway);
    if (this.type == "geo" || this.type == "pt" || this.type == "places")
      message = "Distance away : <br>" + units;
    else
      message = "Off by: <br>" + units;
    return message;
  }

  notifyUsers(io, active) {
    var message = this.type;
    var region;
    if (this.type == "time") {
      if (this.answer < -200) region = 0;
      else if (this.answer < 600) region = 1;
      else if (this.answer < 1200) region = 2;
      else if (this.answer < 1600) region = 3;
      else region = 4;
      message = "WorldTime".region;
    } else if (this.type == "facts" && this.max == -100)
      message = "factsPercent";
    else if (this.type == "facts" && this.max == 100)
      message = ("facts");
    else if (this.type == "facts" && this.max < 100)
      message = ("factsMax");
    else if (this.type == "facts" && this.max > 0)
      message = ("factsRand");
    var round = this.questionNumber;
    if (active == false)
      round = -1;
    var data = {
      game_id: this.game_id,
      title: "Q" + round,
      type: message
    };
    io.in(this.game_id).emit('newQ', data);
    console.log("Alerting users about:" + data.title + " of game:" + this.game_id);
    //return callback(false, question);
    // else
    ////////this.alertUsers(_SESSION["questionNumber"],this.type);
  }
  findBGColor() {
    if (this.type == "pop") return "4449A2";
    else if (this.type == "time") return "3c914a";
    if (this.type == "weather") return "b487ba";
    if (this.type == "facts") return "91c696";
    if (this.type == "sports") return "2a8469";
    if (this.type == "science") return "842a7f";
    if (this.type == "estimation") return "6e9a20";
    else return "84392A";
  }

  findRoundingValue() {
    if (this.type == "MIH") return 1;
    if (this.type == "pop") return 100000;
    if (this.type == "facts" && this.answer < 40) return .1;
    if (this.answer > 2000) return 10;
    if (this.answer > 10000) return 100;
    if (this.answer > 100000) return 1000;
    if (this.answer > 1000000) return 10000;
    return 1;
  }

  findStartingValue() {
    if (this.type == "pop") return 10000000;
    if (this.type == "weather" || this.max - this.min == 0) {
      return 50;
    }
    return (this.max - this.min) / 2;
  }

  findUnit() {
    if (this.type == "pop") return "";
    if (this.type == "weather") {
      return "°F";
    }
    if (this.type == "age") return " years old";
    //  if (this.type == "age") return " %";
    if (this.wording.indexOf("%") != -1 || this.wording.indexOf("percent") != -1) return "%";
    return " ";
  }
  findInputSize() {
    var high = this.answer;
    if (this.max > high) high = this.max;
    if (this.type == "pop") return 9;
    if (high < 100)
      return 2;
    else if (high < 1000)
      return 3;
    else if (high < 10000)
      return 4;
    else return 9;
  }

  findRange() {
    if (this.type == "pop") {
      if (this.answer > 200000000)
        return "'min': [0],  '10%': [100000000],      '20%': [20000000],      '30%': [300000000],      '40%': [400000000]," +
          "    '50%': [500000000],    '60%': [600000000],    '70%': [800000000],    '80%': [1000000000],  '90%': [1500000000],  'max': [2000000000]";
      if (this.answer > 80000000)
        return "'min': [0],  '10%': [20000000],      '20%': [40000000],      '30%': [60000000],      '40%': [80000000]," +
          "    '50%': [100000000],    '60%': [120000000],    '70%': [150000000],    '80%': [200000000],  '90%': [300000000],  'max': [400000000]";
      else if (this.answer > 10000000)
        return "'min': [0],  '10%': [5000000],      '20%': [10000000],      '30%': [20000000],      '40%': [30000000]," +
          "    '50%': [40000000],    '60%': [50000000],    '70%': [75000000],    '80%': [100000000],  '90%': [150000000],  'max': [200000000]";
      else
        return "'min': [0],  '10%': [1000000],      '20%': [1500000],      '30%': [2000000],      '40%': [2500000]," +
          "    '50%': [3000000],    '60%': [4000000],    '70%': [6000000],    '80%': [8000000],  '90%': [10000000],  'max': [15000000]";
    }
    if (this.type == "time") {
      console.log(this.answer + " HERERERERER");
      if (this.answer >= 1915) return "'min': [1900],    '25%': [1930],    '50%': [1960],    '75%': [1990],   'max': [2020] ";
      else if (this.answer >= 1600) return "'min': [1600],    '25%': [1700],    '50%': [1800],    '75%': [1900],   'max': [2000] ";
      else if (this.answer >= 1200) return "'min': [1200],    '25%': [1300],    '50%': [1400],    '75%': [1500],   'max': [1600] ";
      else if (this.answer >= 600) return "'min': [600],    '25%': [800],    '50%': [1000],    '75%': [1200],   'max': [1400] ";
      else if (this.answer >= -200) return " 'min': [-200],    '25%': [0],    '50%': [200],    '75%': [400],   'max': [600]";
      else return "   'min': [-800],    '25%': [-600],    '50%': [-400],    '75%': [-200],   'max': [0]";

    }
    if (this.type == "weather" || this.max - this.min == 0) {
      return "'min': [0],    '10%': [10],    '20%': [20],    '30%': [30],      '40%': [40]," +
        "    '50%': [50],    '60%': [60],    '70%': [70],    '80%': [80],  '90%': [90],    'max': [100] ";
    } else
      return "  'min': [" + this.min + "],  '25%': [" + (this.min + (this.max - this.min) / 4) + "],  '50%': [" + (this.min + (this.max - this.min) / 2) + "],  '75%': [" + (this.min + (this.max - this.min) / 4 * 3) + "],      'max': [" + this.max + "]";
  }

  static getRandomUrl(url) {

    var originalUrl = url;
    //url=trim(preg_replace('/\s\s+/', ' ', url));


    console.log(url);
    url = url.replace("[ '", "['");
    url = url.replace(/   /g, "");
    url = url.replace(/, _/g, ",_");

    url = url.substring(1, url.length - 1);
    url = url.replace(/(?:'|")\s*,\s*(?:'|")/g, "','");
    var splits = url.split("','");
    //console.log(splits);
    url = splits[Math.floor(Math.random() * splits.length)];
    url = url.trim();
    if (url.substring(0, 1) == "'") url = url.substring(1);
    if (url.substring(0, 1) == "\"") url = url.substring(1);
    if (url.substring(url.length - 1) == "'") url = url.substring(0, url.length - 1);
    console.log("it is " + url);
    // if (checkRemoteFile(url))
    // 	return url;
    // else if (rand(1,10)<8)
    // 	return Question::getRandomUrl(originalUrl);
    // else
    if (url.length < 1)
      return "https://upload.wikimedia.org/wikipedia/en/7/72/World_Map_WSF.svg.png";
    else return (url);
  }

  addQuestion() {

    var table = "questions";
    // if (isset(_SESSION["single"]) && _SESSION["single"]==true)
    // 	table="questionsSingle";
    if (this.city != "" && this.type != "rand" && this.type != "places")
      var cityName = this.city + "," + this.country;
    else
      var cityName = this.country;
    cityName = escape(cityName);
    var sql;
    if (this.type == "geo" || this.type == "weather" || this.type == "pop" || this.type == "places" || this.type == "pt")
      sql = "INSERT INTO `" + table + "` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('" + this.game_id + "', '" + this.questionNumber + "','" + this.type + "','" + this.qID + "','" + cityName + "', '" + this.lat + "', '" + this.longg + "', '" + this.answer + "')";
    else if (this.type != "age" && this.type != "time")
      sql = "INSERT INTO `" + table + "` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('" + this.game_id + "', '" + this.questionNumber + "','" + this.type + "','" + this.qID + "','" + cityName + "', '" + this.min + "', '" + this.max + "', '" + this.answer + "')";
    else
      sql = "INSERT INTO `" + table + "` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('" + this.game_id + "', '" + this.questionNumber + "','" + this.type + "','" + this.qID + "','" + cityName + "', '0', '0', '" + this.answer + "')";
    //console.log(sql);
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("added question");
    });
  }


  static findQID(game_id, questionNum, callback) {
    var table = "questions";
    // if (isset(_SESSION["single"]) && _SESSION["single"]==true)
    // 	table="questionsSingle";
    var sql = "SELECT * FROM `" + table + "` WHERE `gameid` = '" + game_id +
      "' AND questionNum='" + questionNum + "'";
    //echo (sql);
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return -1;
      }
      return callback(results[0].type + results[0].qID);
    });

  }

  loadImage() {
    var sql;
    console.log('ere');
    console.log(this);
    if (this.type == "estimation") {
      if (this.country == "colHt") {
        var vars = {
          target: this.answer,
          scaled: this.city,
          showAnswerTarget: this.answer,
          showAnswerValue: '80%'
        };
        return this.getSimulationFile('columnHeight', vars);
      }
      if (this.country == "piePerc") {
        var vars = {
          startingAngle: rand(10, 350),
          percRem: (100 - this.answer),
          perc: this.answer,
          showAnswer: 'percentage'
        };
        return this.getSimulationFile('piePercent', vars);
      }
      if (this.country == "howMany") {
        var vars = {
          count: this.answer
        };
        return this.getSimulationFile('howMany', vars);
      }
      if (this.country == "mapDist" || this.country == "percSq" || this.country == "ellipse") {
        return this.image = '<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;' +
          '     		margin-right: auto;"><img src="http://34.207.151.231:8080/controller/estimation/tmp/' + this.city +
          '.png"></div>';
      }
    }
    if (this.type == "mih")
      return this.image = '<div id="brain_div" style="width: 600px; height: 600px;     font-size: 120;   margin-left: auto;  margin-right: auto;">' + this.city + '</div>';


    //  var vars = {startingAngle:rand(10,350),
    //   perc: this.answer,
    //   percRem:(100-this.answer),
    //   showAnswer: 'none'
    // };
    // return this.getSimulationFile('piePercent', vars, callback);
    // }
    if (this.type == "pop" || this.type == "weather")
      sql = "SELECT * FROM `data-geo` WHERE `id`='" + this.qID + "' LIMIT 1";
    else if (this.type == "places" || this.type == "products" || this.type == "people") {
      sql = "SELECT * FROM `data-geo-" + this.type + "` WHERE `id`='" + this.qID + "' LIMIT 1"; //" WHERE `id`='3'";
    } else if (this.type == "pt") {

      if (this.city == "based" || this.city == "started")
        sql = "SELECT * FROM `data-geo-products` WHERE `id`='" + this.qID + "' LIMIT 1"; //" WHERE `id`='3'";
      else
        sql = "SELECT * FROM `data-geo-people` WHERE `id`='" + this.qID + "' LIMIT 1"; //" WHERE `id`='3'";
    } else
      sql = "SELECT * FROM `data-" + this.type + "` WHERE `id`='" + this.qID + "' LIMIT 1"; //" WHERE `id`='3'";
    var alias = this;
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
      }
      var url = results[0].image;
      alias.image = Question.getRandomUrl(url);

    });

  }

  checkRepeats(callback) {
    var sql = "select count(*) total FROM `questions` WHERE gameID='" + this.game_id + "' AND type='" + this.type + "' AND `qID`='" + this.qID + "'";
    db.getQuery(sql, function(err, results) {
      console.log(results);
      if (err || results.total > 1) {
        return callback(true);
      } else return callback(false);
    });
  }

  static loadQuestionSimple(loadedQuestion, callback) {
    var question = new Question();
    question.type = loadedQuestion.type;
    var type = loadedQuestion.type;
    question.questionNumber = loadedQuestion.questionNum;
    question.wording = loadedQuestion.country;
    question.answer = loadedQuestion.answer;
    question.min = loadedQuestion.lat;
    question.max = loadedQuestion.longg;

    if (loadedQuestion.wording != "")
      question.country = loadedQuestion.wording;
    question.country = unescape(question.country);
    question.questionNumber = loadedQuestion.questionNumber;



    return callback(false, question);


  }

  static loadQuestion(game_id, callback) {
    var table = "questions";
    // if (isset(_SESSION["single"]) && _SESSION["single"] == true)
    //   table = "questionsSingle";
    var sql = "SELECT * FROM `" + table + "` WHERE gameid ='" + game_id +
      "' ORDER BY questionNum DESC, questionID DESC";
    db.getQuery(sql, function(err, results) {
      if (err) {
        console.log(err);
        return callback(true);
      }
      var question = new Question();
      question.type = results[0].type;
      var type = question.type;
      question.qID = results[0].qID;
      question.questionNumber = results[0].questionNum;
      question.country = unescape(results[0].wording);
      question.answer = results[0].answer;
      question.min = results[0].lat;
      question.max = results[0].longg;
      question.game_id = game_id;
      if (type == "geo" || type == "pop" || type == "weather" || type == "pt" || type == "estimation" || type == "mih") {
        var splits = question.country.split(",");
        question.country = splits[1];
        question.city = splits[0];

      }
      return callback(false, question);
    });

  }




  //
  // 	function getQuestion(type){
  // 		global conn;
  // 		sql = "SELECT * FROM `data-type`  ORDER BY rand() LIMIT 1";//" WHERE `id`='3'";
  // 		//echo sql;
  // 		//	sql = "SELECT * FROM `data-geo`   WHERE `id`='13'";
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 			if(row = result.fetch_assoc()){
  // 				//this.city=results[0].category;
  // 				this.country=results[0].wording;
  // 				this.qID=results[0].id;
  // 				if (this.checkForRepeats(this.country))
  // 				{
  // 					this.getQuestion(type);
  // 					return;
  // 				}
  // 				this.answer=results[0].answer;
  // 				this.min=results[0].min;
  // 				this.max=results[0].max;
  // 				url= results[0].image;
  // 				this.image=Question::getRandomUrl(url);
  //
  //         //this.image="a.jpg";//Question::getRandomUrl(url);
  // 				}
  // 		}
  //
  //
  // 	}
  //
  // 	function read(file, vars) {
  // 	 ob_start();
  // 	 extract(vars, EXTR_SKIP);
  // 	 include(file);
  // 	 content = ob_get_contents();
  // 	 ob_end_clean();
  // 	//  loc=strrpos(content,"link");
  // 	//  img=substr(content,loc);
  //
  // 	 return content;
  //  }
  //
  // 	function getEstimation(){
  // 		  //either get a cel age (75% of time )
  // 			random=rand(1,6);
  // 			if (random==1){
  // 				this.country="colHt";
  // 				this.answer=rand(30,1000);
  // 				this.min=0;
  // 				this.max=1000;
  // 				height1=rand(30,1000);
  // 				height2=rand(30,1000);
  // 				while ((height1<height2*2 && height2<height1*2) || height1<height2/8 || height2<height1/8){
  // 				  height1=rand(1,1000);
  // 				  height2=rand(1,1000);
  // 				}
  // 				this.city=height1*this.answer/height2;
  // 				this.qID="colHt".this.answer;
  // 				vars = array(  'target' => this.answer,'scaled'=>this.city,'showAnswer'=>'no');
  // 				this.image= this.read('estimation/columnHeight.php',vars);
  // 			}
  // 			else if (random==2){
  // 				this.country="piePerc";
  // 				this.city="piePerc";
  // 				this.answer=rand(1,99);
  // 				this.min=0;
  // 				this.max=100;
  // 				while (this.answer==50 || this.answer==25 || this.answer==75){
  // 					this.answer=rand(1,99);
  // 				}
  // 				this.qID="piePerc".this.answer;
  // 				vars = array(  'perc' => this.answer,'showAnswer'=>'no');
  // 				this.image= this.read('estimation/piePercent.php',vars);
  // 			}
  // 			else if (random==3){
  // 				this.country="howMany";
  // 				this.city="howMany";
  // 				this.answer=rand(30,300);
  // 				this.min=0;
  // 				this.max=300;
  // 				this.qID="howMany".this.answer;
  // 				vars = array(  'count' => this.answer,'showAnswer'=>'no');
  // 				this.image= this.read('estimation/howMany.php',vars);
  // 			}
  // 			else if (random==4){
  //
  // 				target=rand(30,1000);
  //
  // 				this.country="mapDist";
  // 				this.city=rand(1,1000);
  // 				this.answer=target;
  // 				this.min=0;
  // 				this.max=1000;
  // 				this.qID="mapDist".this.answer;
  // 				vars = array( 'target'=>this.answer, 'rand' => this.city,'showAnswer'=>'no');
  // 				img=this.read('estimation/mapDistance.php',vars);
  // 				this.image='<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 		    margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 			}
  // 			else if (random==5){
  //
  //
  // 				target=rand(1,99);
  // 				this.country="percSq";
  // 				this.city=rand(1001,2000);
  // 				this.answer=target;
  // 				this.min=0;
  // 				this.max=100;
  // 				this.qID="percSq".this.answer;
  // 				vars = array( 'targetPercent'=>this.answer, 'randomFileName' => this.city,'showAnswer'=>'no');
  // 				img=this.read('estimation/percentSquare.php',vars);
  // 				this.image='<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 		    margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 			}
  // 			else if (random==6){
  //
  //
  // 				target=rand(30,1000);
  // 				this.country="ellipse";
  // 				this.city=rand(2001,3000);
  // 				this.answer=target;
  // 				this.min=0;
  // 				this.max=1000;
  // 				this.qID="ellipse".this.answer;
  // 				vars = array( 'target'=>this.answer, 'randomFileName' => this.city,'showAnswer'=>'no');
  // 				img=this.read('estimation/circleSize.php',vars);
  // 				this.image='<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 		    margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 			}
  // 			else if (random==7){
  // 				target=rand(3,50);
  // 				this.country="tri";
  // 				this.city=rand(3001,4000);
  // 				this.answer=target;
  // 				this.min=0;
  // 				this.max=50;
  // 				this.qID="rect".this.answer;
  // 				vars = array( 'target'=>this.answer, 'randomFileName' => this.city,'showAnswer'=>'no');
  // 				img=this.read('estimation/rectangle.php',vars);
  // 				this.image='<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 		    margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 			}
  //
  // 	}
  //
  // 	function getEntertainment(){
  // 		  //either get a cel age (75% of time )
  // 			if (rand(0,100)>65)
  // 					this.getQuestion('entertainment');
  // 			else {
  // 				this.type="age";
  // 				this.getAge();
  //
  // 			}
  // 	}
  // 	function getWeather(){
  // 		this.getLocation("weather");
  // 		//latLong=LatLong::findLatLong(this.city,this.country);
  // 		url='http://api.wunderground.com/api/766deb6baf5fc335/almanac/conditions/forecast/q/'.this.lat.','.this.longg.'.json';
  // 		jsonData =file_get_contents( url);
  // 		phpArray = json_decode(jsonData,true);
  // 		//echo url;
  // 		this.answer=phpArray["almanac"]["temp_high"]["normal"]["F;
  // 		if (this.answer=="" || this.answer<=0)
  // 		{
  // 			this.type="geo";
  // 			this.getLocation(this.type);
  // 		}
  //
  //   }
  //
  // 	function getRand(){
  // 		global conn;
  // 		sql = "SELECT * FROM `data-rand`  ORDER BY rand() LIMIT 1";//" WHERE `id`='3'";
  // 		//echo sql;
  // 		//	sql = "SELECT * FROM `data-geo`   WHERE `id`='13'";
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 			if(row = result.fetch_assoc()){
  // 				this.city=results[0].category;
  // 				this.country=results[0].wording;
  // 				this.answer=results[0].answer;
  // 				this.min=results[0].min;
  // 				this.max=results[0].max;
  // 				url= results[0].image;
  // 				this.image=Question::getRandomUrl(url);
  // 				this.qID=results[0].id;
  //         //this.image="a.jpg";//Question::getRandomUrl(url);
  // 				}
  // 		}
  // 		if (this.checkForRepeats(this.country))
  // 			this.getRand();
  // 	}
  //
  // 	function getAge(){
  // 		global conn;
  // 		sql = "SELECT * FROM `data-age`  ORDER BY rand() LIMIT 1";//" WHERE `id`='3'";
  // 	//		sql = "SELECT * FROM `data-people`  WHERE `id`='169'";
  // 		//echo sql;
  // 		//	sql = "SELECT * FROM `data-geo`   WHERE `id`='13'";
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 			if(row = result.fetch_assoc()){
  // 				this.country=results[0].name;
  // 				//this.city=results[0].city;
  // 				//echo this.country;
  // 				date_default_timezone_set('America/Los_Angeles');
  // 				now = new DateTime("now");
  // 				bday = date_create(results[0].birthday"]);
  // 				age=date_diff(now, bday);
  // 				this.answer=age.format('%y');
  // 				url= results[0].image;
  //
  // 				this.qID=results[0].id;
  // 				if (this.checkForRepeats(this.country))
  // 				{
  // 					this.getAge();
  // 					return;
  // 				}
  // 				this.image=Question::getRandomUrl(url);
  // 				}
  // 		}
  //
  // 	}
  //
  // 	function getTime(){
  // 		global conn;
  // 		regionsSelected=_SESSION["regionsSelected;
  // 		sql = "SELECT * FROM `data-time` WHERE `imageUpdatedDate` IS NOT null AND";
  // 		foreach (regionsSelected as region)
  // 			sql.=" `region` = '" . region ."' OR";
  // 		sql=substr(sql,0,strlen(sql)-3);
  // 		 sql.=" ORDER BY rand() LIMIT 1";//" WHERE `id`='3'";
  // 	//	die (sql);
  //
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 			if(row = result.fetch_assoc()){

  // 				this.country=results[0].wording;
  // 				this.answer=results[0].answer;
  // 				url= results[0].image;
  // 				this.qID=results[0].id;
  //
  // 				if (this.checkForRepeats(this.country))
  // 				{
  // 					this.getTime();
  // 					return;
  // 				}
  // 				this.image=Question::getRandomUrl(url);
  // 				//echo ("sdf");
  //
  // 			}
  // 		}
  //
  // 	}
  //
  // 	function getFacts(){
  // 		global conn;
  // 		if (rand(1,10)<7){
  // 			this.type="pop";
  // 			return this.getLocation("pop");
  // 		}
  //
  // 		regionsSelected=_SESSION["regionsSelected;
  // 		sql = "SELECT * FROM `data-facts` WHERE `imageUpdatedDate` IS NOT null AND";
  // 		foreach (regionsSelected as region)
  // 			sql.=" `region` = '" . region ."' OR";
  // 		sql=substr(sql,0,strlen(sql)-3);
  // 		 sql.="  ORDER BY rand() LIMIT 1";//" WHERE `id`='3'";
  // 		//die (sql);
  //
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 			if(row = result.fetch_assoc()){
  // 				this.country=results[0].wording"] . " ".results[0].country"] . "(".results[0].year"] . ")" ;
  // 				this.answer=results[0].answer;
  // 				url= results[0].image;
  // 				this.qID=results[0].id;
  // 				if (this.checkForRepeats(this.country))
  // 				{
  // 					this.getFacts();
  // 					return;
  // 				}
  // 				this.image=Question::getRandomUrl(url);
  // 				this.max=results[0].max;
  // 				this.min=0;
  // 			}
  // 		}
  //
  // 	}
  //
  //
  // 	function getUserQuestion(){
  // 			csvData = file_get_contents("https://docs.google.com/spreadsheets/d/1fco39wut_t7dFqCQ8ZuNe7VGCupndG8UPpinlohpbXc/pub?output=csv");
  //
  // 		lines = explode(PHP_EOL, csvData);
  //
  // 		array = array();
  // 		randEntry=rand(0,sizeof(lines)-1);
  // 		city=explode(",",lines[randEntry]);
  // 		//echo "city ".city[1] . "sdf";
  // 		if (sizeof(city)>1){
  // 		//	this.city=preg_replace( "/\r|\n/", "", (city[0]));
  // 			this.country=preg_replace( "/\r|\n/", "", (city[0]));
  // 			this.answer=preg_replace( "/\r|\n/", "", (city[1]));
  // 		}
  // 		if (this.checkForRepeats(this.country))
  // 			this.getUserQuestion();
  //
  // }
  //
  //
  //
  // 	function getPPT(type){
  // 		global conn;
  // 		//echo "here";
  // 		regionsSelected=_SESSION["regionsSelected;
  //
  // 		//determine people, place, things
  // 		rand=rand(1,9);
  // 	  if (rand<7)
  // 		   db="people";
  // 		else db="products";
  //
  // 		if (type=="places")db="places";
  //
  // 		sql = "SELECT * FROM `data-geo-db` WHERE ";
  //     foreach (regionsSelected as region)
  // 			sql.=" `region` = '" . region ."' OR";
  // 			sql=substr(sql,0,strlen(sql)-3);
  // 			sql.=" ORDER BY rand() LIMIT 1";
  // 		//die (sql);
  // 		//sql.="  `id`='60'";
  // 		//	sql = "SELECT * FROM `data-geo`   WHERE `country`='Antigua and Barbuda'";
  //     //sql = "SELECT * FROM `data-geo` WHERE `id`=75";
  // 		//die (sql);
  // 		result = conn.query(sql);
  // 	//	echo "a";
  // 		if (result)
  // 		{
  // 		  if(row = result.fetch_assoc()){
  // 				if (db=="places"){
  // 						this.country=results[0].place;
  // 						this.city="place";
  // 				}
  // 				if (db=="people"){
  // 						this.country=results[0].name;
  // 						this.city=results[0].type;
  // 				}
  // 				if (db=="products"){
  // 						this.country=results[0].product;
  // 						this.city=results[0].basedOrStarted;
  // 				}
  // 				this.lat=results[0].lat;
  // 				this.longg=results[0].longg;
  // 				//this.answer=results[0].population;
  // 		    url= results[0].image;
  // 				//echo "b";
  // 		    this.image=Question::getRandomUrl(url);
  // 				this.qID=results[0].id;
  // 				//echo "c";
  // 					//echo this.image;
  // 		  }
  // 		}
  // 	//	if (this.checkForRepeats(this.country))
  // 	//		this.getPPT(db);
  //
  // }
  //
  // 	function getLocation(type){
  //
  // 		global conn;
  // 		regionsSelected=_SESSION["regionsSelected;
  // 		sql = "SELECT * FROM `data-geo` WHERE ( ";
  //
  //     foreach (regionsSelected as region)
  // 			sql.=" `location` = '" . region ."' OR";
  // 		sql=substr(sql,0,strlen(sql)-3);
  // 		sql.=" ) ";
  // 		if (type=="pop" || type=="population" || this.type=="pop")
  // 			sql.=" AND `population`>0";
  // 		sql.=" ORDER BY rand() LIMIT 1";
  // 		//die (sql);
  // 		//" WHERE `id`='3'";
  // 		//	sql = "SELECT * FROM `data-geo`   WHERE `country`='Antigua and Barbuda'";
  //     //sql = "SELECT * FROM `data-geo` WHERE `id`=75";
  // 		result = conn.query(sql);
  // 		if (result)
  // 		{
  // 		  if(row = result.fetch_assoc()){
  // 				this.country=results[0].country;
  // 				this.city=results[0].city;
  // 				this.lat=results[0].lat;
  // 				this.longg=results[0].longg;
  // 				this.answer=results[0].population;
  // 		    url= results[0].image;
  // 				this.qID=results[0].id;
  // 				if (this.checkForRepeats(this.country)){
  // 					this.getLocation(type);
  // 					return;
  // 				}
  // 				this.image=Question::getRandomUrl(url);
  // 					//echo this.image;
  // 		  }
  // 		}
  //
  //
  // }
  //
  // public static function loadImageOld(wording,type){
  //
  // 	global conn;
  // 	wording=conn.escape_string (wording);
  // 	//die (type);
  // 	if (type=="geo" || type=="pop" || type=="weather")
  // 	{
  // 		//die (wording);
  // 		words=explode(",",wording);
  // 		city=words[0];
  // 		country=words[1];
  // 		sql = "SELECT * FROM `data-geo` WHERE `country`='country' AND `city`='city' LIMIT 1";//" WHERE `id`='3'";
  // 	}
  // 	else if (type=="age")
  // 		sql = "SELECT * FROM `data-age` WHERE `name`='wording'  LIMIT 1";//" WHERE `id`='3'";
  // 	else if (type=="time")
  // 		sql = "SELECT * FROM `data-time` WHERE `wording`='wording' LIMIT 1";//" WHERE `id`='3'";
  // 		else if (type=="places")
  // 			sql = "SELECT * FROM `data-geo-places` WHERE `wording`='wording' LIMIT 1";//" WHERE `id`='3'";
  // 		else
  // 			sql = "SELECT * FROM `data-db` WHERE `wording`='wording' LIMIT 1";//" WHERE `id`='3'";
  // 	result = conn.query(sql);
  // 	//die(sql);
  // 	if (result)
  // 	{
  // 		if(row = result.fetch_assoc()){
  // 			url= results[0].image;
  // 			return Question::getRandomUrl(url);
  // 		}
  // 	}
  // }
  //
  // public function loadImage(){
  //
  // 	global conn;
  // 	if (this.type=="estimation"){
  // 		if (this.country=="colHt"){
  // 			vars = array(  'target' => this.answer,'scaled'=>this.city,'showAnswer'=>'yes');
  // 			return this.read('estimation/columnHeight.php',vars);
  // 		}
  // 		if (this.country=="piePerc"){
  // 			vars = array(  'perc' => this.answer,'scaled'=>this.city,'showAnswer'=>'yes');
  // 			return this.read('estimation/piePercent.php',vars);
  // 		}
  // 		if (this.country=="howMany"){
  // 			vars = array(  'count' => this.answer,'scaled'=>this.city,'showAnswer'=>'yes');
  // 			return this.read('estimation/howMany.php',vars);
  // 		}
  // 		if (this.country=="mapDist" || this.country=="percSq" || this.country=="ellipse"){
  // 			return '<div id="chart_div" style="width: 600px; height: 600px;    margin-left: auto;
  // 			margin-right: auto;"><img src="controller/estimation/tmp/'.this.city.'.png"></div>';
  // 		}
  //
  // 	}
  // 	if (this.type=="pop" || this.type=="pop" || this.type=="weather")
  // 		return this.loadImageOld(this.city.",".this.country, this.type);
  // 	if (this.type=="places" || this.type=="products" || this.type=="people" )
  // 	{
  // 		sql = "SELECT * FROM `data-geo-this.type` WHERE `id`='this.qID' LIMIT 1";//" WHERE `id`='3'";
  // 	}
  // 	else if (this.type=="pt")
  // 	{
  //
  // 		if (this.city=="based" ||  this.city=="started")
  // 				sql = "SELECT * FROM `data-geo-products` WHERE `id`='this.qID' LIMIT 1";//" WHERE `id`='3'";
  // 		else
  // 				sql = "SELECT * FROM `data-geo-people` WHERE `id`='this.qID' LIMIT 1";//" WHERE `id`='3'";
  // 	}
  // 	else
  // 		sql = "SELECT * FROM `data-this.type` WHERE `id`='this.qID' LIMIT 1";//" WHERE `id`='3'";
  //
  // 	result = conn.query(sql);
  // 	//die(sql);
  // 	if (result)
  // 	{
  // 		if(row = result.fetch_assoc()){
  // 			url= results[0].image;
  // 			return Question::getRandomUrl(url);
  // 		}
  // 	}
  // }
  //
  // function checkForRepeats(country){
  // 	//return false;
  // 	//echo "here";
  // 	global conn;
  // 	this.timesRepeated++;
  // 	if (this.timesRepeated>=8 && this.type!="geo"){
  // 		this.type="geo";
  // 		this.timesRepeated=0;
  // 		this.getLocation("geo");
  // 		return false;
  // 	}
  // 	if (isset(_SESSION["single"]) && _SESSION["single"]==true)
  // 	{
  // 		sql = "select count(*) total FROM `answers` WHERE `question_id`='".this.type.this.qID."'";
  // 		result = conn.query(sql);
  // 		//echo(sql);
  // 		if (result)
  // 		{
  // 				row = result.fetch_assoc();
  // 				if (row ['total']>10){
  // 					//echo (sql);
  // 					return false;
  // 				}
  // 		}
  // 		 return true;
  // 	}
  //
  //
  // 		 sql = "SELECT * FROM `questions` WHERE gameID='"._SESSION["game_id"]."' AND wording LIKE '%country%'";
  // 	 	result = conn.query(sql);
  // 		//echo sql;
  //
  // 		if (result!=null && result.num_rows>0)
  // 		   return true;
  // 	  return false;
  //
  // }
  //
  // function getImage(){
  //
  // 	return this.image;
  // }
  //
  // function addAnswer(){
  // 	global conn;
  // 	//latLong=new LatLong();
  // 	//if (this.type=="geo" || this.type=="weather" || this.type=="pop")
  // 	//    latLong=LatLong::findLatLong(this.city,this.country);
  // //  if (this.type=="rand")  //we save min max of random as a lat just for ease
  // //	    latLong=new LatLong(this.min,this.max);
  // //  else
  // //		  min=new LatLong(0,0);
  //   table="questions";
  // 	if (isset(_SESSION["single"]) && _SESSION["single"]==true)
  // 		table="questionsSingle";
  // 	if (this.city!="" && this.type!="rand" && this.type!="places")
  // 		cityName=this.city . ",".this.country;
  //   else
  // 		cityName=this.country;
  // 	cityName=conn.real_escape_string(cityName);
  // 	if (this.type=="geo" || this.type=="weather" || this.type=="pop"|| this.type=="places"|| this.type=="pt")
  // 		sql = "INSERT INTO `table` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('"._SESSION["game_id"]."', '"._SESSION["questionNumber"]."','".this.type."','".this.qID."','cityName', '".this.lat."', '".this.longg."', '".this.answer."')";
  // 	else if (this.type!="age" && this.type!="time")
  // 		sql = "INSERT INTO `table` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('"._SESSION["game_id"]."', '"._SESSION["questionNumber"]."','".this.type."','".this.qID."','cityName', '".this.min."', '".this.max."', '".this.answer."')";
  //   else
  // 		sql = "INSERT INTO `table` (`gameID`, `questionNum`,`type`,`qID` ,`wording`, `lat`, `longg`,`answer`) VALUES ('"._SESSION["game_id"]."', '"._SESSION["questionNumber"]."','".this.type."','".this.qID."','cityName', '0', '0', '".this.answer."')";
  //
  // 	result = conn.query(sql);
  // 	//echo sql;
  // 	//die (sql);
  // }
  //
  // public static function findQuestion()
  // {
  // 	global conn;
  // 	table="questions";
  // 	if (isset(_SESSION["single"]) && _SESSION["single"]==true)
  // 		table="questionsSingle";
  // 	sql = "SELECT * FROM `table` WHERE `gameid` = '"._SESSION["game_id"]."' order by questionNum DESC LIMIT 1";
  // 	//echo (sql);
  //
  //
  // 	result = conn.query(sql);
  // 	if (result)
  // 	{
  // 		row = result.fetch_assoc();
  // 		if (row){
  // 			if (isset(results[0].active"]) && results[0].active"]>=1){
  // 				usleep(500000);
  // 				return Question::findQuestion();
  // 			}
  // 			else {
  // 				game=new self(null);
  // 				game.qID= results[0].questionNum;
  // 				game.type=results[0].type;
  // 				game.answer=results[0].answer;
  // 				if (isset(results[0].active"]) && results[0].active"]!=0)
  // 						game.answer="waiting";
  // 				//game.max=results[0].max;
  //
  //
  // 				return game;
  // 			}
  // 		}
  //
  // 	}
  // 	return null;
  //
  //
  // }
  //
  //
  //
  // function checkRemoteFile(url)
  // {
  //     ch = curl_init();
  //     curl_setopt(ch, CURLOPT_URL,url);
  //     // don't download content
  //     curl_setopt(ch, CURLOPT_NOBODY, 1);
  //     curl_setopt(ch, CURLOPT_FAILONERROR, 1);
  //     curl_setopt(ch, CURLOPT_RETURNTRANSFER, 1);
  //     if(curl_exec(ch)!==FALSE)
  //     {
  //         return true;
  //     }
  //     else
  //     {
  //         return false;
  //     }
  // }
  //

}

function rand(low, high) {
  return Math.floor(Math.random() * (high - low + 1)) + low;
}


module.exports = Question;
