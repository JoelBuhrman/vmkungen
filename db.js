var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'VM'
})


const connect = function(req, res){
	connection.connect(function(err) {
	  if (err) throw err
	  console.log('You are now connected...')
	  })
}




const getHash = function(username, callback){
	let sql = 'SELECT password from Users where name = ?'
	const inserts = [username]
	sql = mysql.format(sql, inserts)
	console.log(sql)
	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				callback(false)
			}
			else{
				callback(results)
			}
		}

	)
}

const doQuery = function(game, syntax1, syntax2, syntax3, username){
	let inserts = [game]
	let sqlnew = mysql.format(syntax1, inserts)
	console.log(sqlnew)
	inserts = [game, username]

	connection.query(sqlnew
		, 
		function(err, results) {
			let sqlnew = mysql.format(results.length === 0 ? syntax3 : syntax2, inserts)
			connection.query(sqlnew, 
				function(err, results) {
					if(game<15){
						doQuery(game+1, syntax1, syntax2, syntax3, username)
					}	
				}
			)
		}

	)
}

const insertGuesses = function(username){



	let syntax1 = 'SELECT * from Games WHERE id = ? and locked = 0'
	let syntax2 = 'INSERT INTO Guesses (id, game, user, home, away ) VALUES (null, ?, ?, 0, 0)'
	let syntax3 = 'INSERT INTO Guesses (id, game, user, home, away ) VALUES (null, ?, ?, null, null)'

	

	doQuery(1, syntax1, syntax2, syntax3, username)
	
}

const createUser = function(username, hashedpassword, token, callback){
	let sql = 'INSERT INTO Users  (id, name, password, token ) VALUES (null, ?, ?, ?)'
	const inserts = [username, hashedpassword, token]
	sql = mysql.format(sql, inserts);
	console.log(sql)
	connection.query(sql
		, 
		function(err, results) {
			if(err) {
				callback(false)
			}
			else{
				callback(true)
				insertGuesses(username)
			}
		}

	)
}


const getUserWithToken = function(token, callback){
	let sql = 'SELECT * from Users where token = ?'
	const inserts = [token]
	sql = mysql.format(sql, inserts)
	console.log(sql)
	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				callback(false)
			}
			else{
				console.log(results)
				callback(results)
			}
		}

	)
}


const generateToken = function(userName, token, callback){
	let sql = 'UPDATE Users Set token = ? WHERE name = ?'
	const inserts = [token, userName]
	sql = mysql.format(sql, inserts)
	console.log(sql)
	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				callback(false)
			}
			else{
				callback(true)
			}
		}

	)
}


const getGames = function(userName, callback){
	let sql = 'SELECT Games.home as hometeam, Games.away as awayteam, Guesses.away, Guesses.home, Games.awayscore, Games.homescore, Games.active, Games.locked FROM Guesses INNER JOIN Games ON Guesses.game=Games.id WHERE Guesses.user = ?'
	const inserts = [userName]
	sql = mysql.format(sql, inserts)
	console.log(sql)
	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				callback(false)
			}
			else{
				callback(results)
			}
		}

	)
}

module.exports = {
    connect: connect,  
    getHash: getHash,
    createUser: createUser,
    getUserWithToken: getUserWithToken,
    generateToken: generateToken,
    getGames: getGames,
}
