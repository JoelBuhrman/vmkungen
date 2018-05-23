import React, { Component } from 'react'
import passwordHash from 'password-hash'
import { Redirect } from 'react-router'
import TablePage from '../table/tablePage'

class Register extends Component {


	constructor(props){
		super(props)
		this.state={
			redirecter: ''
		}



		this.register = this.register.bind(this)
		this.refreshPage = this.refreshPage.bind(this)
	}


	refreshPage(){
		this.setState({redirecter: <Redirect to= "/table" component={TablePage}/>})
	}

	register(){
		let username = document.getElementById('register-username').value
		let password = passwordHash.generate(document.getElementById('register-password').value)
		console.log("Register: "+ password)
		fetch('/api/signup/'+username+'/'+password)
	      .then(res => res.json())
	      .then( token => {
	      	if(token[0]){
		      	localStorage.setItem('token', token[0])
		      	this.refreshPage()
		    }
		    else{
		    	alert("Something went wrong")
		    }
	      }) 
	}


	render() {
	    return (
	      <div>
	      	{this.state.redirecter}
	        Register:<br/>
	        <input id="register-username"/><br/>
	        <input id="register-password" type="password"/><br/>
	        <input type="password"/><br/>
	         <button onClick={this.register}>Registrera</button>
	      </div>
	    );	
	 }
}

export default Register;
