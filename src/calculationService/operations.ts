const operations = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

export function getAction(operation: string): (a: number, b: number) => number {
  const result = operations[operation];
  return result;
}
