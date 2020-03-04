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
var pg_1 = require("pg");
exports.longshot = new pg_1.Pool({
    user: "longshot420",
    password: "YkqW8ThBtNOlqRAUv2eW",
    host: "longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com",
    port: 5230,
    database: "longshotdevdb"
});
//  postgresql://longshot420:YkqW8ThBtNOlqRAUv2eW@longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com:5230/longshotdevdb
test_db('fewsa', 'g');
function test_db(username, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, queryText, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("starting");
                    if (!uId) return [3 /*break*/, 9];
                    return [4 /*yield*/, exports.longshot.connect()];
                case 1:
                    client = _a.sent();
                    console.log("here");
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
                    console.log("he");
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
