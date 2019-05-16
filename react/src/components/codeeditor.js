import React, { Component } from 'react';
import { tokenize } from '../processors/tokenize.js';
import { tabChar } from '../settings.js';
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

  onKeyDown(e){
    if(e.keyCode == 9) this.indent(e)
  }

  indent(e){
    e.preventDefault();
    var t = e.target,
      s = t.selectionStart,
      e = t.selectionEnd,
      v = t.value,
      l = v.length,
      text; 
    if(s === e) text = v.substring(0, s) + tabChar + v.substring(e);
    else{
      var lines = v.split(/\n/),
        index = 0;
        
      for(var i = 0; i < lines.length; i++){
        if(this.overlap(index,index + lines[i].length,s,e)){
          index += lines[i].length;
          lines[i] = `${tabChar}${lines[i]}`;
        } else {
          index += lines[i].length + 1;
        }
      }
      text = lines.join("\n");
    }
    

    this.state.text = t.value = text;
    t.selectionStart = s + tabChar.length;
    t.selectionEnd = e + text.length - l;
    this.forceUpdate();
  }

  overlap(as,ae,bs,be){
    return (
      this.inRange(as,ae,bs) ||
      this.inRange(as,ae,be) ||
      this.inRange(bs,be,as) ||
      this.inRange(bs,be,ae)
    )
  }

  inRange(s,e,i){
    return i >= s && i <= e
  }

  render(){
  return (
    <div className="code-wrapper">
      <textarea
        className="code-textarea"
        ref="ta"
        value={this.state.text}
        onChange={this.onChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
      />
      {renderCode(this.state.text)}
    </div>
  )
  }

}

function renderCode(text){
  return (<pre className="code-pre" ref="pre">
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
    case "if":
      return "code-fun";
    default:
      return "code-err";
  }
}

function wrapSpan(text, cls, pop){
  if(pop) return <span className={cls}>{text.slice(0,text.length - 1)}<span className="code-def">{text[text.length -1]}</span></span>
  return <span className={cls}>{text}</span>
}

export default CodeEditor;
