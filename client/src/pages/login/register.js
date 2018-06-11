import React, { Component } from 'react'
import passwordHash from 'password-hash'
import { Redirect } from 'react-router'
import TablePage from '../table/tablePage'

class Register extends Component {


	constructor(props){
		super(props)
		this.state={
			redirecter: '',
			loading: false,
		}



		this.register = this.register.bind(this)
		this.refreshPage = this.refreshPage.bind(this)
	}


	refreshPage(){
		this.setState({loading: true})
		 setTimeout(function(){
	             this.setState({redirecter: <Redirect to= "/table" component={TablePage}/>})
	        }.bind(this),7000);  
		
	}

	register(){
		let username = document.getElementById('register-username').value
		let password = passwordHash.generate(document.getElementById('register-password').value)

		let password1 = document.getElementById('register-password').value
		let password2 = document.getElementById('register-password2').value

		if(username.length < 3){
			this.setState({
				message: "Username must be at least three characters",
			})
			 setTimeout(function(){
	             this.setState({message:''});
	        }.bind(this),3000);  
		} 
		else if(password1.length < 6){
			this.setState({
				message: "Password must be at least six characters",
			})
			 setTimeout(function(){
	             this.setState({message:''});
	        }.bind(this),3000);  
		}
		else if(username.length>15){
			this.setState({
				message: "Username can only be 15 characters long",
			})
			 setTimeout(function(){
	             this.setState({message:''});
	        }.bind(this),3000);  
		}
		else{
			if(password1 === password2){

			fetch('/api/signup/'+username+'/'+password)
		      .then(res => res.json())
		      .then( token => {
		      	if(token[0] == "usernamebusy"){
		      		this.setState({
		      			message: "Someone is already using this username, select another one"
		      		})
		      	}
		      	else if(token[0]){
			      	localStorage.setItem('token', token[0])
			      	this.refreshPage()
			    }
			    else{
			    	this.setState({
			    		message: "Something went wrong"
			    	})
			    }
		      }) 
			}
			else{
				
				this.setState({
					message: "Passwords doesn't match",
				})
				 setTimeout(function(){
		             this.setState({message:''});
		        }.bind(this),3000);  
			}
		}
	}

	renderRegister(){
		return (
			<div>
				Register:<br/>
			        <div className="inputtext2">Username:</div> <input className="logininput" id="register-username"/><br/>
			       	<div className="inputtext2"> Password:</div> <input className="logininput" id="register-password" type="password"/><br/>
			       	<div className="inputtext2"> Repeat password:</div> <input className="logininput" id="register-password2" type="password"/><br/>
			        <div className="loginbutton2" onClick={this.register}>Register</div>
			        <div className="smalltext or2">or</div>
			        <div className="smalltext register2" onClick={()=>this.props.setLogin(true)}>Back to Login</div>
			        <div className="errormessage3">
			        	{this.state.message}
			        </div>
			</div>
		)
	}

	renderLoadBar(){
		return(
			<div className="loadingContainer">
				Collecting info about the games <br/>
      			  <i class="fas fa-spinner"></i>
			</div>
		)
	}


	render() {
	    return (

	      <div>
	      {this.state.loading && this.renderLoadBar()}
	      {!this.state.loading && this.renderRegister()}
	      {this.state.redirecter}

	      </div>
	  
	    );	
	 }
}

export default Register;
