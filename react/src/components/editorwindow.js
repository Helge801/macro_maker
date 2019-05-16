import React from 'react';
import TextEditor from './texteditor.js';
import '../stylesheets/editorwindow.css';
import TextDisplay from './textdisplay.js';

const EditorWindow = (props) => {
  const { coords, mode } = props;
  var style = {
    gridColumnStart: coords[0],
    gridColumnEnd: coords[1],
    gridRowStart: coords[2],
    gridRowEnd: coords[3]
  }

  return (
    <div className="editor-window-wrapper" style={style}>
      <div className="editor-title-wrapper">{props.title}</div>
        <div className="editor-window-content">
          { (() => {switch(mode){
              case "edit":
                return <TextEditor {...props}/>;
              case "static":
                return <TextDisplay tokens={props.tokens}/>
              default:
                return mode;
            }
            })()}
        </div>
    </div>
  )
}

export default EditorWindow;
