"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var jwt = require('jsonwebtoken');
var crypto = require("crypto");
var sha256 = require("js-sha256");
var privateKey = fs.readFileSync("./security/private.key", "utf8");
var publicKey = fs.readFileSync("./security/public.key", "utf8");
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var Result_1 = __importDefault(require("./Result"));
var FS = __importStar(require("./settings/FieldSettings"));
var dbConfig_1 = require("./config/dbConfig");
var ErrorResponse_1 = require("./helper/ErrorResponse");
var Response_1 = require("./helper/Response");
var Weights_1 = require("./Weights");
var Geohash = require('ngeohash');
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.genSignUpId = function () {
        var length = 10;
        var seedText = "newUser";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            seedText.toUpperCase() +
            "abcdefghijklmnopqrstuvwxyz" +
            seedText +
            "123456789";
        var charLength = chars.length;
        var result = "";
        for (var i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * charLength)];
        }
        return result;
    };
    Helper.getLocationGeohash = function (latitude, longitude, precision) {
        return __awaiter(this, void 0, void 0, function () {
            var locationGeohash;
            return __generator(this, function (_a) {
                locationGeohash = Geohash.encode(latitude, longitude, precision);
                if (locationGeohash) {
                    return [2 /*return*/, Promise.resolve(Result_1.default.Success(locationGeohash))];
                }
                return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
            });
        });
    };
    Helper.getRange = function (n) {
        switch (true) {
            case (n <= 20):
                return 0;
            case (n > 20 && n <= 40):
                return 1;
            case (n > 40 && n <= 60):
                return 2;
            case (n > 60 && n <= 85):
                return 3;
            default:
                return 4;
        }
    };
    Helper.rangeDiff = function (x, m) {
        return Helper.getRange(m) - Helper.getRange(x);
    };
    Helper.rms = function (nums) {
        if (nums.length > 0) {
            var sqsum = 0;
            for (var i = 0; i < nums.length; i++) {
                sqsum += nums[i] * nums[i];
            }
            return Math.sqrt(sqsum / nums.length);
        }
        return 0;
    };
    Helper.InfectionProbability = function (x, a, m, rd, np) {
        if (x <= a) {
            var rmsval = Helper.rms(np);
            if (rd <= 0) {
                return rmsval;
            }
            else if (rd == 1) {
                return Helper.rms([rmsval, m]);
            }
            else {
                return Helper.rms([Helper.rms([rmsval, m]), rmsval, m]);
            }
        }
        else {
            if (rd <= 0) {
                return x;
            }
            else {
                return (x + m) / 2;
            }
        }
        return x;
    };
    Helper.processInfectionState = function (d_id, locationGeohash, symptoms) {
        return __awaiter(this, void 0, void 0, function () {
            var client, x_1, a, m, rd, neighboursArr, np, queryText, inserts, result, infProb, insertResult, i, sum_np, i, insertResult, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 11, 12, 13]);
                        x_1 = 0, a = 0, m = 0, rd = 0;
                        Object.keys(symptoms).map(function (symptom) {
                            x_1 += (symptoms[symptom]['state'] * Weights_1.Weights[symptom]);
                        });
                        neighboursArr = Geohash.neighbors(locationGeohash);
                        np = [];
                        return [4 /*yield*/, client.query('BEGIN')
                            /*
                            * _infection neigbours near the user, reported within last 15 mins
                            */
                        ];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT DISTINCT location_geohash, infection_probability, MIN(AGE(NOW(), at_datetime)) FROM _infection'
                            + " " + 'WHERE EXTRACT(MINUTE FROM AGE(NOW(),at_datetime)) < 10'
                            + " " + 'AND location_geohash IN($1, $2, $3, $4, $5, $6, $7, $8) GROUP BY location_geohash, infection_probability';
                        inserts = neighboursArr;
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        result = _a.sent();
                        infProb = 0;
                        if (!(result.rows.length == 0)) return [3 /*break*/, 7];
                        //no neighbours, 
                        infProb = x_1;
                        //UPDATE at_datetime
                        queryText = 'UPDATE _infection SET at_datetime = NOW(), location_geohash=$1 WHERE d_id=$2';
                        inserts = [locationGeohash, d_id];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 5:
                        insertResult = _a.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success({ infection_probability: infProb, success: true }))];
                    case 7:
                        for (i = 0; i < result.rows.length; i++) {
                            np.push(result.rows[i]['infection_probability']);
                        }
                        m = Math.max.apply(Math, np);
                        sum_np = 0;
                        for (i = 0; i < np.length; i++) {
                            sum_np += np[i];
                        }
                        a = (x_1 + sum_np) / (np.length + 1);
                        rd = Helper.rangeDiff(x_1, a);
                        infProb = Helper.InfectionProbability(x_1, a, m, rd, np);
                        queryText = 'UPDATE _infection SET at_datetime = NOW(), infection_probability = $1 location_geohash=$2 WHERE d_id=$3';
                        inserts = [infProb, locationGeohash, d_id];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 8:
                        insertResult = _a.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 9:
                        _a.sent();
                        console.log(insertResult);
                        _a.label = 10;
                    case 10: return [2 /*return*/, Promise.resolve(Result_1.default.Success({ infection_probability: infProb, success: true }))];
                    case 11:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 12:
                        client.release();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    // /**	
    // * Checks and validates username.
    // * @param {string} username - username to check
    // */
    // static async checkUsername(username:string)
    // : Promise<Result<SResponse, Error>> 
    // {
    //     let fs = FS.UsernameSettings
    //     if(!username)  return Promise.reject(Result.Failure(ERROR_RESPONSE.username.invalid))
    //     //trim down spaces
    //     username = username.trim().toLowerCase();
    //     //check username length
    //     if(
    //         username.length < fs.minLength ||
    //         username.length > fs.maxLength
    //     ){
    //         return Promise.reject(Result.Failure(ERROR_RESPONSE.username.length))
    //     }else if(!fs.regex.test(username)){
    //         return Promise.reject(Result.Failure(ERROR_RESPONSE.username.format))
    //     }else{
    //         const client = await longshot.connect();
    //         try{
    //             await client.query('BEGIN')
    //             let queryText = 'SELECT username FROM user WHERE username=$1 UNION SELECT username from _business_user WHERE username=$1';
    //             let result = await client.query(queryText, [username])
    //             if(result.rows.length == 0){
    //                 return Promise.resolve(Result.Success(RESPONSE.username.available))
    //             }
    //             else{
    //                 return Promise.reject(Result.Failure((ERROR_RESPONSE.username.unavailable)))
    //             }
    //         }catch(err){
    //             console.log(err.stack)
    //             return Promise.reject(Result.Failure(ERROR_RESPONSE.username.unavailable))
    //         }finally{
    //             client.release();
    //         }
    //     }
    // }
    /**
    * Checks and validates email.
    * @param {string} email - email to check.
    */
    Helper.checkEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, client, queryText, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.EmailSettings;
                        if (!email)
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.invalid))
                                //trim down spaces
                            ];
                        //trim down spaces
                        email = email.trim().toLowerCase();
                        if (!(email.length < fs.minLength ||
                            email.length > fs.maxLength)) return [3 /*break*/, 1];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.invalid))];
                    case 1:
                        if (!!fs.regex.test(email)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.invalid))];
                    case 2: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, 8, 9]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        _a.sent();
                        queryText = 'SELECT email FROM user WHERE email=$1 UNION SELECT email from _business_user WHERE email=$1';
                        return [4 /*yield*/, client.query(queryText, [email])];
                    case 6:
                        result = _a.sent();
                        if (result.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.email.valid))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure((ErrorResponse_1.ERROR_RESPONSE.email.taken)))];
                        }
                        return [3 /*break*/, 9];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1.stack);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Checks and validates phone.
    * @param {string} phone - phone to check.
    */
    Helper.checkPhone = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, client, queryText, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.PhoneNumberSettings;
                        if (!phone)
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phone.invalid))
                                //check username length
                            ];
                        if (!(phone.length != fs.maxLength)) return [3 /*break*/, 1];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phone.invalid))];
                    case 1:
                        if (!!fs.regex.test(phone)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phone.invalid))];
                    case 2: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, 8, 9]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        _a.sent();
                        queryText = 'SELECT phone FROM user WHERE phone=$1 UNION SELECT phone from _business_user WHERE phone=$1';
                        return [4 /*yield*/, client.query(queryText, [phone])];
                    case 6:
                        result = _a.sent();
                        if (result.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.phone.valid))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure((ErrorResponse_1.ERROR_RESPONSE.phone.taken)))];
                        }
                        return [3 /*break*/, 9];
                    case 7:
                        err_2 = _a.sent();
                        console.log(err_2.stack);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
   * Checks and validates password.
   * @param {string} password - password to check
   * @return Result <SResponse, Error>
   */
    Helper.checkPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (password) {
                    if (password.length < fs.minLength || password.length > fs.maxLength)
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.password.length))];
                    else
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.password.valid))];
                }
                return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
            });
        });
    };
    return Helper;
}());
exports.default = Helper;
