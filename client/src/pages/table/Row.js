import React, { Component } from 'react'


class Row extends Component {

  constructor(props){
    super(props)


    this.generateLockedGame = this.generateLockedGame.bind(this)
    this.generateActiveGame = this.generateActiveGame.bind(this)
    this.generatNonActiveGame = this.generatNonActiveGame.bind(this)
    this.generatePassedGame = this.generatePassedGame.bind(this)
    this.getType = this.getType.bind(this)
  
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
      <div className={type + " row"}>
        {this.props.game.homescore} ({this.props.game.home})
        {this.props.game.hometeam} - {this.props.game.awayteam}
        {this.props.game.awayscore} ({this.props.game.away})
      </div>
    )
  }



  generateActiveGame(){
    return (
        <div className = "active row">
          {this.props.game.homescore}
          <input id="test" type="number" min="0" step="1" placeholder={this.props.game.home ? this.props.game.home : 0}/>
            {this.props.game.hometeam} - {this.props.game.awayteam}
          <input type="number" min="0" step="1" placeholder={this.props.game.away ? this.props.game.away : 0}/>
          {this.props.game.awayscore}
        </div>
    )   
  }

    generatNonActiveGame(){
      return(
         <div className="nonactive row">
          {this.props.game.homescore} 
          {this.props.game.hometeam} - {this.props.game.awayteam}
          {this.props.game.awayscore}
        </div>
      )
  }

  generatePassedGame(){
    return(
         <div className="passed row">
          {this.props.game.homescore} 
          {this.props.game.hometeam} - {this.props.game.awayteam}
          {this.props.game.awayscore}
        </div>
    )
  }


  render() {
    return (
      <div>
 
          {this.props.game.home !== null && this.props.game.locked === 1 && this.generateLockedGame()}
          {this.props.game.home !== null && this.props.game.active === 1 && this.generateActiveGame()}
          {this.props.game.home !== null && this.props.game.locked === 0 && this.props.game.active === 0 && this.generatNonActiveGame()}
          {this.props.game.home === null && this.generatePassedGame()}
        
      </div>
    );
  }
}

export default Row;
