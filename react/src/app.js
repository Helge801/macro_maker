import React, {Component} from 'react';
import './stylesheets/app.css';
import Header from './components/header.js';
import EditorWindow from './components/editorwindow.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      macro: "",
      tokens: []
    }
  }

  updateMacro(macro){
    this.setState({macro});
  }

  updateTokens(tokens){
    console.log("updating tokens\n",tokens);
    this.setState({tokens});
  }

  render(){
    return(
      <div id="main-wrapper">
        <Header/>
        <EditorWindow coords={[2,3,2,3]} mode="edit" title="Pseudo Code" tokens={this.state.tokens} updateTokens={this.updateTokens.bind(this)}/>
        <EditorWindow coords={[3,4,2,3]} mode="block" title="Logical Blocks" tokens={this.state.token} updateToken={this.updateTokens.bind(this)}/>
        <EditorWindow coords={[2,4,3,4]} mode="static" title="Output" tokens={this.state.tokens} value={this.state.macro}/>
      </div>
    )
  }

}

export default App;
