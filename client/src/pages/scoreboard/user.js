import React, { Component } from 'react'
import UserInfo from './userInfo'



class User extends Component {


	constructor(props){
		super(props)
		this.state={
			active: false,
		}


		this.showUser = this.showUser.bind(this)
		this.deActivate = this.deActivate.bind(this)
	}


	showUser(){
		this.setState({
			active: true,
		})
	}

	deActivate(){
		setTimeout(function(){
             this.setState({active:false});
        }.bind(this),10)

	}

	

	render() {
	    return (
	      <div className={"user " + (this.props.name === this.props.user ? "currentUser" : "")} onClick={this.showUser}>
	      	<div className="position">
	      		{this.props.index}.
	      	</div>
     			
     		<div className="name">
	      		{this.props.name}
	      	</div>

			<div className="points">
	      		{this.props.points}
	      	</div>

	      	<UserInfo id={"userinfo"+this.props.name} active={this.state.active} name={this.props.name} deActivate={this.deActivate}/>
	      	
	      </div>
	    );	
	 }
}

export default User;
