"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var express_1 = __importDefault(require("express"));
var data = express_1.default.Router();
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
var sha256 = require('js-sha256');
var privateKey = fs.readFileSync('./security/private.key', 'utf8');
var publicKey = fs.readFileSync('./security/public.key', 'utf8');
var verifyAuthToken = require('../../functions/helpers').verifyAuthToken;
var genVerificationCode = require('../../functions/helpers').genVerificationCode;
var RESPONSES = require('../../functions/helperConstants').RESPONSES;
var BASE_DEV = require('../../functions/helperConstants').BASE_DEV;
/**
    IMPORT CORE CLASSES
 */
var User_1 = __importDefault(require("../../src/User"));
var Record_1 = __importDefault(require("../../src/Record"));
var Result_1 = __importDefault(require("../../src/Result"));
var ErrorResponse_1 = require("../../src/helper/ErrorResponse");
// /**DATABASE IMPORTS AND CONFIG */
// import AWS from 'aws-sdk';
// let aws_config:any = require("../../src/config/config")
// AWS.config.update(aws_config.aws_remote_config)
// //to create a dynamoDB instance
// //let dynamodb:any = new AWS.DynamoDB()
/*
*returns record for given date for user,
*if record not found returns empty symptom template
*
if date not provided, returns all records
*/
data.get("/record", verifyAuthToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ur, u, user, result, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, User_1.default.jwtVerifyUser(req.token, publicKey)];
            case 1:
                ur = _a.sent();
                console.log("UR: ", ur);
                if (!User_1.default.isValidUI(ur.get())) return [3 /*break*/, 5];
                u = ur.get();
                //user is verified
                console.log("userresult at /record: ", ur);
                user = new User_1.default(u);
                if (!!req.query.date) return [3 /*break*/, 3];
                return [4 /*yield*/, user.getRecordByDate(req.query.date)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.json(result.get())];
            case 3: return [4 /*yield*/, user.getAllRecords()];
            case 4:
                result = _a.sent();
                return [2 /*return*/, res.json(result.get())];
            case 5: throw Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException);
            case 6:
                error_1 = _a.sent();
                return [2 /*return*/, res.json(error_1.get())];
            case 7: return [2 /*return*/];
        }
    });
}); });
data.get("/user/record", verifyAuthToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ur, u, user, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1.default.jwtVerifyUser(req.token, publicKey)];
            case 1:
                ur = _a.sent();
                console.log("UR: ", ur);
                if (!User_1.default.isValidUI(ur.get())) return [3 /*break*/, 3];
                u = ur.get();
                //user is verified
                console.log("userresult at /record: ", ur);
                user = new User_1.default(u);
                return [4 /*yield*/, user.getLatestRecord()];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.json(result.get())];
            case 3: throw Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException);
            case 4:
                error_2 = _a.sent();
                return [2 /*return*/, res.json(error_2.get())];
            case 5: return [2 /*return*/];
        }
    });
}); });
/*
    record > {
        d_id
        recordDateTime,
        location
        symptoms


    }

*/
data.post("/record", verifyAuthToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var record, ur, u, user, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.record)
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                record = __assign({}, req.body.record);
                if (!Record_1.default.isValidRI(record))
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, User_1.default.jwtVerifyUser(req.token, publicKey)];
            case 2:
                ur = _a.sent();
                console.log("UR: ", record);
                if (!User_1.default.isValidUI(ur.get())) return [3 /*break*/, 4];
                u = ur.get();
                //user is verified
                console.log("userresult at /record: ", ur);
                user = new User_1.default(u);
                return [4 /*yield*/, user.insertRecord(record)];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.json(result.get())];
            case 4: throw Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException);
            case 5:
                error_3 = _a.sent();
                return [2 /*return*/, res.json(error_3.get())];
            case 6: return [2 /*return*/];
        }
    });
}); });
module.exports = data;
