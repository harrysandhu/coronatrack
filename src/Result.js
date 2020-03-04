"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result = /** @class */ (function () {
    function Result(success, error, isError) {
        this.success = success;
        this.error = error;
        this.isError = isError;
    }
    Result.Success = function (successObject) {
        return new Result(successObject, null, false);
    };
    Result.Failure = function (errorObject) {
        return new Result(null, errorObject, true);
    };
    ;
    Result.prototype.get = function () {
        return ((!this.isError) ? this.success : this.error);
    };
    return Result;
}());
exports.default = Result;
