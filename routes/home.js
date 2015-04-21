var ejs = require("ejs");
var mysql = require('./mysql');
var connpool=require('./dbConnection/sqlConn');
var query=require('./dbConnection/sqlQuery');


function afterSignIn(req,res)
{
   var sqlStr="select * from user where username=? and password=?";
	console.log("Query is:"+sqlStr);
	
	var params = [req.param('username'), req.param('password')];
	console.log(req.param('username')+req.param('password'));
	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {
			//var firstname;
			//var lastname;
			if(rows[0].user_type==0){
				
				res.json({usermode: 'normal'});
				
			}else{
				res.json({usermode: 'admin'});
			}
			console.log("rows: "+rows[0].username);
			req.session.user_id =rows[0].id;
			req.session.username =rows[0].username;
			
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no such user");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
}

function launch(req,res)
{
	var mobile=req.param('mobile');
	var sqlStr="Insert into request (`user_id`, `version`, `cpu`, `ram`, `disk`,`number`) VALUES (?,?,?,?,?,?)";
	console.log("Query is:"+sqlStr);
	
	var params = [req.session.user_id,mobile.version,mobile.cpu,mobile.ram,mobile.disk,mobile.number];

	query.execQuery(sqlStr, params, function(err, rows) {
		if(err){
			//res.send({'errorMessage': "Please enster a valid email and password"});
			console.log("ERROR: " + err.message);
			//res.render({errorMessage: 'Sign Up Fail!'});
			
		}else{
			for (i=0;i<mobile.number;i++){
				var sqlStr="Insert into runingRequest (`user_id`, `version`, `cpu`, `ram`, `disk`,`start_time`) VALUES (?,?,?,?,?,?)";
				console.log("Query is:"+sqlStr);
				
				var params = [req.session.user_id,mobile.version,mobile.cpu,mobile.ram,mobile.disk,new Date()];
				query.execQuery(sqlStr, params, function(err, rows) {
					if(err){
						//res.send({'errorMessage': "Please enster a valid email and password"});
						console.log("ERROR: " + err.message);
						//res.render({errorMessage: 'Sign Up Fail!'});
						
					}else{
						console.log((i+1)+"mobile lanuched");
					}
				});
			}
			res.json({"launchStatus": ' Success'});
		}
	});

}

function request(req,res){
	var sqlStr="select runingrequest.id, username, version, cpu, ram,disk start_time, ip_port from user, runingrequest where user.id=runingrequest.user_id";
	console.log("Query is:"+sqlStr);
	
	var params = [];
	query.execQuery(sqlStr, params, function(err, rows) {
		
		console.log(rows.length);
		if(rows.length !== 0) {		
				
				res.json({'requests': rows});
			
		}else{
			//res.send({'errorMessage': "Please enter a valid email and password"});
			console.log("no requests");
			//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
		}
	});
	
}

function usage(req,res){
	
	var sqlStr="update runingrequest set end_time=? where status='run'";
	
	var params = [new Date()];
	query.execQuery(sqlStr, params, function(err, rows) {
		if(err){
			//res.send({'errorMessage': "Please enster a valid email and password"});
			console.log("ERROR: " + err.message);
			//res.render({errorMessage: 'Sign Up Fail!'});
			
		}else{
			console.log("end time updated");
			var sqlStr="update runingrequest t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time)";
			
			var params = [];
			query.execQuery(sqlStr, params, function(err, rows) {
				if(err){
					//res.send({'errorMessage': "Please enster a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					var sqlStr="SELECT u.username, count(r.ram) as number, sum(r.ram) as totalram, sum(r.disk) as totaldisk,sum(TIMESTAMPDIFF(MINUTE,r.start_time,r.end_time)) as runtime,sum(r.cost) as totalcost from user u left join runingrequest r on u.id=r.user_id group by u.username";
					console.log("Query is:"+sqlStr);
					
					var params = [];
					query.execQuery(sqlStr, params, function(err, rows) {
						
						console.log(rows.length);
						if(rows.length !== 0) {		
								
								res.json({'usage': rows});
							
						}else{
							//res.send({'errorMessage': "Please enter a valid email and password"});
							console.log("no usages");
							//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
						}
					});
				}
			});
		}
			
	});

}


function bill(req,res){
	
	var sqlStr="update runingrequest set end_time=? where status=? and user_id=?";
	
	var params = [new Date(),'run',req.session.user_id];
	query.execQuery(sqlStr, params, function(err, rows) {
		if(err){
			//res.send({'errorMessage': "Please enster a valid email and password"});
			console.log("ERROR: " + err.message);
			//res.render({errorMessage: 'Sign Up Fail!'});
			
		}else{
			console.log("end time updated");
			var sqlStr="update runingrequest t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";
			
			var params = [req.session.user_id];
			query.execQuery(sqlStr, params, function(err, rows) {
				if(err){
					//res.send({'errorMessage': "Please enster a valid email and password"});
					console.log("ERROR: " + err.message);
					//res.render({errorMessage: 'Sign Up Fail!'});
					
				}else{
					var sqlStr="SELECT id, version,cpu,ram,disk,TIMESTAMPDIFF(MINUTE,start_time,end_time) as runtime,cost,status from runingrequest where user_id=?";
					console.log("Query is:"+sqlStr);
					
					var params = [req.session.user_id];
					query.execQuery(sqlStr, params, function(err, rows) {
						
						console.log(rows.length);
						if(rows.length !== 0) {		
							var sqlStr="SELECT sum(cost) as totalcost from runingrequest where user_id=?";
							console.log("Query is:"+sqlStr);
							var bills=rows;
							var params = [req.session.user_id];
							query.execQuery(sqlStr, params, function(err, rows) {
								
								console.log(rows.length);
								if(rows.length !== 0) {		
										
										res.json({'bills': bills,'totalcost':rows[0].totalcost});
									
								}else{
									//res.send({'errorMessage': "Please enter a valid email and password"});
									console.log("no bills");
									//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
								}
							});
							
						}else{
							//res.send({'errorMessage': "Please enter a valid email and password"});
							console.log("no bills");
							//res.render('signin', {errorMessage: 'Please enter a valid email and password'});
						}
					});
				}
			});
		}
			
	});

}

function afterSignUp(req,res)
{
	var user=req.param('account');
	for (p in user)
		console.log(user[p]);
	var sqlStr="Insert into user (`user_type`, `username`,`password`, `first_name`, `last_name`, `email`) VALUES (?,?,?,?,?,?)";
	console.log("Query is:"+sqlStr);		
	
	params=[0,user.username,user.password,user.firstname,user.lastname,user.email];
	query.execQuery(sqlStr, params, function(err, rows) {
		if(err){
			//res.send({'errorMessage': "Please enster a valid email and password"});
			console.log("ERROR: " + err.message);
			//res.render({errorMessage: 'Sign Up Fail!'});
			
		}else{
			res.json({'signup': 'Success'});

		}
	});

}



exports.afterSignIn=afterSignIn;
exports.launch=launch;
exports.request=request;
exports.afterSignUp=afterSignUp;
exports.usage=usage;
exports.bill=bill;
