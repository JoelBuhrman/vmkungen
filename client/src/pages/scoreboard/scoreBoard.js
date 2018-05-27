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
            })
        })	
      }
	}

	renderUsers(){
		return (
			this.state.users.map((user, i) => <User name={user.name} index={i+1} points={user.points} user={this.state.user} /> )
		)
	}

	render() {
	    return (
	      <div className="rowsContainer">
	      	{this.state.redirecter}
	      	{this.renderUsers()}
	      </div>
	    );	
	 }
}

export default ScoreBoard;
