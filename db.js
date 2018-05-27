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
	let sql = 'SELECT Games.id as id, Games.home as hometeam, Games.away as awayteam, Guesses.away, Guesses.home, Games.awayscore, Games.homescore, Games.active, Games.locked FROM Guesses INNER JOIN Games ON Guesses.game=Games.id WHERE Guesses.user = ?'
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

const updateGuesses = function(username, id, hometeam, awayteam, callback){
	let sql = 'UPDATE Guesses SET home = ?, away = ? WHERE game = ? and user = ?'
	const inserts = [hometeam, awayteam, id, username]
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

const getUsers = function(callback){
	let sql = 'SELECT name, points from Users where not name = ? order by points desc'
	const inserts = ['secretadmin']
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

const calculatePoints = function(results){
	let points = 0
	console.log(results)
	let oldPoint = 0
	for(let i = 0; i<results.length; i++){
		if(results[i].home){
			oldPoint = points
			let oneXtwo = results[i].home - results[i].away
		    let realOneXtwo = results[i].homescore - results[i].awayscore
		    if(oneXtwo*realOneXtwo>0 || (oneXtwo === 0 && realOneXtwo === 0)){
		      points += 1
		      if(results[i].home === results[i].homescore || results[i].away === results[i].awayscore){
		        points += 1
		        if(results[i].home === results[i].homescore && results[i].away === results[i].awayscore){
		          points += 2
		        }
		      }
		    }
		    else{
		      if(results[i].home === results[i].homescore || results[i].away === results[i].awayscore){
		        points += 1
		      }
		    }
		}
		console.log(results[i].home+" - "+results[i].away, points-oldPoint, points)
	}
    
    return points
}

const updateUser = function(name){
	let sql = 'SELECT Guesses.away, Guesses.home, Games.awayscore, Games.homescore FROM Guesses INNER JOIN Games ON Guesses.game=Games.id WHERE Guesses.user = ? and Games.locked = 1'
	const inserts = [name]
	sql = mysql.format(sql, inserts)
	console.log(sql)

	let points = 0
	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				return false
			}
			else{
				points = calculatePoints(results)
				let sql2 = 'UPDATE Users set points = ? WHERE name = ?'
				const inserts2 = [points, name]
				sql2 = mysql.format(sql2, inserts2)
				console.log(sql2)
				connection.query(sql2
					, 
					function(err, results) {
						if(err || results.length === 0) {
							return false
						}
						else{
							return true
						}
					}
				)
			}
		}
	)
}

const updateResults = function(callback){
	let sql = 'SELECT name from Users where not name = ?'
	const inserts = ['secretadmin']
	sql = mysql.format(sql, inserts)
	console.log(sql)
	let success = true


	connection.query(sql
		, 
		function(err, results) {
			if(err || results.length === 0) {
				callback(false)
			}
			else{
				for(let i = 0; i<results.length; i++){
					updateUser(results[i].name)
				}
				callback(success)
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
    updateGuesses: updateGuesses,
    getUsers: getUsers,
    updateResults: updateResults,
}
