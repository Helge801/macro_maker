import React, { Component } from 'react';
import { tokenize } from '../processors/tokenize.js';
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
  return (<pre className="code-pre">
    {
      tokenize(text).map(t =>{
        if(t.match(/^\/.*\/$/)) return wrapSpan(t,"code-reg")
        if(t.match(/^\".*\"$/)) return wrapSpan(t,"code-str")
        if(t.match(/.+\($/))    return wrapSpan(t,"code-fun",true)
        if(t.match(/^\d+$/))    return wrapSpan(t,"code-int")
        if(t.match(/^\w+$/))    return wrapSpan(t,getWordClass(t))

        return wrapSpan(t,"code-def")
      })
    }
  </pre>)
}

function getWordClass(token){
  switch(token){
    case "id":
    case "title":
    case "description":
    case "price":
    case "price_old":
    case "category":
    case "url_product":
    case "url_image":
    case "url_imagebig":
    case "currency":
      return "code-res";
    default:
      return "code-err";
  }
}

function wrapSpan(text, cls, pop){
  if(pop) return <span className={cls}>{text.slice(0,text.length - 1)}<span className="code-def">{text[text.length -1]}</span></span>
  return <span className={cls}>{text}</span>
}

export default CodeEditor;
