export function tokenize(content){

  var tokens = content.split('');
  // console.log(tokens)
  tokens = groupEscapeable(tokens,'"',true);
  // console.log(tokens)
  tokens = groupEscapeable(tokens,"/",true);
  // console.log(tokens)
  tokens = groupSpace(tokens);
  // console.log(tokens);
  tokens = groupTokens(tokens);
  // console.log(tokens)
  return tokens

}

function groupEscapeable(tokens,token,escapeable){
  var grouped = [], found, breakNext;

  for(var i = 0;i < tokens.length; i++){
    switch(tokens[i]){
      case token:
        if(found){
          if(escapeable && i > 0 && tokens[i-1] === "\\"){
            continue;
          } else {
            grouped.push(tokens.slice(found,i+1).join(''));
            found = undefined;
            token = getInversToken(token);
          }
        } else {
          found = i;
          token = getInversToken(token);
        }
        break;
      default:
        if(found) continue;
        else grouped.push(tokens[i]);
    }
  }
  return grouped;
}

function groupSpace(tokens){
  var grouped = [],
    space = ""

  for( var i = 0; i < tokens.length; i++){
    // console.log("evaling", [tokens[i]])
    if(tokens[i].match(/^[\s\r\n]$/)) space += tokens[i]
    else {
      // console.log("didn't match")
      if( space !== "" ) grouped.push(space)
      space = ""
      grouped.push(tokens[i])
    }
  }
  return grouped;
}

function groupTokens(tokens){
  var grouped = [], 
    index,
    token = "",
    addToken = (t) => {
      if(token) grouped.push(token);
      token = "";
      if(t) grouped.push(t);
    };

  for(var i = 0; i < tokens.length; i++){
    if(tokens[i].match(/^[\s\n\r]+$/)){
      addToken(tokens[i]);
      continue;
    }
    switch(tokens[i]){

      case ".":
        addToken();
        token += tokens[i];
        break;

      case ",":
      case ")":
      case "{":
      case "}":
      case "]":
        addToken(tokens[i]);
        break;

      case "(":
      case "[":
        token += tokens[i];
        addToken();
        break;

      default:
        token += tokens[i];
        if(i == tokens.length -1 ) addToken();

    }
  }
  return grouped;
}

function getInversToken(token){
  var inverter = {
    "(":")",
    ")":"(",
    "[":"]",
    "]":"[",
    "{":"}",
    "}":"{",
    '"':'"',
    "'":"'",
    "`":"`",
    "/":"/"
  }
  return inverter[token];
}

