var express = require("express");
var mysql = require("mysql"); 
var router = express.Router();

var pool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "rootroot123",
	database: "zhiyuntong",
	post: "3306"
});

router.post('/addTelRecordLists', function(req, res){
	var cusId = req.body['cid'];
	var uname = req.body['name'];
	var time = req.body['time'];
	var nexttime = req.body['nexttime'];
	var message = req.body['msg'];
	pool.getConnection(function(err, connection){
    var addRecord = 'insert into telRecord(cusID, name, time, nexttime, message) values(?, ?, ?, ?, ?)';
	    connection.query(addRecord, [cusId, uname, time, nexttime, message], function(err, result){
	    	if(err){
	    		console.log("Error: " + err.message);
	    	}
	    	connection.release();
	    	if(result.insertId > 0){
	    		res.send({flag: 1});
	    	}else{
	    		res.send({flag: 2});
	    	}
	    });
	});
});

router.get('/getRecordLists', function(req, res){
	var cusId = req.query.cusId;
	pool.getConnection(function(err,  connection){
    var getRecord = 'select * from telRecord where cusID = ?';
    connection.query(getRecord, [cusId], function(err, result){
    	if(err){
	  		console.log("Error: " + err.message);
	  	}
	  	connection.release();
	  	res.send(result);
    });
	});
});

module.exports = router;