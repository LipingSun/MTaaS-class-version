
/**
 * Module dependencies.
 */

var express = require('express')
  , home = require('./routes/home')
  , http = require('http')
  , path = require('path')
  , emulator = require('./routes/emulator');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({ secret: 'xDDFsdfddsdfSDdbg', cookie: { maxAge: null }}));	

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
	res.render('login');

});

app.get('/signin', home.afterSignIn);
app.post('/launch',  home.launch);

app.get('/toDashboard',function(req,res){
	res.render('Dashboard');

});

app.get('/request', home.request);
app.get('/usage', home.usage);
app.get('/bill', home.bill);



app.post('/signup', home.afterSignUp);


app.use('/emulator', emulator);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

