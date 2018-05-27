import React, { Component } from 'react'
import './App.css'
import { Redirect } from 'react-router'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


import TablePage from './pages/table/tablePage'
import LoginPage from './pages/login/loginPage'
import HelpPage from './pages/help/helpPage'
import ScoreBoard from './pages/scoreboard/scoreBoard'
import SecretAdminPage from './pages/secret/secretAdminPage'

import Header from './header'






class App extends Component {


  constructor(props){
    super(props)
  }


  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <div>
              <Header />
              <Switch>
                <Route path="/games" component={TablePage}/>
                <LoginRoute path="/login" component={LoginPage}/>
                <Route path="/scoreboard" component={ScoreBoard}/>  
                <Route path="/help" component={HelpPage}/>  
                <Route path="/secretAdminPage" component={SecretAdminPage}/>  
                <Redirect to= "/login" component={LoginPage}/> 
             </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

const checkAuth = () => {
  const token = localStorage.getItem('token')
  if(!token){
    return false
  }
}


const LoginRoute = (props) => (
  checkAuth() ? 
  <Redirect to= "/table" component={TablePage}/> : 
  <Route path={props.path} component={props.component}/>
)

export default App;
