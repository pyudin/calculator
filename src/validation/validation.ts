export function validation(str: string): { isValid: boolean; msg?: string } {
  const validation = /^[\d\-+\/\*\.)(]+$/;
  if (!validation.test(str)) {
    return { isValid: false, msg: "Incorrect symbol" };
  }

  // brackets
  let counter = 0;
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === "(") {
      counter += 1;
    }
    if (str[i] === ")") {
      counter -= 1;
      if (counter < 0) {
        console.log("Incorrect bracket");
        return {
          isValid: false,
          msg: "Incorrect bracket. Too many closing brackets.",
        };
      }
    }
  }
  if (counter > 0) {
    console.log("Incorrect bracket");
    return { isValid: false, msg: "Incorrect bracket. No closing bracket." };
  }

  return { isValid: true };
}
