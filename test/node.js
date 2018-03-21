import sinon from "sinon";
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
chai.should();
chai.use(sinonChai);

global.sinon = sinon;
global.expect = expect;

require("./index.js");
