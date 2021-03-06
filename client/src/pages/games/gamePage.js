import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'
import SecretAdminPage from '../secret/secretAdminPage'

class GamePage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      user: '',
    }



    this.renderGames = this.renderGames.bind(this)
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
            redirecter: user[0].name === 'secretadmin' ? <Redirect to="/secretAdminPage" component={SecretAdminPage} /> : ''  
          })
        })
      }
  }


  renderGames(){
     fetch('/api/getGames/'+localStorage.getItem('token'))
        .then(res => res.json())
        .then(user => {
          this.setState({
            user: user[0].name,
          })
        })
      }
  }


  render() {
    return (
      <div>
        {this.state.redirecter}
        {this.renderGames()}
      </div>
    );
  }
}

export default TablePage;
