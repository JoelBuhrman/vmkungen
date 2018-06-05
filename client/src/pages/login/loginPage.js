import React, { Component } from 'react'
import Register from './register'
import Login from './login'


class LoginPage extends Component {


	constructor(props){
		super(props)

		this.state={
			login: true
		}

		this.setLogin = this.setLogin.bind(this)
	}


	setLogin(mode){
		this.setState({
			login: mode
		})
	}

	render() {
	    return (
	      <div className="signinpage">
	      	{this.state.login && <Login setLogin={this.setLogin}/> }
	      	{!this.state.login && <Register setLogin={this.setLogin}/> }
	      </div>
	    );	
	 }
}

export default LoginPage;
