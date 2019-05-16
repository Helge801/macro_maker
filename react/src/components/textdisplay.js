import React from 'react';
import '../stylesheets/textdisplay.css';
import {compile} from '../processors/compiler.js';

export default function TextDisplay({tokens}){
  return(
    <div className="text-display-wrapper">
      {compile(tokens)}
    </div>
  )
}
