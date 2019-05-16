import React, { Component } from 'react';
import '../stylesheets/codeeditor.css';

class CodeEditor extends Component {
  constructor(props){
    super(props);
    this.state = {
      text: "if( id = \"hello\" ){\nid.match(/^something$/)\n}"
    };
  }

  onChange(e){
    this.setState({text: e.target.value});
  }

  render(){
  return (
    <div className="code-wrapper">
      <textarea className="code-textarea" ref="ta"  value={this.state.text} onChange={this.onChange.bind(this)}/>
      {renderCode(this.state.text)}
    </div>
  )
  }

}

function renderCode(text){
  return `<pre className="code-pre" ref="di">${text.replace(/\b\w+/g,token => {
    return `<span class="code-fun">${token}</span>`;
  })}</pre>`
}


export default CodeEditor;
