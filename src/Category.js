"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var jwt = require('jsonwebtoken');
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var Result_1 = __importDefault(require("./Result"));
var FS = __importStar(require("./settings/FieldSettings"));
var dbConfig_1 = require("./config/dbConfig");
var ErrorResponse_1 = require("./helper/ErrorResponse");
var Category = /** @class */ (function () {
    function Category(categoryName) {
        var fs = FS.CategorySettings;
        categoryName = categoryName.trim().toLowerCase();
        if (categoryName.length < fs.minLength || categoryName.length > fs.maxLength) {
            throw ErrorResponse_1.ERROR_RESPONSE.category.invalid;
        }
        else if (!fs.regex.test(categoryName)) {
            throw ErrorResponse_1.ERROR_RESPONSE.category.invalid;
        }
        this.categoryName = categoryName;
        this.categoryWeight = 0;
    }
    /**
    * Gets the categories that are LIKE the keyword category.
    * @param keyword the reference category.
    * @return CategoryResult Category[] the list of related categories.
    */
    Category.getRelatedCategories = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, client, queryText, res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.CategorySettings;
                        keyword = keyword.trim().toLowerCase();
                        if (!fs.regex.test(keyword)) {
                            throw ErrorResponse_1.ERROR_RESPONSE.category.invalid;
                        }
                        return [4 /*yield*/, dbConfig_1.firepool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, 6, 7]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        queryText = 'SELECT categoryId, categoryName, categoryWeight FROM category WHERE LOWER(categoryName) LIKE $1 ORDER BY categoryWeight, categoryName';
                        return [4 /*yield*/, client.query(queryText, ['%' + keyword + '%'])];
                    case 4:
                        res = _a.sent();
                        console.log(res.rows);
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success({ "data": res.rows }))];
                    case 5:
                        e_1 = _a.sent();
                        console.log("Exception:", e_1);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.category.invalid))];
                    case 6:
                        client.release();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates new category.
     * @param keyword the category to create.
     * @return Category object.
     */
    Category.createCategory = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var client, newCategory, queryText, res, selectQueryText, selectRes, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.firepool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, 9, 10]);
                        newCategory = new Category(keyword);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        queryText = 'INSERT INTO Category (categoryName, categoryWeight) VALUES ($1, $2)';
                        return [4 /*yield*/, client.query(queryText, [newCategory.categoryName, newCategory.categoryWeight])];
                    case 4:
                        res = _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 5:
                        _a.sent();
                        selectQueryText = 'SELECT * FROM Category WHERE categoryName = $1';
                        return [4 /*yield*/, client.query(selectQueryText, [newCategory.categoryName])];
                    case 6:
                        selectRes = _a.sent();
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success({ "data": selectRes.rows[0] }))];
                    case 7:
                        e_2 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 8:
                        _a.sent();
                        console.log("Exception:", e_2);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.category.invalid))];
                    case 9:
                        client.release();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return Category;
}());
exports.default = Category;
