import React, { Component } from 'react'
import passwordHash from 'password-hash'
import { Redirect } from 'react-router'
import TablePage from '../table/tablePage'


class Login extends Component {


	constructor(props){
		super(props)
		this.state={
			redirecter: ''
		}


		this.login = this.login.bind(this)
		this.refreshPage = this.refreshPage.bind(this)
	}


	componentWillMount(){
		if(localStorage.getItem('token')){
			this.setState({
				redirecter: <Redirect to= "/table" component={TablePage}/>
			})
			
		}
	}

	refreshPage(){
		this.setState({redirecter: <Redirect to= "/table" component={TablePage}/>})
	}


	login(){
		let username = document.getElementById('username').value
		let password =document.getElementById('password').value
		fetch('/api/getHash/'+username)
	      .then(res => res.json())
	      .then(hash => {
	      	if(passwordHash.verify(password, hash[0].password)){
	      		fetch('/api/generateToken/'+username)
		      		.then(res => res.json())
		     		.then(token => {
		     			localStorage.setItem('token', token[0])
	     			 	this.refreshPage()
		     		})
	      	}
	      	else{
	      		alert("Incorrect name or password")
	      	}
	      })
	}


	render() {
	    return (
	      <div>
	      	{this.state.redirecter}
	        Logga in:<br/>
	        <input id="username"/><br/>
	        <input id="password" type="password"/><br/>
	        <button onClick={this.login}>Logga in</button>
	      </div>
	    );	
	 }
}

export default Login;
