import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { Redirect } from 'react-router'
import LoginPage from './pages/login/loginPage'
import TablePage from './pages/table/tablePage'
import ScoreBoard from './pages/scoreboard/scoreBoard'
import HelpPage from './pages/help/helpPage'





class Header extends Component {


  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      open: 'collapsed',
    }

    this.signOut = this.signOut.bind(this)
    this.handleRotation = this.handleRotation.bind(this)
  }

  handleRotation(){
    this.setState({open: this.state.open === "expanded" ? "collapsed" : "expanded"})
    var element = document.getElementById('bars')

    if (element.className.includes("rotation")) {

      element.className = element.className.replace('rotation','normal')
    }
    else if (element.className.includes("normal")) {

      element.className = element.className.replace('normal','rotation')
    }
    else{
      element.className = element.className+ " rotation"
    }
  }

  signOut(){
    localStorage.removeItem("token")
    this.handleRotation()
    this.setState({
      redirecter: <Redirect to={"/"+Math.floor(Math.random() * 1000)} component={LoginPage} />  ,
      open: "collapsed"
    })
  }


  render() {
    return (
      <div>
        <div className="header">
          {this.state.redirecter}
          <div className="logoText">VM</div><i class="fas fa-crown"></i>
          <NavLink className="link" to="/games" >Games</NavLink>
          <NavLink className="link" to="/scoreboard" >ScoreBoard</NavLink>
          <NavLink className="link" to="/help" >Help</NavLink>
          <i id="bars" class="fas fa-bars"  onClick={this.handleRotation}></i>
          {localStorage.getItem('token') && <a className="signout" onClick={this.signOut}>Sign out</a>}
        </div>
        <div className={this.state.open + " collapsable"}>
          <div className="expanditem" onClick={()=>{
              this.setState({open: "collapsed", redirecter: <Redirect to={"games"} component={TablePage} /> })
              this.handleRotation()
            }
          }>
            <div className="expandedlink" >Games</div>
          </div>
          <div className="expanditem" onClick={()=>{
            this.setState({open: "collapsed", redirecter: <Redirect to={"scoreboard"} component={ScoreBoard} />})
            this.handleRotation()
          }
          }>
            <div className="expandedlink"  >ScoreBoard</div>
          </div> 
          <div className="expanditem" onClick={()=>{
            this.setState({open: "collapsed", redirecter: <Redirect to={"help"} component={HelpPage} />})
            this.handleRotation()
          }
          }>
            <div className="expandedlink" >Help</div>
          </div>
          {localStorage.getItem('token') && <div className="expanditem"> <a onClick={this.signOut}>Sign out</a> </div>}
        </div>
      </div>
    );
  }
}


export default Header;
