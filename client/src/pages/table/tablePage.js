import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'
import Row from './Row'

class TablePage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      updating: false,
      user: '',
      games: [],
      message: '',
      active: false,
      indicators: '',
    }

    this.renderGames = this.renderGames.bind(this)
    this.generateLoadBar = this.generateLoadBar.bind(this)
    this.setUpdate = this.setUpdate.bind(this)
    this.generateLoadBar = this.generateLoadBar.bind(this)
    this.closeMessage = this.closeMessage.bind(this)
    this.scrollDown = this.scrollDown.bind(this)
    this.getFirstActiveGame = this.getFirstActiveGame.bind(this)
    this.showInfo = this.showInfo.bind(this)
    this.deActivate = this.deActivate.bind(this)

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
          if(user[0]){
             this.setState({
                user: user[0].name,
              })
               fetch('/api/getGames/'+user[0].name)
                .then(res => res.json())
                .then(games => {
                  this.setState({
                    games: games
                  })
                  this.scrollDown()
                })
          }
          else{
            localStorage.removeItem("token")
            this.setState({
              redirecter: <Redirect to="/login" component={LoginPage} />  
            })
          }
        })
      }
  }

 

  renderGames(){
    return this.state.games.map(game => <Row game={game} user={this.state.user} setUpdate={this.setUpdate} />)
  }

   generateLoadBar(){
    return(
      <div className="updating">
        Updating guesses <br/>
        <i class="fas fa-spinner"></i>
      </div>
    )
  }

  closeMessage(){
    this.setState({
        message: ''
    })  
  }

  setUpdate(state, status){
     
     this.setState({
        updating: state
     })  
     if(!state){
        this.setState({
          message: status ? 'Update was succesful' : 'Updating guesses failed, please reload page'
        })
        setTimeout(function(){
             this.setState({message:''});
        }.bind(this),1000);  
     }
  }

  getFirstActiveGame(){
    for(let i = 0; i<this.state.games.length; i++){
      if(this.state.games[i].locked === 0){
        return i
      }
    }
    return 0
  }

  scrollDown(){

    if(document.getElementById("row"+this.state.games[0].hometeam+this.state.games[0].awayteam)){
      const rowHeight = document.getElementById("row"+this.state.games[0].hometeam+this.state.games[0].awayteam).clientHeight
      const index = this.getFirstActiveGame()
      document.getElementById("rowsContainer").scrollBy(0, rowHeight*index)
    }
  }

  showInfo(){
    this.setState({
      active: !this.state.active,
      indicators: 
      <div className="indicatorsInfo">
        <i class="far fa-times-circle fa-times-circle2" onClick={this.deActivate}/>
        <div>
          <div className= "allcorrect indicator2"/>
          <div className="points2"> - 4 Points </div><br/>
          <div className= "verycorrect indicator2"/>
          <div className="points2"> - 2 Points </div><br/>
          <div className= "correct indicator2"/>
          <div className="points2"> - 1 Points </div><br/>
          <div className= "allwrong indicator2"/>
          <div className="points2"> - 0 Points </div><br/>

        </div>
      </div>
    })
  }


  deActivate(){
    this.setState({
      active: false
    })
  }

 


  render() {
    return (
      <div>
        <div className="hinter"> Enter you guesses</div>
        <div className="rowsContainer" id="rowsContainer">
          {this.state.redirecter}
          {this.renderGames()}
          
        </div>
        <span className="guessing">Guessing closes 8am the day of each game</span>
          {this.state.updating && this.generateLoadBar()}
          <div className="updating">
            {this.state.message}
          </div>
      </div>
    );
  }
}

export default TablePage;
