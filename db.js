var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7240825',
  password: 'i1A6B9LbTx',
  database: 'sql7240825',
  port: '3306'
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
	console.log("doQuery")


	connection.query(sqlnew
		, 
		function(err, results) {
			let sqlnew = mysql.format(results.length === 0 ? syntax3 : syntax2, inserts)
			connection.query(sqlnew, 
				function(err, results) {
					if(game<64){ 
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

	let sql1 = 'SELECT * from Users  WHERE name = ?'
	const inserts1 = [username]
	sql1 = mysql.format(sql1, inserts1)
	console.log(sql1)
	connection.query(sql1
		, 
		function(err, results) {
			if(results.length>0) {
				callback("usernamebusy")
			}
			else{
				let sql = 'INSERT INTO Users  (id, name, password, token ) VALUES (null, ?, ?, ?)'
				const inserts = [username, hashedpassword, token]
				sql = mysql.format(sql, inserts)
				console.log(sql)
				connection.query(sql
					, 
					function(err, results) {
						if(err) {
							callback(false)
						}
						else{
							insertGuesses(username)
							callback(true)
						}
					}

				)	
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
	let sql = 'SELECT name, points, fullpointers, twopointers, onepointers from Users where not name = ? order by points desc'
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
	let oldPoint = 0
	let fullpointers = 0
	let twopointers = 0
	let onepointers = 0
	for(let i = 0; i<results.length; i++){
		if(results[i].home !== null){
			let oneXtwo = results[i].home - results[i].away
		    let realOneXtwo = results[i].homescore - results[i].awayscore
		    if( (oneXtwo*realOneXtwo>0) || (oneXtwo === 0 && realOneXtwo === 0)){
		      points += 1
		      if(results[i].home === results[i].homescore || results[i].away === results[i].awayscore){
		        points += 1
		        if(results[i].home === results[i].homescore && results[i].away === results[i].awayscore){
		          points += 2
		        }
		      }
		    } else{
		      if(results[i].home === results[i].homescore || results[i].away === results[i].awayscore){
		        points += 1
		      }
		    }
		}
		switch(points-oldPoint){
			case 4:
				fullpointers++;
				break;
			case 2:
				twopointers++;
				break;
			case 1:
				onepointers++;
				break;
			default:
				break;
		}
		oldPoint = points
	}
    return [points, fullpointers, twopointers, onepointers]
}

const updateUser = function(name, callback){
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
				let sql2 = 'UPDATE Users set points = ?, fullpointers = ?, twopointers = ?, onepointers = ? WHERE name = ?'
				const inserts2 = [points[0], points[1], points[2], points[3], name]
				sql2 = mysql.format(sql2, inserts2)
				console.log(sql2)
				connection.query(sql2
					, 
					function(err, results) {
						if(err || results.length === 0) {
							return false
						}
						else{
							callback(true)
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
					updateUser(results[i].name, x => success = success ? x : false)
				}
				callback(success)
			}
		}
	)
}

const getLeagues = function(callback){
	let sql = 'SELECT name from Leagues order by users desc'
	const inserts = []
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

const getUsersInLeague = function(league, callback){
	let sql = 'SELECT Users.name, points, fullpointers, twopointers, onepointers from UserLeagues inner join Users on UserLeagues.user = Users.name where not name = ? and league = ? order by points desc'
	const inserts = ['secretadmin', league]
	sql = mysql.format(sql, inserts)
	console.log(sql)

	connection.query(sql
		, 
		function(err, results) {
			if(err) {
				console.log("ERRRORGUL")
				callback(false)
			}
			else{
				callback(results)
			}
		}
	)
}



const createLeague = function(user, league, callback){
	let sql = 'SELECT * from Leagues where name = ?'
	const inserts = [league]
	sql = mysql.format(sql, inserts)
	console.log(sql)

	connection.query(sql
		, 
		function(err, results) {
			if(err) {
				
			}
			else{
				if(!results.length > 0){
					let sql1 = 'Insert into Leagues VALUES (null, ?, 1)'
					const inserts = [league]
					sql1 = mysql.format(sql1, inserts)
					console.log(sql1)

					connection.query(sql1
						, 
						function(err, results) {
							if(err) {
								callback(false)
							}
							else{
								callback(true)
								let sql2 = 'Insert into UserLeagues VALUES (null, ?, ?)'
								const inserts2 = [user, league]
								sql2 = mysql.format(sql2, inserts2)
								console.log(sql2)

								connection.query(sql2
									, 
									function(err2, results2) {
									}
								)
							}
						}
					)
				}
				else{
					callback("League exists")
				}
			}
		}
	)
}


const getCount = function(league){
	let sql1 = 'SELECT count(*) as count from UserLeagues where league = ?'
	const inserts = [league]
	sql1 = mysql.format(sql1, inserts)
	console.log(sql1)

	connection.query(sql1
		, 
		function(err, results) {
			if(err) {
			}
			else{
				increaseCount(league, results[0].count)
			}
		}
	)
}

const increaseCount = function(league, count){
	let sql1 = 'update leagues set users = ? where name = ?'
	const inserts = [count, league]
	sql1 = mysql.format(sql1, inserts)
	console.log(sql1)

	connection.query(sql1
		, 
		function(err, results) {
			
		}
	)
}

const joinLeague = function(user, league, callback){
	let sql1 = 'Insert into UserLeagues VALUES (null, ?, ?)'
	const inserts = [user, league]
	sql1 = mysql.format(sql1, inserts)
	console.log(sql1)

	connection.query(sql1
		, 
		function(err, results) {
			if(err) {
				callback(false)
			}
			else{
				callback(true)
				getCount(league)
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
    getLeagues: getLeagues,
    getUsersInLeague: getUsersInLeague,
    createLeague: createLeague,
    joinLeague: joinLeague,
}
