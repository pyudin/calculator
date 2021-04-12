import { getAction } from "./operations";

export function calc(value: string) {
  let str = value;

  if (str.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/)) {
    const group = str.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/);
    console.log(group);
  }

  const open_bracket = str.indexOf("(");
  if (open_bracket > -1) {
    //Looking for the indexes of opening and closing bracket
    let begin;
    let end;
    let counter = 0;
    for (let i = 0; i < str.length; i += 1) {
      if (end) break;
      if (str[i] === "(") {
        if (counter === 0) begin = i;
        counter += 1;
      }
      if (str[i] === ")") {
        counter -= 1;
        if (counter === 0) end = i;
      }
    }

    // Calculation of the expresion inside brackets
    const result = calc(str.substring(begin + 1, end));

    // Replacing expresion with the it result
    str = str.replace(str.substring(begin, end + 1), `${result}`);
  }

  const result = count(str);
  console.log(result);

  return result;
}

const regex = ["(-?\\d+\\.?\\d*)([*\\/])(\\d+\\.?\\d*)", "(-?\\d+\\.?\\d*)([+-])(\\d+\\.?\\d*)"];

function count(expresion: string): number {
  regex.forEach((el) => {
    while (expresion.match(el)) {
      const expGroups = expresion.match(el);
      const result = getAction(expGroups[2])(+expGroups[1], +expGroups[3]);
      expresion = expresion.replace(expGroups[0], String(result));
    }
  });
  return +expresion;
}
