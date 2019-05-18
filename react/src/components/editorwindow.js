import React from 'react';
import '../stylesheets/editorwindow.css';

const EditorWindow = ({coords, title, children}) => {
  const style = {
    gridColumnStart: coords[0],
    gridColumnEnd: coords[1],
    gridRowStart: coords[2],
    gridRowEnd: coords[3]
  }

  return (
    <div className="editor-window-wrapper" style={style}>
      <div className="editor-title-wrapper">{title}</div>
          <div className="editor-window-content">
            {children}
        </div>
    </div>
  )
}

export default EditorWindow;
