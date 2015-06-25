var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

//listen on port 8888
app.listen(8888,function(){
	console.log('Server is listening on port 8888');
})

app.use(express.static(path.join(__dirname, './static')));

//body parser
app.use(bodyParser.urlencoded());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//connecting to mongo instance
mongoose.connect('mongodb://localhost/songs');

var songSchema = new mongoose.Schema({
	title: String,
	artist: String,
	album: String,
	genre: String
})

var Song = mongoose.model('Song', songSchema);

app.get('/', function(req, res){
	Song.find({}, function(err, songs){
		if(err){
			console.log('something went wrong');
		}else{
			console.log('retrieved songs successfully');
			res.render('index',{songs: songs});
		}
	})
	
})
app.post('/songs', function(req, res){
	var song = new Song({title: req.body.title, artist: req.body.artist, album: req.body.album, genre: req.body.genre});
	console.log('POST DATA:', req.body);
	song.save(function(err){
		if(err){
			console.log('song not added successfully');
		}else{
			console.log('song added successfully!');
			res.redirect('/');
		}
	})
})
app.get('/songs/new', function(req, res){
	res.render('create');
})

app.get('/songs/:id', function(req, res){
	Song.findOne({_id: req.params.id}, function(err, song){
		res.render('songpage', {song: song});
	})
})
app.get('/songs/:id/edit', function(req, res){
	Song.findOne({_id: req.params.id}, function(err, song){
		res.render('edit', {song: song});
	})
})
app.post('/songs/:id', function(req, res){
	Song.update({_id: req.params.id}, {title: req.body.title, artist: req.body.artist, album: req.body.album, genre: req.body.genre}, function(err, song){
		if(err){
			console.log('error updating song');
		}else{
			console.log('song successfully updated');
			res.redirect('/songs/'+req.params.id);
		}
	})
})

app.get('/songs/:id/destroy', function(req, res){
	Song.remove({_id: req.params.id}, function(err, song){
		if(err){
			console.log('song has not been deleted');
		}else{
			console.log('song deleted successfully');
			res.redirect('/');
		}
	})
})