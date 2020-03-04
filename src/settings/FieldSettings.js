"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameSettings = {
    name: "username",
    minLength: 3,
    maxLength: 15,
    regex: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/
};
exports.EmailSettings = {
    name: "emailAddress",
    minLength: 4,
    maxLength: 320,
    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
};
exports.PasswordSettings = {
    name: "password",
    minLength: 8,
    maxLength: 100,
    regex: null
};
exports.CategorySettings = {
    name: "category",
    minLength: 1,
    maxLength: 50,
    regex: /^[A-Za-z]+$/
};
exports.PhoneNumberSettings = {
    name: "phone",
    minLength: 10,
    maxLength: 10,
    regex: /^[0-9]*$/
};
