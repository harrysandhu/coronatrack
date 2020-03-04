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
var BusinessUser = /** @class */ (function () {
    function BusinessUser(init) {
        this.b_id = "";
        this.email = "";
        this.name = "";
        this.username = "";
        this.phone = "";
        this.phone_ext = "";
        this.password_hash = "";
        this.salt = "";
        this.profile_pic_url = "";
        this.email_is_verified = false;
        this.phone_is_verified = false;
        this.u_id = "";
        try {
            if (init) {
                if (BusinessUser.isValidBI(init)) {
                    Object.assign(this, init);
                }
                else {
                    throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
                }
            }
            else {
                throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
            }
        }
        catch (err) {
            console.log(err);
            throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
        }
    }
    BusinessUser.isValidBI = function (xx) {
        //return xx && xx.b_id && xx.email;
        return xx && xx.b_id && xx.u_id && xx.email && xx.name && xx.username && xx.phone && xx.phone_ext && xx.profile_pic_url && typeof (xx.email_is_verified) === "boolean" && typeof (xx.phone_is_verified) === "boolean";
    };
    BusinessUser.prototype.setpassword = function (p, s) {
        this.password_hash = p;
        this.salt = s;
    };
    BusinessUser.prototype.toarray = function () {
        return [
            this.b_id,
            this.name,
            this.email,
            this.username,
            this.phone,
            this.phone_ext,
            this.profile_pic_url,
            this.email_is_verified,
            this.phone_is_verified,
            this.u_id
        ];
    };
    BusinessUser.prototype.repr = function () {
        return {
            b_id: this.b_id,
            name: this.name,
            email: this.email,
            username: this.username,
            phone: this.phone,
            phone_ext: this.phone_ext,
            profile_pic_url: this.profile_pic_url,
            email_is_verified: this.email_is_verified,
            phone_is_verified: this.phone_is_verified,
            u_id: this.u_id
        };
    };
    BusinessUser.prototype.signup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, queryText, inserts, userInsertResult, authInsertResult, buserAuthPayload, signOptions, authToken, successResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.longshot.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, 10, 11]);
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _a.sent();
                        queryText = {
                            user: "INSERT INTO _business_user(b_id, name, email, username, phone, phone_ext, profile_pic_url, email_is_verified, phone_is_verified, signup_datetime, u_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)",
                            auth: "INSERT INTO auth(auth_id, password_hash, salt) VALUES($1, $2, $3)"
                        };
                        inserts = {
                            user: this.toarray(),
                            auth: [this.u_id, this.password_hash, this.salt]
                        };
                        return [4 /*yield*/, client.query(queryText.user, inserts.user)];
                    case 4:
                        userInsertResult = _a.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, client.query(queryText.auth, inserts.auth)];
                    case 6:
                        authInsertResult = _a.sent();
                        return [4 /*yield*/, client.query("COMMIT")];
                    case 7:
                        _a.sent();
                        buserAuthPayload = this.repr();
                        signOptions = {
                            subject: this.b_id,
                            algorithm: "RS256"
                        };
                        authToken = jwt.sign(buserAuthPayload, privateKey, signOptions);
                        //--------LOG-------//
                        console.log(authToken);
                        console.log(buserAuthPayload);
                        successResponse = {
                            authToken: authToken,
                            success: true
                        };
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success(successResponse))];
                    case 8:
                        error_1 = _a.sent();
                        console.log("Error at BUser.signup :: ", error_1);
                        return [4 /*yield*/, client.query("ROLLBACK")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, Promise.reject(ErrorResponse_1.ERROR_RESPONSE.ERR_SYS)];
                    case 10:
                        client.release();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return BusinessUser;
}());
exports.default = BusinessUser;
