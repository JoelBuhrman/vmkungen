import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'


class SecretAdminPage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      result: ''
    }

    this.updateResults = this.updateResults.bind(this)
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
            redirecter: user[0].name !== 'secretadmin' ? <Redirect to="/login" component={LoginPage} />  : ''
          })
        })
      }
  }

  updateResults(){
    fetch('/api/updateResults')
      .then(res => res.json())
      .then(result => {
        this.setState({
          result: result[0],
        })
      })
  }


  render() {
    return (
      <div>
        {this.state.redirecter}
        Secret Admin Page<br/>
        <button onClick={this.updateResults}>Update user points </button><br/>
        {this.state.result === true && "Update was successful"}
        {this.state.result === false && "Something went wrong"}
      </div>
    );
  }
}

export default SecretAdminPage;
