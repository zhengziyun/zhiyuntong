var express = require('express');
var mysql = require('mysql');
var pool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "rootroot123",
	database: "zhiyuntong",
	post: "3306"
});
var router = express.Router();

router.get('/lists', function(req, res){
	pool.getConnection(function(err, connection){
		var search_sql = "select * from custom";
		connection.query(search_sql, function(err, result){
			console.log(result + ">>>");
			if(err){
				console.log("Error" + err.message);
				return;
			}
			connection.release();		
			res.send(result);
		})
	});
});

// 显示有用、无用的用户
router.get('/isusing', function(req, res){
	console.log("into isusing>>>");
	var num = req.query.tag;
	//console.log(num);
	if(req.session.uname){
		pool.getConnection(function(err, connection){
			var judge_sql = "select * from custom where com1 = ?";
			connection.query(judge_sql, [num], function(err, result){
				if(err){
					console.log("Error:" + err.message);
					return;
				}
				connection.release();
				res.send(result);
			});
		});
	}else{
		res.send("no user message!");
	}
});

//删除数据
// router.get('/del/:id/:aa',function(req, res){
	// console.log("into delete>>>");
	// var id = req.query.id;
	// var aa = req.query.aa;

	// console.log(id+'>>>>');
	// console.log(aa+'>>>>');
	// res.send({flag: 1});
	// pool.getConnection(function(err, connection){
	// 	var del_sql = "delete from custom where cusId = ?";
	// 	connection.query(del_sql, [id], function(err, result){
	// 		if(err){
	// 			console.log("Error:" + err.message);
	// 			return;
	// 		}
	// 		connection.release();
	// 		res.send(result);
	// 	})
	// });
// });

router.get('/details', function(req, res){
	console.log("into details>>>");
	var cusId = req.query.cusId;
	pool.getConnection(function(err, connection){
		var details = "select * from custom where cusId = ?";
		connection.query(details, [cusId], function(err, result){
			if(err){
				console.log("Error: " + err.message);
				return;
			}
			connection.release();
			res.send(result);
		});
	});
});

router.post('/update', function(req, res){
	var name = req.body['name'];
	var old = req.body['old'];
	var sex = req.body['sex'];
	var tel = req.body['tel'];
	var company = req.body['company'];
	var job = req.body['job'];
	var important = req.body['important'];
	var habits = req.body['habits'];
	var freetime = req.body['freetime'];
	var addr = req.body['addr'];
	var email = req.body['email'];
	var qq = req.body['qq'];
	var cId = req.body['cId'];
	console.log(tel);
	pool.getConnection(function(err, connection){
		var update = 'update custom set name=?, com2=?, sex=?, tel=?, company=?, job=?, importance=?, habits=?, freetime=?, address=?, email=?, qq=? where cusId = ?'
		connection.query(update, [name, old, sex, tel, company, job, important, habits, freetime, addr, email, qq, cId], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			res.send(result);
		})
	});
});

// 获取自己的客户总条数
router.get('/getTotalLists', function(req, res){
	console.log("into getTotalLists>>>");
	var id = req.session.userID;
	if(req.session.uname){
		pool.getConnection(function(err, connection){
			var count_sql = "select count(*) from custom where belong = ?";
			connection.query(count_sql, [id], function(err, result){
				if(err){
					console.log("Error:" + err.message);
					return;
				}
				connection.release();
				res.send(result);
			})
		});
	}else{
		res.send(null);
	}
});

// 获取公海客户总条数
router.get('/getPubTotalLists', function(req, res){
	console.log("into getPubTotalLists>>>");
	pool.getConnection(function(err, connection){
		var count_sql = "select count(*) from custom where belong = -1";
		connection.query(count_sql, function(err, result){
			if(err){
				console.log("Error:" + err.message);
				return;
			}
			connection.release();
			res.send(result);
		})
	});
});

// 获取个人客户
router.get('/getLists', function(req, res){
	var pageName = Number(req.query.pageName)*10;
	console.log("into getLists>>>");
	var id = req.session.userID;
		pool.getConnection(function(err, connection){
			var judge_sql = "select * from custom where belong = ? limit ?,10";
			connection.query(judge_sql, [id, pageName], function(err, result){
				if(err){
					console.log("Error:" + err.message);
					return;
				}
				connection.release();
				res.send(result);
			});
		});
});

