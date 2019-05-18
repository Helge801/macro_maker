import React, {Component} from 'react';
import './stylesheets/app.css';
import Header from './components/header.js';
import EditorWindow from './components/editorwindow.js';
import CodeEditor from './components/codeeditor.js';
import TextDisplay from './components/textdisplay.js';

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
    this.setState({tokens});
  }

  render(){
    const { tokens } = this.state;
    return(
      <div id="main-wrapper">

        <Header/>

        <EditorWindow coords={[2,3,2,3]} title="Pseudo Code" >
          <CodeEditor tokens={tokens} updateTokens={this.updateTokens.bind(this)} />
        </EditorWindow>

        <EditorWindow coords={[3,4,2,3]} title="Logical Blocks" >
          <h1 style={{color: "grey"}}>Comming Soon</h1>
        </EditorWindow>
          
        <EditorWindow coords={[2,4,3,4]} title="Output">
          <TextDisplay tokens={tokens}/>
        </EditorWindow>
      </div>
    )
  }

}

export default App;
