import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'
import User from './user'


class ScoreBoard extends Component {


	constructor(props){
		super(props)
		this.state={
			redirecter: '',
			users: [],
			user: '',
			leagues: [],
			createLeague: false,
			errormessage: "",
			inLeague: true,
			inputClicked: false,
		}

		this.scrollDown = this.scrollDown.bind(this)
		this.getIndex = this.getIndex.bind(this)
		this.renderUsers = this.renderUsers.bind(this)
		this.renderLeagues = this.renderLeagues.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
		this.createLeague = this.createLeague.bind(this)
		this.renderInput = this.renderInput.bind(this)
		this.notInLeague = this.notInLeague.bind(this)
		this.joinLeague = this.joinLeague.bind(this)
		this.handleInputClick = this.handleInputClick.bind(this)
	}

	componentWillMount(){
		 if(!localStorage.getItem('token')){
          this.setState({
            redirecter: <Redirect to="/login" component={LoginPage} />  
          })
      }
      else{
      	fetch('/api/checkToken/'+localStorage.getItem('token'))
        .then(res => res.json())
        .then(user => {
          this.setState({
            user: user[0].name,
          })
          fetch('/api/getUsers')
            .then(res => res.json())
            .then(users => {
              this.setState({
                users: users[0]
              })
              this.scrollDown()
            })
        })	
      	fetch('/api/getLeagues')
            .then(res => res.json())
            .then(leagues => {
            	if(leagues[0]){
            	  this.setState({
	                leagues: leagues[0]
	              })
            	}
            })
      }
	}



	renderUsers(){
		return (
			this.state.users.map((user, i) => <User name={user.name} index={i+1} points={user.points} user={this.state.user} fullpointers={user.fullpointers} twopointers={user.twopointers} onepointers={user.onepointers}/> )
		)
	}

	getIndex(){
	    for(let i = 0; i<this.state.users.length; i++){
	      if(this.state.users[i].name === this.state.user){
	        return i
	      }
	    }
	    return 0
	 }

	 handleSelect(league){
	 	let value
	 	if(league!==null){
	 		value = league
	 	}
	 	else{
	 		value = document.getElementById("leagueSelecter").value
	 	}
	 	if(value === "All users" || !value){
	 		fetch('/api/getUsers')
            .then(res => res.json())
            .then(users => {
              this.setState({
                users: users[0],
                inLeague: true,
              })
              this.scrollDown()
            })
	 	}
	 	else{
	 		fetch('/api/getUsersInLeague/'+value)
            .then(res => res.json())
            .then(users => {
              this.setState({
                users: users[0]
              })
              document.getElementById("leagueSelecter").value = value
              this.scrollDown()
              this.notInLeague()
            })
	 	}
	 
	 }


	scrollDown(){
	    if(this.state.users.length>0 && document.getElementById("user"+this.state.users[0].name)){
	      const rowHeight = document.getElementById("user"+this.state.users[0].name).clientHeight
	      const index = this.getIndex()

	      document.getElementById("scoreboardContainer").scrollBy(0, rowHeight*index)
	    }
	}

	createLeague(){
		let league = document.getElementById("leagueinput").value
		if(league.length>0){
			fetch('/api/createLeague/'+this.state.user + "/"+league)
	            .then(res => res.json())
	            .then(users => {
	            	if(users[0] === true){
	            		this.setState({
	            			leagues: [{name: league}, ...this.state.leagues],
	            			createLeague: false
	            		})
	            		
	            		this.handleSelect(league)
	            	}
	            	else if(users[0] === "League exists"){
	            		this.setState({
				    		errormessage: 'This league already exists',
				    		inputClicked: true,
				    		createLeague: true,
				    	})
				    	setTimeout(function(){
					             this.setState({
					             	inputClicked: false
					             });
					        }.bind(this),100);  
				    	setTimeout(function(){
					             this.setState({
					             	errormessage:'',
					             });
					        }.bind(this),3000);  
	            	}
	            })
	    }
	    else{
	    	this.setState({
	    		errormessage: 'Input field is empty',
	    		inputClicked: true, 
	    		createLeague: true
	    	})
	    	setTimeout(function(){
					             this.setState({
					             	inputClicked: false
					             });
					        }.bind(this),1000);  
	    	setTimeout(function(){
		             this.setState({errormessage:''});
		        }.bind(this),3000);  
	    }
	}

	renderLeagues(){
		return(
			<select id="leagueSelecter" onChange={()=>this.handleSelect(null)}>
				  <option value="" disabled selected>Select league</option>
				  <option value="All users" >All users</option>				  
				  {this.state.leagues.map(league => <option key={league.name} value={league.name}>{league.name}</option>)}
			</select>
		)
	}

	handleInputClick(){
		this.setState({
			inputClicked: true
		})
		setTimeout(function(){
             this.setState({
             	inputClicked: false
             });
        }.bind(this),500); 
	}

	renderInput(){
		return(
			<div className="darkbackground" onClick={()=> setTimeout(function(){this.setState({createLeague: this.state.inputClicked ? true : false})}.bind(this),100)}>
				<input id="leagueinput" className="leagueinput" onClick={this.handleInputClick} placeholder="Enter league name"/>
				<span className="createbutton" onClick={this.createLeague}>Create</span>
				<span className="errormessage">{this.state.errormessage}</span>
			</div>
		)
	}

	notInLeague(){
		let il = false
		for(let i = 0; i<this.state.users.length; i++){
			if(this.state.users[i].name === this.state.user){
				il = true
			}
		}
		this.setState({
			inLeague: il
		})
	}

	joinLeague(){
		let league = document.getElementById("leagueSelecter").value
		if(league.length>0){
			fetch('/api/joinLeague/'+this.state.user + "/"+league)
	            .then(res => res.json())
	            .then(users => {
	            	if(users[0]){
	            		this.setState({
	            			inLeague: true,
	            		})
	            		fetch('/api/getUsersInLeague/'+league)
			            .then(res => res.json())
			            .then(users => {
			              this.setState({
			                users: users[0]
			              })
			              this.scrollDown()
			            })
	            	}
	            })
	    }
	}

	render() {
	    return (
		    <div>
		      {this.state.createLeague && this.renderInput()}
		      <div className="scoreboardheader">
		      <div className="scoreboardheader-name">
		      	username
		      </div>
		      <div className="scoreboardheader-pointer">
		      	full pointers
		      </div>
		      <div className="scoreboardheader-pointer">
		      	2p
		      </div>
		      <div className="scoreboardheader-pointer scoreboardheader-rightmargin">
		      	1p
		      </div>
		      <div className="scoreboardheader-points">
		      	+ / -
		      </div>
		      </div>
		      <div id="scoreboardContainer"className="rowsContainer">
		      	{this.state.redirecter}
		      	{this.renderUsers()}
		      </div>
		      {this.renderLeagues()}
		      {!this.state.inLeague &&
				<span className="join" onClick={()=>{
					this.setState({inLeague: true})
					this.joinLeague()
				}}>
			  	Join League
			  </span>
		      }
			  <span className="create" onClick={()=>this.setState({createLeague: true})}>
			  	Create League +
			  </span>
		    </div>
	    );	
	 }
}

export default ScoreBoard;
