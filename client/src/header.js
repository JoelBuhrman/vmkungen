import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { Redirect } from 'react-router'
import LoginPage from './pages/login/loginPage'





class Header extends Component {


  constructor(props){
    super(props)
    this.state={
      redirecter: ''
    }

    this.signOut = this.signOut.bind(this)
  }

  signOut(){
    localStorage.removeItem("token")
    this.setState({
      redirecter: <Redirect to={"/"+Math.floor(Math.random() * 1000)} component={LoginPage} />  
    })
  }


  render() {
    return (
        <div className="header">
          {this.state.redirecter}
          <div className="logoText">VM</div><i class="fas fa-crown"></i>
          <NavLink className="link" to="/games" >Games</NavLink>
          <NavLink className="link" to="/scoreboard" >ScoreBoard</NavLink>
          <NavLink className="link" to="/help" >Help</NavLink>
          {localStorage.getItem('token') && <a className="signout" onClick={this.signOut}>Sign out</a>}
        </div>
    );
  }
}


export default Header;
