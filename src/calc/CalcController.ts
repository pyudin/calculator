import { BTN_TYPES } from "../utils/btn_types";
import { CalcModel } from "./CalcModel";
import { CalcView } from "./CalcView";
import { CALCULATE } from "./events";
import * as calculationService from "../calculationService/calculationService";
import * as calculationService2 from "../calculationService/calculationService2";

export class CalcController {
  model;
  view;

  clearInput = false;

  constructor(model: CalcModel, view: CalcView) {
    this.model = model;
    this.view = view;

    view.on(CALCULATE, (str: string) => this.onCalculate(str));
  }

  onCalculate(str: string) {
    const result = calculationService2.calc(str);
    this.model.setOutput(String(result));
  }
}
