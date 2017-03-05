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

router.post("/login", function(req, res){
	var user = req.body["username"];
	var pwd = req.body["password"];
	getUserByName(user, function(err, result){
		if(result.length == 0){
			res.send({flag: 2});
		}else{
			if(result[0].password == pwd){
				req.session.uname = user; // 放前边可以通过ajax传入前台
				req.session.userID = result[0].userID;
				res.send({flag: 1});
			}else{
				res.send({flag: 3});
			}
		}
	});
});

router.post("/regist", function(req, res){
	var user = req.body["username"];
	var pwd = req.body["password"];
	getUserByName(user, function(err, result){
		if(result.length == 0){
			addUserData(user, pwd, function(err, result){
				if(result.insertId > 0){
					res.send({flag: 1});
				}else{
					res.send({flag: 3});
				}
			});
		}else{
			res.send({flag: 2});
		}
	});
});

router.post("/configUser", function(req, res){
	var user = req.body["username"];
	getUserByName(user, function(err, result){
		// console.log(result);
		if(result.length == 0){
			res.send({flag: 2});
		}else{
			res.send({flag: 1});
		}
	});
});

// 根据用户名获取用户信息
function getUserByName(uname, callback){
  pool.getConnection(function(err, connection){
    var search_sql = "select * from user where username = ?";    // username = ? && password = ?;
    connection.query(search_sql, [uname], function(err, result){
      if(err){
        console.log("Error:" + err.message);
        return;
      }
      connection.release();        // 释放数据库连接
      console.log("invoked[getUserByName]");
      callback(err, result);
    });
  });
};

// 插入数据
function addUserData(uname, upass, callback){
  pool.getConnection(function(err, connection){
    var add_sql = "insert into user (username, password) values(?,?)";    // username = ? && password = ?;
    connection.query(add_sql, [uname, upass], function(err, result){
      if(err){
        console.log("Error:" + err.message);
        return;
      }
      connection.release();        // 释放数据库连接
      console.log("invoked[addUserData]");
      callback(err, result);
    });
  });
};

module.exports = router;
