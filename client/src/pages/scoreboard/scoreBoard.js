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
		}

		this.scrollDown = this.scrollDown.bind(this)
		this.getIndex = this.getIndex.bind(this)
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


	scrollDown(){
	    if(document.getElementById("user"+this.state.users[0].name)){
	      const rowHeight = document.getElementById("user"+this.state.users[0].name).clientHeight
	      const index = this.getIndex()

	      document.getElementById("scoreboardContainer").scrollBy(0, rowHeight*index)
	    }
	}

	render() {
	    return (
		    <div>
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
		    </div>
	    );	
	 }
}

export default ScoreBoard;
