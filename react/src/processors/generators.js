
function RegexEval(source, evalStr, method, replacement){
  return `{regexp_replace(${source},${Regex(evalStr,method)},${replacement})}`
}

function IfStatment(source, notEmpty, empty ){
  return `{if(${source},${notEmpty},${empty})}`
}

function Column(col){
  return `{product.${col}}`
}

function Regex(str, method){
  return `${LeftAnchor(method)}${str}${RightAnchor(method)}`
}

function LeftAnchor(method){
  switch(method){
    case "starts-with":
    case "equals":
      return "^";
    default:
      return ".*";
  }
}

function RightAnchor(method){
  switch(method){

    case "ends-with":
    case "equals":
      return "$";

    default:
      return ".*";
  }
}

function RegexReplace(subject,expression,replacement){
  return `{regexp_replace(${subject},${expression},${replacement})}`
}

function FullReplace(subject,expression,replacement){
  
}

function Replace(subject,target,replacement){
  return `{replace(${subject},${target},${replacement})}`
}

//Helpers

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const gen = {
  RegexEval,
  IfStatment,
  Column,
  Regex,
  LeftAnchor,
  RightAnchor,
  Replace,
  RegexReplace,
}

