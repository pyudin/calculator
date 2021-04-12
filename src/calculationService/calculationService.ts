export function calc(value: string): number {
  let str = value;

  //=====================================
  // If there are brackets:

  const open_bracket = str.indexOf("(");
  if (open_bracket > -1) {
    //Looking for index of opening and closing bracket
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

  //======================================
  //Calculating expresion without brackets:

  const len = str.length;
  const mul = str.indexOf("*");
  const div = str.indexOf("/");
  const add = str.indexOf("+");
  const sub = str.indexOf("-");

  //Dividing string by the operations until it became just a number and making calculation
  if (add > -1)
    return calc(str.substring(0, add)) + calc(str.substring(add + 1, len));
  else if (sub > -1)
    return calc(str.substring(0, sub)) - calc(str.substring(sub + 1, len));
  else if (mul > -1)
    return calc(str.substring(0, mul)) * calc(str.substring(mul + 1, len));
  else if (div > -1)
    return calc(str.substring(0, div)) / calc(str.substring(div + 1, len));
  else {
    return Number(str);
  }
}
