import {Gender} from '../Gender'
import Symptom from '../Symptom'
import {SymptomState} from '../SymptomState'


export interface BusinessUserInterface{
    b_id:string;
    email:string;
    name:string;
    username:string;
    phone:string;
    phone_ext:string;
    profile_pic_url:string;
    u_id:string;
    email_is_verified:boolean;
    phone_is_verified:boolean;
}



export interface UserInterface{
    d_id:string;
    u_id:string;
    age:number;
    gender:Gender;
    locationIsAllowed:boolean;
}


export interface Symptoms{
    data: {
        [name:string]: Symptom
    }
}


export interface SymptomInterface{
    name:string;
    weight:number;
    state:SymptomState;
}


export interface RecordInterface{
    recordDateTime:Date;
    symptoms:Symptoms;
}