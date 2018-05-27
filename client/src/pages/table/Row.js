import React, { Component } from 'react'
import {getFlag} from '../../flags'


class Row extends Component {

  constructor(props){
    super(props)

    this.state={
      updating: false
    }


    this.generateLockedGame = this.generateLockedGame.bind(this)
    this.generateActiveGame = this.generateActiveGame.bind(this)
    this.generatNonActiveGame = this.generatNonActiveGame.bind(this)
    this.generatePassedGame = this.generatePassedGame.bind(this)
    this.getType = this.getType.bind(this)
    this.updateGuesses = this.updateGuesses.bind(this)
    this.generateOtherUserGames = this.generateOtherUserGames.bind(this)

  }


  getType(){
    let type = "allwrong"
    let oneXtwo = this.props.game.home - this.props.game.away
    let realOneXtwo = this.props.game.homescore - this.props.game.awayscore
    if(oneXtwo*realOneXtwo>0 || (oneXtwo === 0 && realOneXtwo === 0)){
      type = "correct"
      if(this.props.game.home === this.props.game.homescore || this.props.game.away === this.props.game.awayscore){
        type = "verycorrect"
        if(this.props.game.home === this.props.game.homescore && this.props.game.away === this.props.game.awayscore){
          type = "allcorrect"
        }
      }
    }
    else{
      if(this.props.game.home === this.props.game.homescore || this.props.game.away === this.props.game.awayscore){
        type = "wrong"
      }
    }

    return type

  }


  generateLockedGame(){
    const type = this.getType()


    return (

       <div className={type + " row" } id={"row"+this.props.game.hometeam+this.props.game.awayteam}>
          <img className="flag" src={getFlag(this.props.game.hometeam)}/>
          <div className="leftTeam">
         
           {this.props.game.hometeam}

          </div>
          <div className="middle">
           {this.props.game.home}
           -
            {this.props.game.away}
          </div>
          <div className="rightTeam">
           {this.props.game.awayteam}
          </div>
           <img className="flag" src={getFlag(this.props.game.awayteam)}/>
           <br/>
          <div className="actualResult">
            Actual result: <br/>
           {this.props.game.homescore} - {this.props.game.awayscore}
          </div>
      </div>
     
    )
  }



  generateActiveGame(){
    return (
       <div className="active row" id={"row"+this.props.game.hometeam+this.props.game.awayteam}>
          <img className="flag" src={getFlag(this.props.game.hometeam)}/>
          <div className="leftTeam">
         
           {this.props.game.hometeam}

          </div>
          <div className="middle">
            <input 
              id={"input"+this.props.game.hometeam} 
              type="number" 
              min="0" 
              step="1" 
              placeholder={this.props.game.home ? this.props.game.home : 0}
              onInput={this.updateGuesses}/>
           -
            <input 
              id={"input"+this.props.game.awayteam} 
              type="number" 
              min="0" 
              step="1" 
              placeholder={this.props.game.away ? this.props.game.away : 0}
              onInput={this.updateGuesses}/>
     
          </div>
          <div className="rightTeam">
           {this.props.game.awayteam}
          </div>
           <img className="flag" src={getFlag(this.props.game.awayteam)}/>
           <br/>
            <div className="actualResult">
            Guessing closes <br/>
           10 AM the day of the match
          </div>
      </div>
    )   
  }

    generatNonActiveGame(){
      return(

      <div className="nonactive row" id={"row"+this.props.game.hometeam+this.props.game.awayteam}>
          <img className="flag" src={getFlag(this.props.game.hometeam)}/>
          <div className="leftTeam">
         
           {this.props.game.hometeam}

          </div>
          <div className="middle">
           -
     
          </div>
          <div className="rightTeam">
           {this.props.game.awayteam}
          </div>
           <img className="flag noActive" src={getFlag(this.props.game.awayteam)}/>
           <br/>
           <div className="actualResult">
            Guessing opens <br/>
           10 AM the day before the match
          </div>
      </div>
     
      
      )
  }

  generatePassedGame(){
    return(
         <div className={"passed row"} id={"row"+this.props.game.hometeam+this.props.game.awayteam}>
          <img className="flag" src={getFlag(this.props.game.hometeam)}/>
          <div className="leftTeam">
         
           {this.props.game.hometeam}
          </div>
          <div className="middle">
           -
          </div>
          <div className="rightTeam">
           {this.props.game.awayteam}
          </div>
           <img className="flag" src={getFlag(this.props.game.awayteam)}/>
           <br/>
          <div className="actualResult">
            Actual result: <br/>
           {this.props.game.homescore} - {this.props.game.awayscore}
          </div>
        </div>
    )
  }

  generateOtherUserGames(){
    return(
         <div className={"passed row notThisUser"} id={"row"+this.props.game.hometeam+this.props.game.awayteam}>
          <img className="flag" src={getFlag(this.props.game.hometeam)}/>
          <div className="leftTeam">
         
           {this.props.game.hometeam}
          </div>
          <div className="middle">
           -
          </div>
          <div className="rightTeam">
           {this.props.game.awayteam}
          </div>
           <img className="flag" src={getFlag(this.props.game.awayteam)}/>
           <br/>
          <div className="actualResult">
            Actual result: <br/>
           {this.props.game.homescore} - {this.props.game.awayscore}
          </div>
        </div>
    )
  }

  updateGuesses(){
    let home = document.getElementById("input"+this.props.game.hometeam).value
    let away = document.getElementById("input"+this.props.game.awayteam).value

    if(!home){
      home = this.props.game.home
    }
    if(!away){
      away = this.props.game.away
    }
    this.props.setUpdate(true, true)

    fetch('/api/updateGuesses/'+this.props.user+'/'+this.props.game.id+'/'+home+'/'+away)
        .then(res => res.json())
        .then(user => {
          this.props.setUpdate(false, user[0])
        })
    
  }

 

  render() {
    return (
      <div>
          {this.props.notThisUser ?
               <div>
                {this.generateOtherUserGames()}
              </div>
          :
            <div>
               {this.props.game.home !== null && this.props.game.locked === 1 && this.generateLockedGame()}
               {this.props.game.home !== null && this.props.game.active === 1 && this.generateActiveGame()}
               {this.props.game.home !== null && this.props.game.locked === 0 && this.props.game.active === 0 && this.generatNonActiveGame()}
               {this.props.game.home === null && this.generatePassedGame()}
            </div> 
          }
      </div>
    );
  }
}

export default Row;
