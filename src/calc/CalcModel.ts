import { EventEmitter } from "../utils/EventEmitter";
import { OUTPUT_CHANGED, INPUT_CHANGED, ERROR_CHANGED } from "./events";

export class CalcModel extends EventEmitter {
  output: string = "";
  input: string = "(1+(2+1))*3";
  error: string = "";

  constructor() {
    super();
  }

  setOutput(value: string): void {
    this.output = value;
    this.emit(OUTPUT_CHANGED, value);
  }

  setInput(value: string): void {
    this.input = value;
    this.emit(INPUT_CHANGED, value);
  }

  setError(value: string): void {
    this.error = value;
    this.emit(ERROR_CHANGED, value);
  }
}
