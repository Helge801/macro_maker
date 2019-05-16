import React, {Component} from 'react';
import './stylesheets/app.css';
import Header from './components/header.js';
import EditorWindow from './components/editorwindow.js';

class App extends Component {

  render(){
    return(
      <div id="main-wrapper">
        <Header/>
        <EditorWindow coords={[2,3,2,3]} mode="edit" title="Pseudo Code"/>
        <EditorWindow coords={[3,4,2,3]} mode="block" title="Logical Blocks"/>
        <EditorWindow coords={[2,4,3,4]} mode="static" title="Output"/>
      </div>
    )
  }

}

export default App;
