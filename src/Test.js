"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test = /** @class */ (function () {
    function Test() {
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
    }
    Test.isBI = function (xx) {
        //return xx && xx.b_id && xx.email;
        return xx && xx.b_id && xx.email && xx.name && xx.username && xx.phone && xx.phone_ext && xx.profile_pic_url && typeof (xx.email_is_verified) === "boolean" && typeof (xx.phone_is_verified) === "boolean";
    };
    return Test;
}());
