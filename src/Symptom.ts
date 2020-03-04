let fs = require("fs");
import UserAuthData from './Interfaces/UserAuthData';
let jwt:any = require('jsonwebtoken')
let crypto = require("crypto");
let sha256 = require("js-sha256");
// let privateKey = fs.readFileSync("./security/private.key", "utf8");
// let publicKey = fs.readFileSync("./security/public.key", "utf8");
let RESPONSES:any = require('../functions/helperConstants').RESPONSES;
import Result from './Result'
import AuthResponse from './Interfaces/AuthResponse'
import Error from './Interfaces/Error'
import SResponse from './Interfaces/SResponse'
import CategoryResult from './Interfaces/CategoryResult'
import * as FS from "./settings/FieldSettings"

import {longshot, firepool} from './config/dbConfig'
import {ERROR_RESPONSE} from './helper/ErrorResponse'
import {RESPONSE} from './helper/Response'
import User from './User'

import {RecordInterface, Symptoms, SymptomInterface} from  './Interfaces/Interfaces'
import {SymptomState} from './SymptomState'


export default class Symptom{
    private name:string = "";
    private weight:number = 0;
    private state:SymptomState = SymptomState.NO;

    constructor(init:SymptomInterface) {
        Object.assign(this, init)
    }

    

    
}   


