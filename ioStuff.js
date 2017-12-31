var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'myhoot',
  database : 'MyHoot'
});

class DB{
   static getNumAnswers(callback){
       DB.getQuery("SELECT COUNT(id) as total FROM answers", function(err, results) {
       if(err) {
          //console.log("in dhere" + err);
           return "";
     }
       results=""+(results[0].total);
         callback(false, results);
   });
 }

  static getQuery(query, callback) {
  //var sql = "SELECT name FROM users WHERE city=?";
  // get a connection from the pool
  console.log(query);
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(query, function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      //console.log(results);
      callback(false, results);
    });
  });
};

}

module.exports = DB;
