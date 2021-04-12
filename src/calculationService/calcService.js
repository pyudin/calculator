export class Calculation2 {
  constructor() {
    this._symbols = {};
    this.defineOperator("!", this.factorial, "postfix", 6);
    this.defineOperator("^", Math.pow, "infix", 5, true);
    this.defineOperator("*", this.multiplication, "infix", 4);
    this.defineOperator("/", this.division, "infix", 4);
    this.defineOperator("+", this.last, "prefix", 3);
    this.defineOperator("-", this.negation, "prefix", 3);
    this.defineOperator("+", this.addition, "infix", 2);
    this.defineOperator("-", this.subtraction, "infix", 2);
    this.defineOperator(",", Array.of, "infix", 1);
    this.defineOperator("(", this.last, "prefix");
    this.defineOperator(")", null, "postfix");
    this.defineOperator("min", Math.min);
    this.defineOperator("sqrt", Math.sqrt);
  }
  // Method allowing to extend an instance with more operators and functions:
  defineOperator(
    symbol,
    f,
    notation = "func",
    precedence = 0,
    rightToLeft = false
  ) {
    // Store operators keyed by their symbol/name. Some symbols may represent
    // different usages: e.g. "-" can be unary or binary, so they are also
    // keyed by their notation (prefix, infix, postfix, func):
    if (notation === "func") precedence = 0;
    this._symbols[symbol] = Object.assign({}, this._symbols[symbol], {
      [notation]: {
        symbol,
        f,
        notation,
        precedence,
        rightToLeft,
        argCount: 1 + (notation === "infix"),
      },
      symbol,
      regSymbol:
        symbol.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&") +
        (/\w$/.test(symbol) ? "\\b" : ""), // add a break if it's a name
    });
  }
  last(...a) {
    return a[a.length - 1];
  }
  negation(a) {
    return -a;
  }
  addition(a, b) {
    return a + b;
  }
  subtraction(a, b) {
    return a - b;
  }
  multiplication(a, b) {
    return a * b;
  }
  division(a, b) {
    return a / b;
  }
  factorial(a) {
    if (a % 1 || !(+a >= 0)) return NaN;
    if (a > 170) return Infinity;
    let b = 1;
    while (a > 1) b *= a--;
    return b;
  }
  calculate(expression) {
    let match;
    const values = [],
      operators = [this._symbols["("].prefix],
      exec = (_) => {
        let op = operators.pop();
        values.push(op.f(...[].concat(...values.splice(-op.argCount))));
        return op.precedence;
      },
      error = (msg) => {
        let notation = match ? match.index : expression.length;
        return `${msg} at ${notation}`; //:\n${expression}\n${" ".repeat(
        //   notation
        // )}^`;
      },
      pattern = new RegExp(
        // Pattern for numbers
        "\\d+(?:\\.\\d+)?|" +
          // ...and patterns for individual operators/function names
          Object.values(this._symbols)
            // longer symbols should be listed first
            .sort((a, b) => b.symbol.length - a.symbol.length)
            .map((val) => val.regSymbol)
            .join("|") +
          "|(\\S)",
        "g"
      );
    let afterValue = false;
    pattern.lastIndex = 0; // Reset regular expression object
    do {
      match = pattern.exec(expression);
      const [token, bad] = match || [")", undefined],
        notNumber = this._symbols[token],
        notNewValue = notNumber && !notNumber.prefix && !notNumber.func,
        notAfterValue = !notNumber || (!notNumber.postfix && !notNumber.infix);
      // Check for syntax errors:
      if (bad || (afterValue ? notAfterValue : notNewValue))
        return error("Syntax error");
      if (afterValue) {
        // We either have an infix or postfix operator (they should be mutually exclusive)
        const curr = notNumber.postfix || notNumber.infix;
        do {
          const prev = operators[operators.length - 1];
          if ((curr.precedence - prev.precedence || prev.rightToLeft) > 0)
            break;
          // Apply previous operator, since it has precedence over current one
        } while (exec()); // Exit loop after executing an opening parenthesis or function
        afterValue = curr.notation === "postfix";
        if (curr.symbol !== ")") {
          operators.push(curr);
          // Postfix always has precedence over any operator that follows after it
          if (afterValue) exec();
        }
      } else if (notNumber) {
        // prefix operator or function
        operators.push(notNumber.prefix || notNumber.func);
        if (notNumber.func) {
          // Require an opening parenthesis
          match = pattern.exec(expression);
          if (!match || match[0] !== "(")
            return error("Function needs parentheses");
        }
      } else {
        // number
        values.push(+token);
        afterValue = true;
      }
    } while (match && operators.length);
    return operators.length
      ? error("Missing closing parenthesis")
      : match
      ? error("Too many closing parentheses")
      : values.pop(); // All done!
  }
}
export const calc2 = new Calculation2(); // Create a singleton
const res = calc.calculate("11+2-2.3*4/12.12");
console.log(res);

// const res2 = calculate("11+2-2.3*4/12.12");
// console.log(res2);

// function calculate(input) {
//   var f = {
//     add: "+",
//     sub: "-",
//     div: "/",
//     mlt: "*",
//     mod: "%",
//     exp: "^",
//   };

//   // Create array for Order of Operation and precedence
//   f.ooo = [
//     [[f.mlt], [f.div], [f.mod], [f.exp]],
//     [[f.add], [f.sub]],
//   ];

//   input = input.replace(/[^0-9%^*\/()\-+.]/g, ""); // clean up unnecessary characters

//   var output;
//   for (var i = 0, n = f.ooo.length; i < n; i++) {
//     // Regular Expression to look for operators between floating numbers or integers
//     var re = new RegExp(
//       "(\\d+\\.?\\d*)([\\" + f.ooo[i].join("\\") + "])(\\d+\\.?\\d*)"
//     );
//     re.lastIndex = 0; // take precautions and reset re starting pos

//     // Loop while there is still calculation for level of precedence
//     while (re.test(input)) {
//       output = _calculate(RegExp.$1, RegExp.$2, RegExp.$3);
//       if (isNaN(output) || !isFinite(output)) return output; // exit early if not a number
//       input = input.replace(re, output);
//     }
//   }

//   return output;

//   function _calculate(a, op, b) {
//     a = a * 1;
//     b = b * 1;
//     switch (op) {
//       case f.add:
//         return a + b;
//         break;
//       case f.sub:
//         return a - b;
//         break;
//       case f.div:
//         return a / b;
//         break;
//       case f.mlt:
//         return a * b;
//         break;
//       case f.mod:
//         return a % b;
//         break;
//       case f.exp:
//         return Math.pow(a, b);
//         break;
//       default:
//         null;
//     }
//   }
// }
