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
var Gender_1 = require("./Gender");
var User = /** @class */ (function () {
    function User(init) {
        this.d_id = "";
        this.u_id = "";
        this.age = 0;
        this.gender = Gender_1.Gender.OTHER;
        this.locationIsAllowed = false;
        this.location = {};
        this.infectionProbability = 0;
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
            && u.gender
            && typeof (u.locationIsAllowed) === "boolean";
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
    /*
     private d_id:string = "";
        private u_id:string = "";
        private age:number = 0;
        private gender:Gender = Gender.OTHER;
        private locationIsAllowed:boolean = false;
        private location:any = {};
        private infectionProbability:number = 0;*/
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
            this.location,
            this.infectionProbability
        ];
    };
    User.prototype.repr = function () {
        var obj = {
            d_id: this.d_id,
            u_id: this.u_id,
            age: this.age,
            gender: this.gender,
            locationIsAllowed: this.locationIsAllowed,
            location: this.location,
            infectionProbability: this.infectionProbability
        };
        return obj;
    };
    User.checkIfUserExists = function (d_id) {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, res, userPayload, signOptions, authToken, successResponse, error_1;
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
                        queryText = 'SELECT d_id, u_id, age, gender, location_is_allowed, location, infection_probability FROM _user WHERE d_id = $1';
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
                        error_1 = _a.sent();
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
            var client, queryText, inserts, insertRes, userPayload, signOptions, authToken, successResponse, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 9]);
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _a.sent();
                        queryText = {
                            user: 'INSERT INTO _user(d_id, u_id, age, gender, location_is_allowed, location, infection_probability, signup_datetime)' + ' ' +
                                'VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())'
                        };
                        inserts = {
                            user: this.toarray()
                        };
                        return [4 /*yield*/, client.query(queryText.user, inserts.user)];
                    case 4:
                        insertRes = _a.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 5:
                        _a.sent();
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
                    case 6:
                        error_2 = _a.sent();
                        console.log("error at user signup", error_2);
                        return [4 /*yield*/, client.query("ROLLBACK")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS))];
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
// static async signup(user:any) : Promise<Result<AuthResponse, Error>>{
//     const client = await firepool.connect();
//     try{
//         await client.query("BEGIN");
//         //Insert into _user
//         /*
//             user_id,
//             name,
//             email_address,
//             phone_number,
//             is_business_user,
//             email_is_verified false,
//             phone_is_verified true
//         */
//         /*
//             auth_id,
//             user_id,
//             password_hash,
//             salt
//          */
//         let queryTextUser = "INSERT INTO _user (user_id, name, email_address, phone_number, is_business_user, email_is_verified, phone_is_verified, signup_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())";
//         let userInserts = [
//                         user.user_id, user.name, user.emailAddress,
//                         user.phone_number, user.isBusinessUser,
//                         user.emailIsVerified, user.phoneIsVerified
//                     ];
//         let userInsertResult = await client.query(queryTextUser, userInserts);
//         await client.query("COMMIT");
//         let queryTextAuth = "INSERT INTO _auth (auth_id, user_id, password_hash, salt) VALUES ($1, $2, $3, $4)"
//         let authInserts = [
//                             user.auth_id, user.user_id, user.password_hash, user.salt
//                             ];
//         let authInsertsResults = await client.query(queryTextAuth, authInserts);
//         await client.query("COMMIT");
//         let userAuthPayload = {
//             auth_id: user.auth_id,
//             user_id: user.user_id,
//             name: user.name,
//             email_address: user.email_address,
//             isBusinessUser: user.isBusinessUser
//         }
//         	//TODO: jwt sign options
// 			let signOptions = {	
// 				subject: user.user_id,
// 				algorithm: "RS256"
// 			}
//             let authToken = jwt.sign(userAuthPayload, privateKey, signOptions)
//             	//--------LOG-------//
// 			console.log(authToken)
// 			console.log(userAuthPayload)
//             let successResponse = <AuthResponse>{
//                 authToken :authToken,
//                 success:true
//             }
//              return Promise.resolve(Result.Success(successResponse))
//     }catch(error){
//         console.log("Error at User.signup :: ", error)
//         await client.query("ROLLBACK");
//         return Promise.reject(ERROR_RESPONSE.ERR_SYS)
//     }finally{
//                 client.release();
//             }
// }
