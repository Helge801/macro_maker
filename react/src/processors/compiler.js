import { gen } from './generators.js';
import { REGEX_DELIMITER, STRING_DELIMITER } from '../settings.js';

export function compile(tokens){
  console.log(gen)
  var errors = [],
    macro;
  try{macro = processStatements(tokens);}
  catch(e){err("Failed to compile")}
  return errors.length > 0 ? errors.join("\n") : escapeMacro(macro);

  function processStatements(tokens){
    var statements = [];

    for(var i = 0; i < tokens.length; i++){
      var operator;

      switch(tokens[i]){

        case "if":
        case "if(":
          let { index, statement } = captureIfStatement(tokens, i);
          statements.push(statement);
          i = index;
          break;

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
          statements.push(gen.Column(tokens[i]));
          break;

        case "==":
        case "===":
        case "equals":
          operator = tokens[i];
          continue;

        default:

          // handle white space
          if(tokens[i].match(/^[\s\n\r]+$/))
            break;

          // handle regex and strings
          if(tokens[i].match(/^\".*\"$|^\/.*\/$/)){
            statements.push(handleEscapable(tokens[i]));
            break;
          }

          // handle functions
          if(tokens[i].match(/\..+\(/)){
            let { index, statement } = handleFunction(tokens, statements.pop(), i);
            statements.push(statement);
            i = index;
            break;
          }

          // handle numbers
          if(tokens[i].match(/^\d+$/)){
            statements.push(tokens[i]);
            break;
          }

          // handle failure to parse token
          console.log(tokens);
          err(`I don't know what to do with this token: ${tokens[i]}`);

      }
      if(operator){
        var statement = handleOperator(statements[statements.length -2],operator,statements[statements.length -1]);
        statements.pop();
        statements[statements.length - 1] = statement;
      }
    }
    return statements.join('');

  }

  function handleEscapable(expression){
    if(expression.match(/^\//)) return handleRegex(expression);
    if(expression.match(/^\"/)) return handleString(expression);

    console.log(`I dont know what to do with this expression: ${expression}`);
    process.exit();
  }

  function handleString(expression){
    expression = expression.replace(/^\"|\"$/g, STRING_DELIMITER);
    return expression;
  }

  function handleRegex(expression){
    return expression.replace(/^\/|\/$/g, REGEX_DELIMITER);
  }

  function handleFunction(tokens, subject, index){
    switch(tokens[index]){
      case ".match(":
        return catureMatchStatement(tokens, subject, index)
      case ".replace(":
        return captureReplaceStatement(tokens, subject, index)
      default:
        console.log(`I don't know what to do with this function: ${tokens[index].replace(/^\.|\($/,'')}`)
        process.exit();
    }
  }

  function handleOperator(left,op,right){
    switch(op){

      case "==":
      case "===":
        return handleEquality(left,right);

      default:
        console.log(`I don't know how to handle the operator: ${op}`);
    }
  }

  function handleEquality(a,b){
    return gen.IfStatment(
      gen.Replace(a,b,""),
      "",
      "true"
    )
  }

  function captureReplaceStatement(tokens, subject, index){
    var { endingIndex, args } = extractInternalsFromBrackets(tokens, "(", index);

    if(args.length != 2) err(`Wrong number of arguments for replace function, expected 2, get ${args.length}`);

    var isRegex = args[0].length == 1 && args[0][0].match(/^\/.*\/$/),
      expression = processStatements(args[0]),
      replacement = processStatements(args[1]),
      statement = handleReplaceStatement(subject, expression, replacement, isRegex);

    return {
      index: endingIndex,
      statement
    }
  }

  function handleReplaceStatement(subject, expression, replacement, isRegex){
    var func = isRegex ? gen.RegexReplace : gen.Replace;
    return func(subject,expression,replacement);
  }

  function catureMatchStatement(tokens, subject, index){
    var { endingIndex, args } = extractInternalsFromBrackets(tokens, "(", index),
      statement;

    switch(args.length){

      case 1:
        statement = handleMatch(subject, processStatements(args[0]));
        break;

      case 2:
        statement = handleCapture(subject, processStatements(args[0]), processStatements(args[1]));
        break;

      default:
        err(`Wrong number of arguments for match function, expected 1 or 2, got ${args.length}`);
    }

    return {
      index: endingIndex,
      statement
    };

  }

  // TODO since a single argument match statment would be indended to have a boolean response then this should be packed like a capture inside of an if statement
  function handleMatch(subject, expression){
    var func = expression[0] === String.fromCharCode(135) ? gen.RegexReplace : gen.Replace;
    return gen.IfStatment(
      func(subject, expression, ''),
      "",
      "true"
    )
  }

  function handleCapture(subject, expression, index){
    if(isNaN(parseInt(index))) warning("Second of two  arguments in a match statment should be capture group index (int)");
    if(expression[0] !== REGEX_DELIMITER || !expression.match(/(.*)/)) warning("First of two arguments in a match statement should be a regex with at least one capture group")
    index = isNaN(parseInt(index)) ? index : `$${index}`;
    return gen.RegexReplace(subject,expression,index);
  }

  function captureIfStatement(tokens, index){
    var {endingIndex, args } = extractInternalsFromBrackets(tokens,"(",index);
    var condition = processStatements(args[0]);
    var {endingIndex, args} = extractInternalsFromBrackets(tokens,"{",endingIndex);
    var whenTrue = processStatements(args[0]);
    var whenFalse = "";
    if(nextToken(tokens, endingIndex+1) == "else"){
      console.log("FOUND ELSE STATEMENT")
      var {endingIndex, args} = extractInternalsFromBrackets(tokens,"{",endingIndex + 1);
      whenFalse = processStatements(args[0]);
    }

    return {
      statement: gen.IfStatment(condition,whenTrue,whenFalse),
      index: endingIndex
    }

  }

  // TODO handle failer to extract
  function extractInternalsFromBrackets(parts, token, indexOffset = 0){
    var depth = -1;
    var args = [];
    for( var i = indexOffset; i < parts.length; i++){
      var inversToken = getInversToken(token);
      var startingIndex;
      var intermediateIndex;
      switch(parts[i]){

        case token:
          if(depth < 0)
            intermediateIndex = startingIndex = i + 1;
          depth++;
          break;

        case inversToken:
          if(depth == 0){
            args.push(parts.slice(intermediateIndex,i))
            return { endingIndex: i, startingIndex, args };
          }
          depth--;
          break;

        case ",":
          if(depth == 0 && token === "("){
            args.push(parts.slice(intermediateIndex,i));
            intermediateIndex = i + 1;
          }
          break;

        default:
          if(token === "(" && parts[i].match(/\($/)){
            if(depth < 0)
              intermediateIndex = startingIndex = i + 1;
            depth++;
            break;
          }
      }
    }
    err(`Missing ${inversToken}`);
    return;
  };

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

  function escapeMacro(macro){
  var chars = macro.split('');
  var layer = 0;
  var a = 0;
  var e;
  return chars.map(c => {
    switch(c){

      case "(":
        if(!e) layer++;
        return escapeChar(c,layer + a - (e ? 0 : 1));

      case ")":
        if(!e) layer--;
        return escapeChar(c,layer + a);

      case ",":
        return escapeChar(c,layer + a - 1);

      case "{":
      case "}":
      case "\\":
        return escapeChar(c,layer + a);

      case STRING_DELIMITER:
      case REGEX_DELIMITER:
        e = e ? undefined : c;
        a = e == STRING_DELIMITER ? 1 : 0;
        return '';

      default:
        return c;

    }
  }).join('');
}


function escapeChar(char, layer){

  var count = Math.pow(2,layer) - 1;
  
  for(var i = 0; i < count; i++){
    char =  "\\" + char;
  }
  return char;
}

function nextToken(tokens,index){
  console.log("Finding next token",index,tokens)
  for(var i = index; i < tokens.length; i++){
    if(!tokens[i].match(/^[\s\r\n]+$/))
      return tokens[i];
    console.log("FOUND TOKEN: ",tokens[i])
  }
}


  function err(msg){
    errors.push(`Error: ${msg}`);
  }

}
