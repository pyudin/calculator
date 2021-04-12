import { CalcController } from "./calc/CalcController";
import { CalcModel } from "./calc/CalcModel";
import { CalcView } from "./calc/CalcView";
import "./styles/styles.css";

const model = new CalcModel();
const view = new CalcView(model);
const controller = new CalcController(model, view);
