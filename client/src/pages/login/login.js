import React, { Component } from 'react'
import passwordHash from 'password-hash'
import { Redirect } from 'react-router'
import TablePage from '../table/tablePage'


class Login extends Component {


	constructor(props){
		super(props)
		this.state={
			redirecter: '',
			message: ''
		}


		this.login = this.login.bind(this)
		this.refreshPage = this.refreshPage.bind(this)
	}


	componentWillMount(){
		if(localStorage.getItem('token')){
			this.setState({
				redirecter: <Redirect to= "/games" component={TablePage}/>
			})
			
		}
	}

	refreshPage(){
		this.setState({redirecter: <Redirect to= "/games" component={TablePage}/>})
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
	      		this.setState({
				message: "Incorrect username or password",
				})
				 setTimeout(function(){
		             this.setState({message:''});
		        }.bind(this),3000);  
	      	}
	      })
	}


	render() {
	    return (
	      <div>
	      	{this.state.redirecter}
	        Sign in:<br/>
	        <div className="inputtext">Username:</div> <input className="logininput" id="username"/><br/>
	       	<div className="inputtext"> Password:</div> <input className="logininput"id="password" type="password"/><br/>
	        <div className="loginbutton"onClick={this.login}>Sign in</div>
	        <div className="smalltext or">or</div>
	        <div className="smalltext register" onClick={()=>this.props.setLogin(false)}>register</div>
	        <div className="errormessage">
	        	{this.state.message}
	        </div>
	      </div>
	    );	
	 }
}

export default Login;
