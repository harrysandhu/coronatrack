"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var jwt = require('jsonwebtoken');
var crypto = require("crypto");
var sha256 = require("js-sha256");
var privateKey = fs.readFileSync("./security/private.key", "utf8");
var publicKey = fs.readFileSync("./security/public.key", "utf8");
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var ErrorResponse_1 = require("./helper/ErrorResponse");
var User_1 = __importDefault(require("./User"));
var Symptom_1 = __importDefault(require("./Symptom"));
var SymptomState_1 = require("./SymptomState");
var Weights_1 = require("./Weights");
var Record = /** @class */ (function () {
    function Record(init) {
        this.user = new Object();
        this.recordDateTime = new Date();
        this.symptoms = {
            fever: new Symptom_1.default({ name: "Fever", weight: Weights_1.Weights.fever, state: SymptomState_1.SymptomState.NO }),
            cold: new Symptom_1.default({ name: "Cold", weight: Weights_1.Weights.cold, state: SymptomState_1.SymptomState.NO }),
            cough: new Symptom_1.default({ name: "Cough", weight: Weights_1.Weights.cough, state: SymptomState_1.SymptomState.NO }),
            breathing: new Symptom_1.default({ name: "Breathing Difficulty", weight: Weights_1.Weights.breathing, state: SymptomState_1.SymptomState.NO }),
            bodyAche: new Symptom_1.default({ name: "Body Ache", weight: Weights_1.Weights.bodyAche, state: SymptomState_1.SymptomState.NO })
        };
        try {
            if (init) {
                if (User_1.default.isValidUI(init)) {
                    Object.assign(this, init);
                }
                else {
                    throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
                }
            }
        }
        catch (e) {
            console.log(e.stack);
            throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
        }
    }
    return Record;
}());
exports.default = Record;
