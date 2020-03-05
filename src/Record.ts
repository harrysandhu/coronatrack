let fs = require("fs");
import UserAuthData from './Interfaces/UserAuthData';
let jwt:any = require('jsonwebtoken')
let crypto = require("crypto");
let sha256 = require("js-sha256");
let privateKey = fs.readFileSync("./security/private.key", "utf8");
let publicKey = fs.readFileSync("./security/public.key", "utf8");
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
import Symptom from './Symptom'
import {RecordInterface, Symptoms} from  './Interfaces/Interfaces'
import {SymptomState} from './SymptomState'
import {Weights} from './Weights' 



export default class Record{
    private d_id:string = "";
    private location:any = {};
    private record_datetime:Date = new Date();
    private symptoms:any = {
        cold: new Symptom({name: "Cold",weight: Weights.cold, state:SymptomState.NO}),
        cough: new Symptom({name:"Cough", weight: Weights.cough,state: SymptomState.NO}),
        fever:new Symptom({name: "Fever",weight: Weights.fever, state:SymptomState.NO}),
        bodyAche: new Symptom({name:"Body Ache",weight: Weights.bodyAche,state:SymptomState.NO}),
        breathing: new Symptom({name:"Breathing Difficulty", weight:Weights.breathing, state:SymptomState.NO})
    };
    
    static getEmptyRecord(d_id:string, date:string, location:any): Record{
        return new Record({
            d_id:d_id, 
            location:location,
            record_datetime:date,
            symptoms: {
                cold: new Symptom({name: "Cold",weight: Weights.cold, state:SymptomState.NO}),
                cough: new Symptom({name:"Cough", weight: Weights.cough,state: SymptomState.NO}),
                fever:new Symptom({name: "Fever",weight: Weights.fever, state:SymptomState.NO}),
                bodyAche: new Symptom({name:"Body Ache",weight: Weights.bodyAche,state:SymptomState.NO}),
                breathing: new Symptom({name:"Breathing Difficulty", weight:Weights.breathing, state:SymptomState.NO})
            }
            })
    }

      static isValidRI(r: any): r is RecordInterface {

        return r && r.d_id && r.record_datetime && r.location
         && r.symptoms;
    }
  
    constructor(init:RecordInterface){
        try{
            if(init){
                    Object.assign(this, init)
            }
        }catch(e){
            console.log(e.stack)
            throw ERROR_RESPONSE.INVALID_REQUEST;
        }
    }

    
}