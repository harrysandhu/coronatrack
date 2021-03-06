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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var jwt = require('jsonwebtoken');
var crypto = require("crypto");
var sha256 = require("js-sha256");
var privateKey = fs.readFileSync("./security/private.key", "utf8");
var publicKey = fs.readFileSync("./security/public.key", "utf8");
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var Result_1 = __importDefault(require("./Result"));
var dbConfig_1 = require("./config/dbConfig");
var ErrorResponse_1 = require("./helper/ErrorResponse");
var Record_1 = __importDefault(require("./Record"));
var Gender_1 = require("./Gender");
var Weights_1 = require("./Weights");
var Geohash = require('ngeohash');
var User = /** @class */ (function () {
    function User(init) {
        this.d_id = "";
        this.u_id = "";
        this.age = 0;
        this.gender = Gender_1.Gender.OTHER;
        this.locationIsAllowed = false;
        this.location = {};
        try {
            if (init) {
                if (User.isValidUI(init)) {
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
    User.isValidUI = function (u) {
        return u && u.d_id && u.u_id && u.age
            && u.gender && u.location;
    };
    User.jwtVerifyUser = function (requestToken, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, jwt.verify(requestToken, publicKey, function (error, authData) {
                                if (error)
                                    throw error;
                                userData = authData;
                                console.log("userData at jwtverify: ", userData);
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException))];
                    case 4: return [2 /*return*/, Promise.resolve(Result_1.default.Success(userData))];
                }
            });
        });
    };
    User.prototype.getLatestRecord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 7]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT * from _record WHERE d_id=$1' + ' '
                            + 'ORDER BY record_datetime DESC LIMIT 1';
                        inserts = [this.d_id];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        result = _a.sent();
                        if (result.rows.length != 0) {
                            console.log(result.rows[0]);
                            // let newRec = new Record(result.rows[0]);
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: new Record_1.default(result.rows[0]), isEmptyRecord: false }))];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: Record_1.default.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord: true }))];
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException))];
                    case 6:
                        client.release();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getRecordByDate = function (dateISO) {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 7]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT * from _record WHERE d_id=$1 AND' + ' '
                            + 'DATE(record_datetime) = DATE($2) ORDER BY record_datetime DESC LIMIT 1';
                        inserts = [this.d_id, dateISO];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        result = _a.sent();
                        if (result.rows.length != 0) {
                            console.log(result.rows[0]);
                            // let newRec = new Record(result.rows[0]);
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: result.rows[0], isEmptyRecord: false }))];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: Record_1.default.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord: true }))];
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException))];
                    case 6:
                        client.release();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getAllRecords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 7]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT * from _record WHERE d_id=$1';
                        inserts = [this.d_id];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        result = _a.sent();
                        if (result.rows.length != 0) {
                            console.log(result.rows[0]);
                            // let newRec = new Record(result.rows[0]);
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: result.rows[0], isEmptyRecord: false }))];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: Record_1.default.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord: true }))];
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 6:
                        client.release();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.insertRecord = function (record, dateISO) {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, res, symptoms_1, x_1, _a, latitude, longitude, precision, locationGeohash, queryText1, inserts1, res2, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("insert record start: ", JSON.stringify({ location: record.location }));
                        return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, 10, 11]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _b.sent();
                        queryText = "INSERT INTO _record(record_datetime, d_id, location, symptoms) VALUES ($1, $2, $3, $4)";
                        inserts = [dateISO, this.d_id, JSON.stringify(record.location), JSON.stringify(record.symptoms)];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        res = _b.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 5:
                        _b.sent();
                        console.log("RESULT AT INSERTRECORD: ", res);
                        symptoms_1 = record['symptoms'];
                        x_1 = 0;
                        Object.keys(symptoms_1).map(function (symptom) {
                            x_1 += (symptoms_1[symptom]['state'] * Weights_1.Weights[symptom]);
                        });
                        _a = record.location.coords, latitude = _a.latitude, longitude = _a.longitude;
                        precision = 9;
                        locationGeohash = Geohash.encode(latitude, longitude, precision);
                        console.log("wefan\n\scojkfisaduh\n\nzxjkfsiduxzcjnkn\n\ndscizxnjk");
                        queryText1 = 'UPDATE _infection SET at_datetime = NOW(), location_geohash=$1, infection_probability=$2 WHERE d_id = $3';
                        inserts1 = [locationGeohash, x_1, this.d_id];
                        return [4 /*yield*/, client.query(queryText1, inserts1)];
                    case 6:
                        res2 = _b.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 7:
                        _b.sent();
                        console.log("RESULT AT INSERT INFEC: ", res2);
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success({ record: record, success: true }))];
                    case 8:
                        error_4 = _b.sent();
                        console.log("error at insertRecord: ", error_4);
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 10:
                        client.release();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getDId = function () {
        return this.d_id;
    };
    User.prototype.toarray = function () {
        return [
            this.d_id,
            this.u_id,
            this.age,
            this.gender,
            this.locationIsAllowed,
            this.location
        ];
    };
    User.prototype.repr = function () {
        var obj = {
            d_id: this.d_id,
            u_id: this.u_id,
            age: this.age,
            gender: this.gender,
            locationIsAllowed: this.locationIsAllowed,
            location: this.location
        };
        return obj;
    };
    User.checkIfUserExists = function (d_id) {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, res, userPayload, signOptions, authToken, successResponse, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 7]);
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT d_id, u_id, age, gender, location_is_allowed, location FROM _user WHERE d_id = $1';
                        inserts = [d_id];
                        return [4 /*yield*/, client.query(queryText, inserts)];
                    case 4:
                        res = _a.sent();
                        if (res.rows.length != 0) {
                            console.log(res.rows);
                            userPayload = res.rows[0];
                            signOptions = {
                                subject: userPayload.d_id,
                                algorithm: "RS256"
                            };
                            authToken = jwt.sign(userPayload, privateKey, signOptions);
                            console.log(authToken);
                            successResponse = {
                                authToken: authToken,
                                success: true
                            };
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(successResponse))];
                        }
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success({ success: false }))];
                    case 5:
                        error_5 = _a.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 6:
                        client.release();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.signup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, _a, latitude, longitude, precision, locationGeohash, infection_probability, queryText, inserts, insertRes, insertRes2, userPayload, signOptions, authToken, successResponse, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 9, 10]);
                        _a = this.location, latitude = _a.latitude, longitude = _a.longitude;
                        precision = 9;
                        locationGeohash = Geohash.encode(latitude, longitude, precision);
                        infection_probability = 0;
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _b.sent();
                        queryText = {
                            user: 'INSERT INTO _user(d_id, u_id, age, gender, location_is_allowed, location, signup_datetime)' + ' ' +
                                'VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                            infection: 'INSERT INTO _infection(d_id, location_geohash, infection_probability, at_datetime) VALUES ($1, $2, $3, NOW() )'
                        };
                        inserts = {
                            user: this.toarray(),
                            infection: [this.d_id, locationGeohash, infection_probability]
                        };
                        return [4 /*yield*/, client.query(queryText.user, inserts.user)];
                    case 4:
                        insertRes = _b.sent();
                        return [4 /*yield*/, client.query(queryText.infection, inserts.infection)];
                    case 5:
                        insertRes2 = _b.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 6:
                        _b.sent();
                        userPayload = this.repr();
                        signOptions = {
                            subject: this.d_id,
                            algorithm: "RS256"
                        };
                        authToken = jwt.sign(userPayload, privateKey, signOptions);
                        console.log(authToken);
                        successResponse = {
                            authToken: authToken,
                            success: true
                        };
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success(successResponse))];
                    case 7:
                        error_6 = _b.sent();
                        console.log("error at user signup", error_6);
                        return [4 /*yield*/, client.query("ROLLBACK")];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 9:
                        client.release();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
// INSERT INTO _record(record_datetime, d_id, location, symptoms) VALUES(NOW(), '0E1B0311-6950-4D8B-8AF4-D1BC94DC3478', '{	"location": {
//     "coords": {
//       "speed": -1,
//       "heading": -1,
//       "accuracy": 5,
//       "altitude": 0,
//       "latitude": 37.785834,
//       "longitude": -122.406417,
//       "altitudeAccuracy": -1
//     },
//     "timestamp": 1583362321134.426
//   }}', '{	"symptoms":{
//   "fever": {
//     "name": "Fever",
//     "weight": 12.5,
//     "state": 2
//   },
//   "cold": {
//     "name": "Cold",
//     "weight": 15,
//     "state": 2
//   },
//   "cough": {
//     "name": "Cough",
//     "weight": 12.5,
//     "state": 2
//   },
//   "breathing": {
//     "name": "Breathing Difficulty",
//     "weight": 8,
//     "state": 0
//   },
//   "bodyAche": {
//     "name": "Body Ache",
//     "weight": 2,
//     "state": 0
//   }
// }}')
