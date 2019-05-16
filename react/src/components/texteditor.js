import React, { Component } from 'react';
import '../stylesheets/texteditor.css';
import CodeEditor from './codeeditor.js';

class TextEditor extends Component {


  render(){
    return(
      <div className="text-editor-wrapper">
        {/* <textarea className="text-editor-textarea"/> */}
        <CodeEditor/>
      </div>
    )
  }

}

export default TextEditor;
