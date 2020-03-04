"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var jwt = require('jsonwebtoken');
var crypto = require("crypto");
var sha256 = require("js-sha256");
// let privateKey = fs.readFileSync("./security/private.key", "utf8");
// let publicKey = fs.readFileSync("./security/public.key", "utf8");
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var SymptomState_1 = require("./SymptomState");
var Symptom = /** @class */ (function () {
    function Symptom(init) {
        this.name = "";
        this.weight = 0;
        this.state = SymptomState_1.SymptomState.NO;
        Object.assign(this, init);
    }
    return Symptom;
}());
exports.default = Symptom;
