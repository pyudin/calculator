import { BTN_TYPES } from "../utils/btn_types";
import { EventEmitter } from "../utils/EventEmitter";
import { validation } from "../validation/validation";
import { CalcModel } from "./CalcModel";
import {
  CALCULATE,
  INPUT_CHANGED,
  OUTPUT_CHANGED,
  ERROR_CHANGED,
} from "./events";

export class CalcView extends EventEmitter {
  model;

  input: HTMLInputElement;
  output: HTMLInputElement;
  error: HTMLElement;

  clearInput = false;

  constructor(model: CalcModel) {
    super();
    this.model = model;

    Object.values(BTN_TYPES).forEach((el) => {
      if (el.type === "number") {
        document
          .getElementById(el.name)
          .addEventListener("click", () => this.onBtn(el.symbol));
      }
    });

    document
      .getElementById("clear")
      .addEventListener("click", () => this.onClear());

    document
      .getElementById("del")
      .addEventListener("click", () => this.onDel());

    document
      .getElementById("equal")
      .addEventListener("click", () => this.onEqual());

    this.input = <HTMLInputElement>document.getElementById("input");
    this.output = <HTMLInputElement>document.getElementById("output");
    this.error = document.getElementById("error");
    model.on(INPUT_CHANGED, this.displayInput.bind(this));
    model.on(OUTPUT_CHANGED, this.displayOutput.bind(this));
    model.on(ERROR_CHANGED, this.displayError.bind(this));

    this.input.addEventListener("input", (e: any) => {
      const validation = /[\d\-+\/\*\.)(]/;
      if (!validation.test(e.data) && e.data !== null) {
        this.input.value = this.model.input;
        return;
      }
      this.model.input = this.input.value;
    });
  }

  displayInput(value: string) {
    (<HTMLInputElement>this.input).value = value;
  }
  displayOutput(value: string) {
    (<HTMLInputElement>this.output).value = value;
  }

  displayError(value: string) {
    this.error.innerText = value;
  }

  onBtn(btn: string) {
    if (this.clearInput) {
      this.model.setInput("0");
      this.clearInput = false;
    }
    if (this.model.input === "0") this.model.input = "";
    this.model.setInput(this.model.input + btn);
  }

  onClear() {
    this.model.setInput("0");
    this.model.setOutput("0");
    this.model.setError("");
  }

  onDel() {
    this.model.setInput(this.model.input.slice(0, -1));
  }

  onEqual() {
    const valid = validation(this.model.input);
    if (valid.isValid) {
      this.model.setError("");
      this.emit(CALCULATE, this.model.input);
      this.clearInput = true;
    } else {
      this.model.setError(valid.msg);
    }
  }
}
