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
Object.defineProperty(exports, "__esModule", { value: true });
exports.longshot = exports.firepool = void 0;
var pg_1 = require("pg");
var connections = {
    firestar: 'host=firestar.postgres.database.azure.com port=5432 dbname=hasettDev user=firestar_user@firestar password=@./%_1ab@psql1 sslmode=require'
};
exports.firepool = new pg_1.Pool({
    user: 'harryxsandhu',
    password: 'gxbxmfy039gdph44',
    host: 'firestore-x-1-do-user-1754324-0.db.ondigitalocean.com',
    port: 25060,
    database: 'firestoredb',
    ssl: true
});
exports.longshot = new pg_1.Pool({
    user: "longshot69",
    password: "Harry1032.",
    host: "longshot1.caxc13yttpfm.us-east-2.rds.amazonaws.com",
    port: 5432,
    database: "longshotdb",
    ssl: true,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
function xs(username, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, queryText, res, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, exports.longshot.connect()];
                case 1:
                    client = _a.sent();
                    console.log("tyooo");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 7, 8]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    _a.sent();
                    queryText = 'SELECT current_date';
                    return [4 /*yield*/, client.query(queryText)
                        //select so no need to commi t;
                    ];
                case 4:
                    res = _a.sent();
                    //select so no need to commi t;
                    console.log(res.rows);
                    return [3 /*break*/, 8];
                case 5:
                    e_1 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 6:
                    _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 8];
                case 7:
                    client.release();
                    return [7 /*endfinally*/];
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
console.log("helo");
xs("saf", "fsa");
/*

// user's personal account
    _user
----------------
    
    user_id
    name
    username
    email_address
    phone_number
    phone_number_ext
    location_id
    current_location
    is_business_user
    profile_pic_url
    email_is_verified
    phone_is_verified


    //auth
    ------------
        _auth
    ------------
    user_id
    auth_id
    password_hash
    salt
    user_id -> _user(user_id)



    //business account
    ------------
        _business_user
    ------------
    user_id
    business_id
    business_name
    business_phones {}
    business_email



  


 */
/**
   


 */
