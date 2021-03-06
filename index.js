const express = require('express');
const path = require('path');
const app = express();


var mysql = require('mysql')
var db = require('./db')
var token = require('./tokens')
db.connect()



app.get('/api/getHash/:username', (req, res) =>{
    db.getHash(req.params.username, result => result ? res.send(result) : res.send([false]))
});

app.get('/api/signup/:username/:hashedpassword', (req, res) =>{
    const t = token.generateToken()
    db.createUser(req.params.username, req.params.hashedpassword, t, result => result === true ? res.send([t]) : res.send([result]))
});


app.get('/api/checkToken/:token', (req, res) =>{
    db.getUserWithToken(req.params.token, result => result ? res.send(result) : res.send([false]))
});


app.get('/api/generateToken/:username', (req, res) =>{
	const t = token.generateToken()
    db.generateToken(req.params.username, t, result => result ? res.send([t]) : res.send([false]))
});

app.get('/api/getGames/:username', (req, res) =>{
    db.getGames(req.params.username, result => result ? res.send(result) : res.send([false]))
});


app.get('/api/updateGuesses/:username/:id/:homeTeam/:awayTeam', (req, res) =>{
    db.updateGuesses(req.params.username, req.params.id, req.params.homeTeam, req.params.awayTeam, result => result ? res.send([result]) : res.send([false]))
});


app.get('/api/getUsers', (req, res) =>{
    db.getUsers(result => result ? res.send([result]) : res.send([false]))
});


app.get('/api/updateResults', (req, res) =>{
    db.updateResults(result => result ? res.send([result]) : res.send([false]))
});

app.get('/api/getLeagues', (req, res) =>{
    db.getLeagues(result => result ? res.send([result]) : res.send([false]))
});

app.get('/api/getUsersInLeague/:league', (req, res) =>{
    db.getUsersInLeague(req.params.league, result => result ? res.send([result]) : res.send([false]))
});

app.get('/api/createLeague/:user/:league', (req, res) =>{
    db.createLeague(req.params.user, req.params.league, result => result ? res.send([result]) : res.send([false]))
});

app.get('/api/joinLeague/:user/:league', (req, res) =>{
    db.joinLeague(req.params.user, req.params.league, result => result ? res.send([result]) : res.send([false]))
});







app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`VM kungen server is running on port ${port}`);