// 添加数据
router.post("/add", function(req, res){
	var id = req.session.userID;
	var name = req.body['name'];
	var old = req.body['old'];
	var sex = req.body['sex'];
	var tel = req.body['tel'];
	var company = req.body['company'];
	var job = req.body['job'];
	var habit = req.body['habit'];
	var freetime = req.body['freetime'];
	var address = req.body['address'];
	var email = req.body['email'];
	var qq = req.body['qq'];
	var jointime = new Date().getTime();
	console.log(jointime);
	var important = req.body['important'];
	console.log("into add>>>");
	console.log(id);
	pool.getConnection(function(err, connection){
		var add_sql = "insert into custom (name, sex, tel, company, job, belong, importance, habits, freetime, address, email, qq, jointime, com2) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"; 
		connection.query(add_sql, [name, sex, tel, company, job, id, important, habit, freetime, address, email, qq, jointime, old], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			if(result.insertId && result.insertId > 0){
				res.send({flag: 1});
			}else{
				res.send({flag: 2});
			}
		})
	});
});

// 验证用户名是否存在
router.post('/configCustom', function(req, res){
	var uname = req.body["username"];
	console.log(uname);
	pool.getConnection(function(err, connection){
		var config_sql = "select * from custom where name = ?";
		connection.query(config_sql, [uname], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			if(result.length == 0){
				res.send({flag: 2});
			}else{
				res.send({flag: 1});
			}
		});
	});
});

// 转为公海客户
router.get('/changepublic', function(req, res){
	var cId2 = req.query.cId2;
	pool.getConnection(function(err, connection){
		var change_sql = 'update custom set belong=-1 where cusId = ?';
		connection.query(change_sql, [cId2], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			res.send(result);
		});
	});
});

// 获取公海客户信息
router.get('/public', function(req, res){
	var pageName = Number(req.query.pageName) * 10;
	pool.getConnection(function(err,  connection){
    var getRecord = 'select * from custom where belong = -1 limit ?,10';
    connection.query(getRecord, [pageName], function(err, result){
    	if(err){
	  		console.log("Error: " + err.message);
	  	}
	  	connection.release();
	  	res.send(result);
    });
	});
});

// 获取搜索客户信息
router.post('/getSearchLists', function(req, res){
	var pageName = Number(req.body['pageName'])*10;
	var classifies = req.body['classify'];
	var txt = req.body['text'];
	var index3 = req.body['index3'];
	if(classifies == 'importance'){
		if(txt == '成交客户'){
			txt = 1;
		}else if(txt == '商机客户'){
			txt = 2;
		}else if(txt == '储蓄客户'){
			txt = 3;
		}
	}
	var cid = 0;
	if(index3 == 0){
		cid = req.session.userID;
	}else if(index3 == 1){
		cid = -1;
	}
	console.log("into>>>" + classifies + ">>>" + cid + ">>>" + txt);
	pool.getConnection(function(err,  connection){
		var sel_sql = 'select * from custom where belong = ? and '+classifies+' like "%'+txt+'%" limit ?,10';
    connection.query(sel_sql, [cid, pageName], function(err, result){
    	if(err){
	  		console.log("Error: " + err.message);
	  	}
	  	connection.release();
	  	res.send(result);
    });
	});
});

// 转为个人客户
router.get('/changeperson', function(req, res){
	var cId3 = req.query.cId3;
	var userId = req.session.userID; 
	pool.getConnection(function(err, connection){
		var change_sql = 'update custom set belong=? where cusId = ?';
		connection.query(change_sql, [userId, cId3], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			res.send(result);
		});
	});
});

// 退出登录
router.get('/tuichu', function(req, res){
	req.session.destroy();
	res.send({flag: 1});
});

// 搜索功能
router.post('/searchNum', function(req, res){
	var classifies = req.body['classify'];
	var txt = req.body['text'];
	var index3 = req.body['index3'];
	if(classifies == 'importance'){
		if(txt == '成交客户'){
			txt = 1;
		}else if(txt == '商机客户'){
			txt = 2;
		}else if(txt == '储蓄客户'){
			txt = 3;
		}
	}
	var cid = 0;
	if(index3 == 0){
		cid = req.session.userID;
	}else if(index3 == 1){
		cid = -1;
	}
	pool.getConnection(function(err, connection){
		var sel_sql = 'select count(*) from custom where belong = ? and '+classifies+' like "%'+txt+'%"';
		connection.query(sel_sql, [cid], function(err, result){
			if(err){
				console.log("Error: " + err.message);
			}
			connection.release();
			res.send(result);
		});
	});
});

module.exports = router;