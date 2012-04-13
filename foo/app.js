/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')

var mongo = require('mongoskin'),
db = mongo.db('localhost:27017/test');


var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Routes
app.post('/create', function(req, res){
  console.log(req.body);
  var t = {name:req.body.name, date:req.body.date, status:"P"};
  db.collection('tasks').insert(t,  function(err, data) {
	  res.redirect('/');
      });
});

app.post('/done', function(req, res){
  console.log(req.body);
  db.collection('tasks').update({_id:db.toId(req.body.index)}, {$set: {status:"D"}}, function(err, data){
	    res.redirect('/');
      });
});

app.post('/delete', function(req, res){
  console.log(req.body);
  db.collection('tasks').remove({_id:db.toId(req.body.index)}, function(err, data){
	    res.redirect('/');
      });
});

app.get('/',  function(req, res){
   db.collection('tasks').find({status:"P"}).toArray(function(err, pendings){
	   db.collection('tasks').find({status:"D"}).toArray(function(err, dones){
		    res.render('index', { title: 'TODO List', pendings: pendings, dones: dones});
	       });
       });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

