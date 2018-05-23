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

const doQuery = function(game, syntax, username){
	let inserts = [game, username]
	let sqlnew = mysql.format(syntax, inserts)
	console.log(sqlnew)
	connection.query(sqlnew, 
	function(err, results) {
		if(game<15){
			doQuery(game+1, syntax, username)
		}
	})
}

const insertGuesses = function(username){
	let syntax = 'INSERT INTO Guesses  (id, game, user, home, away ) VALUES (null, ?, ?, null, null)'

	

	doQuery(1, syntax, username)
	
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


module.exports = {
    connect: connect,  
    getHash: getHash,
    createUser: createUser,
    getUserWithToken: getUserWithToken,
    generateToken: generateToken,
}
