const express = require('express');
const md5=require('md5');
const cookieParser = require('cookie-parser');
const fs =require('fs');
const uuidv1=require('uuid/v1');
const app = express();
const bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//加载multer模块
const multer = require('multer');
app.use(multer({
	dest: './tmp'//设置临时目录 临时存放上传文件
}).array('images'));//控件名称 name='images'
//去重
app.get('/isSame',function(req,res){
	var conn=require('./src/conn.js');
	var sql="select `username` from `users` where `username`='"+req.query.username+"'";
	conn.query(sql,function(error,result){
		if(result.length==0){
			res.send('true');
		}else{
			res.send('false');
		}
	})
});
//登录
app.post('/login', function (req, res) {
	const conn = require('./src/conn.js');
	var username = req.body.username;
	var password = req.body.password;
	conn.query('select * from `users` where `username`="' + username + '" and `password`="' + md5(password) + '"', function (error, result) {
		if (error) {
			res.json({
				error: 1,
				message: '登陆失败',
				data: null,
				errorInfo: null
			});
		}
		if (result.length == 0) {
			res.json({
				error: 1,
				message: '登陆失败',
				data: null,
				errorInfo: null
			});
		} else {
			res.cookie('username', username);
			res.cookie('auth', result[0].auth);
			res.cookie('userinfo', JSON.stringify(result[0]));
			console.log(error)
			res.json({
				error: 0,
				message: '登陆成功',
				data: null,
				errorInfo: null
			});
		}
	});
});
//注册
app.post('/users/save',function(req,res){
	const conn=require('./src/conn.js');
	var sql = "insert into `users` (`username`,`phone`,`email`,`password`) values ('" + req.body.username + "','" + req.body.phone + "','" + req.body.email + "','" + md5(req.body.password) +"')";
	conn.query(sql,function(error,result){
		if(error==null){
			res.json({
				error:0,
				message:'成功',
				data:result
			})
		}else{
			res.json({
				error: 1,
				message: '失败',
				// data: result
			})
		}
	})
})
//上传文件
app.post('/uploads', function (req, res) {
	//res.send(req.body.filename);
	var file = req.files[0];
	//判断文件是否存在
	if (!file) {
		res.send({
			error: 1,
			message: '请选择上传文件'
		});
	}


	//获取文件后缀名
	extname = file.originalname.split('.').pop();

	//允许后缀名
	var allowExtname = ['jpg', 'png', 'html'];
	//判断后缀名是否合法
	if (allowExtname.indexOf(extname) < 0) {
		res.send({
			error: 0,
			message: '后缀名不合法。允许的后缀名' + allowExtname.join()
		});
		return;
	}
	var size = file.size;//获取文件大小
	var allowsize = 2 * 1024 * 1024;//允许文件大小
	if (size > allowsize) {
		res.send({
			error: 2,
			message: '文件大小不合法，不能超过' + allowsize + '字节'
		})
	}

	//随机生成文件名(文件名不重复)
	//var filename=md5(Date.now()+Math.random())+"."+extname;
	var filename = uuidv1() + '.' + extname;

	fs.rename(__dirname + '/' + req.files[0].path, __dirname + '/public/uploads/' + filename, function (err) {
		if (err) {
			res.send('上传失败');
		} else {
			const conn=require('./src/conn');
			//保存到数据库
			conn.query('updata `users` set `photo`="'+filename+'" where `id`="'+req.body.id+'"',function(err){});
			res.send('上传成功');
			data:filename
		}
	});
});
app.get('/users/show', function (req, res) {
	var conn = require('./src/conn.js');
	var sql = "select `id`,`username`,`phone`,`email` from `users`";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: '成功',
				data: result
			})
		} else {
			res.json({
				error: 1,
				message: '失败',
				data: error
			})
		}
	})
});
//用户管理
app.get('/users/del', function (req, res) {
	var id = req.query.id;
	var conn = require('./src/conn.js');
	var sql = "delete from `users` where `id`='" + id + "'";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: '成功',
				data: result
			})
		} else {
			res.json({
				error: 1,
				message: '失败',
				data: error
			})
		}
	})

});
app.post('/users/add', function (req, res) {
	var username = req.body.username;
	var phone = req.body.phone;
	var email = req.body.email;
	var conn = require('./src/conn.js');
	var sql = "insert into `users` (`username`,`phone`,`email`) values('" + username + "','" + phone + "','" + email + "')";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: '成功',
				data: result
			})
		} else {
			res.json({
				error: 1,
				message: '失败',
				data: error
			})
		}
	})
});
app.get('/users/getUsers', function (req, res) {
	var id = req.query.id;
	var conn = require('./src/conn.js');
	var sql = "select `username`,`phone`,`email` from `users` where `id`='" + id + "'";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: '成功',
				data: result[0]
			})
		} else {
			res.json({
				error: 1,
				message: '失败',
				data: error
			})
		}
	})
});
app.post('/users/editsave', function (req, res) {
	var username = req.body.username;
	var phone = req.body.phone;
	var email = req.body.email;
	var id = req.body.id;
	var conn = require('./src/conn.js');
	var sql = "update `users` set `username`='" + username + "',`phone`='" + phone + "',`email`='" + email + "' where `id`='" + id + "'";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: '成功',
				data: result
			})
		} else {
			res.json({
				error: 1,
				message: '失败',
				data: error
			})
		}
	})
});
//items
app.get("/items",function(req,res){
	const conn=require("./src/conn");
	var sql="select `id`,`item`,`group`,`sort` from `items`";
	conn.query(sql,function(error,result){
		if(error==null){
			res.json({
				error:0,
				message:"成功",
				data:result
			});
		}else{
			res.json({
				error: 1,
				message: "失败",
				data: error
			});
		}
	})
});
app.get("/items/del",function(req,res){
	const conn = require("./src/conn");
	var sql="delete from items where `id`='"+req.query.id+"'";
	conn.query(sql,function(error,result){
		if (error == null) {
			res.json({
				error: 0,
				message: "删除成功",
				data:result
			});
		}else{
			res.json({
				error: 1,
				message: "失败",
				data:error
			});
		}
	})
});
//获取项目分组
app.get("/items/groups",function(req,res){
	const conn = require("./src/conn");
	var sql = "select `id`,`group` from `items` group by `group`";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: "成功",
				data: result
			});
		} else {
			res.json({
				error: 1,
				message: "失败",
				data: error
			});
		}
	})
});
//
app.get("/items/getItems", function (req, res) {
	const conn = require("./src/conn");
	var sql = "select `id`,`group`,`item` from `items` where `group`='"+req.query.group+"'";
	conn.query(sql, function (error, result) {
		if (error == null) {
			res.json({
				error: 0,
				message: "成功",
				data: result
			});
		} else {
			res.json({
				error: 1,
				message: "失败",
				data: error
			});
		}
	})
});
app.get("/outlines",function(req,res){
	const conn = require("./src/conn");
	var sql = "select `id`,`text`,`pid` from `outlines`";
	conn.query(sql, function (error, result) {
		var data =[];
		for(var i=0;i<result.length;i++){
			if(result[i].pid==0){
				result[i].children=[];
				for(var j=0;j<result.length;j++){
					if(result[j].pid == result[i].id){
						result[j].items=[];
						result[i].children.push(result[j]);
					}
				}
				result[i].items = [];
				data.push(result[i]);
			}
		}
		if (error == null) {
			res.json({
				error: 0,
				message: "成功",
				data: data
			});
		} else {
			res.json({
				error: 1,
				message: "失败",
				data: error
			});
		}
	})
});
app.get("/outlines/del", function (req, res) {
	const conn = require("./src/conn");
	//判断是否有子菜单
	conn.query("select `id` from `outlines` where `pid`='"+req.query.id+"'",function(err,re){
		if(re.length==0){
			var sql = "delete from outlines where `id`='" + req.query.id + "'";
			conn.query(sql, function (error, result) {
				if (error == null) {
					res.json({
						error: 0,
						message: "删除成功",
						data: result
					});
				} else {
					res.json({
						error: 1,
						message: "失败",
						data: error
					});
				}
			});
		}else{
			res.json({
				error: 1,
				message: "请先删除子菜单",
			})
		}
	})
	
});
app.listen('80');
