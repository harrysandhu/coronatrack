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
import Record from './Record'
import {UserInterface} from  './Interfaces/Interfaces'
import {Gender} from './Gender'


export default class User {

    private d_id:string = "";
    private u_id:string = "";
    private age:number = 0;
    private gender:Gender = Gender.OTHER;
    private locationIsAllowed:boolean = false;
    private location:any = {};

    static isValidUI(u: any): u is UserInterface {

        return u && u.d_id && u.u_id && u.age
         && u.gender && u.location
         && typeof(u.locationIsAllowed) === "boolean";
    }


        constructor(init:UserInterface){
            try{
                if(init){
                    if(User.isValidUI(init)){
                        Object.assign(this, init)
                    }else{
                        throw ERROR_RESPONSE.INVALID_REQUEST;
                    }
                }
            }catch(e){
                console.log(e.stack)
                throw ERROR_RESPONSE.INVALID_REQUEST;
            }
        }


    static async jwtVerifyUser(requestToken:string, publicKey:string): Promise<Result<any, Error>>{
        let userData:any = {}
        try{
             await jwt.verify(requestToken, publicKey, (error:any, authData:any): any =>{
                
                if(error) throw error;
                  userData = authData;
                  console.log("userData at jwtverify: ", userData)
            })
        } catch(e){
            console.log(e);
            return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException));
        }

        return Promise.resolve(Result.Success(userData))
    }



    async getRecordByDate(cdate:string): Promise<Result<any, Error>>{
        const client = await longshot.connect();

        try{
            await client.query('BEGIN')
            let queryText = 'SELECT * from _record WHERE d_id=$1 AND' + ' ' 
                            +'DATE(record_datetime) = DATE($2) ORDER BY record_datetime DESC LIMIT 1';
            let inserts = [this.d_id, cdate]
            let result = await client.query(queryText, inserts)
            if(result.rows.length != 0){
                console.log(result.rows[0])
                // let newRec = new Record(result.rows[0]);
                return Promise.resolve(Result.Success({record:result.rows[0]}))
            }else{
                return Promise.resolve(Result.Success({record:Record.getEmptyRecord(this.d_id, cdate, this.location)}))
            }
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException))
        }
    }

    async getAllRecords(): Promise<Result<any, Error>>{
           const client = await longshot.connect();

        try{
            await client.query('BEGIN')
            let queryText = 'SELECT * from _record WHERE d_id=$1';
            let inserts = [this.d_id]
            let result = await client.query(queryText, inserts)
            if(result.rows.length != 0){
                console.log(result.rows[0])
                // let newRec = new Record(result.rows[0]);
                return Promise.resolve(Result.Success({record:result.rows}))
            }else{
                return Promise.resolve(Result.Success({record:Record.getEmptyRecord(this.d_id, "", this.location)}))
            }
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException))
        }
    }

    getDId(){
        return this.d_id;
    }

    toarray(): any{
        return [
            this.d_id,
            this.u_id,
            this.age,
            this.gender,
            this.locationIsAllowed,
            this.location
        ]
    }

    repr(): UserInterface{
        let obj:any = {
            d_id:this.d_id,
            u_id:this.u_id,
            age:this.age,
            gender:this.gender,
            locationIsAllowed:this.locationIsAllowed,
            location:this.location
        }
       return obj;
    }

    static async checkIfUserExists(d_id:string) :  Promise<Result<any, Error>>{
        const client = await longshot.connect();

        try{
            await client.query("BEGIN")
            let queryText = 'SELECT d_id, u_id, age, gender, location_is_allowed, location FROM _user WHERE d_id = $1';
            let inserts = [d_id];
            let res = await client.query(queryText, inserts);
            if(res.rows.length != 0){
                console.log(res.rows);

            let userPayload:UserInterface = res.rows[0]
            let signOptions = {
                subject: userPayload.d_id,
                algorithm: "RS256"
            }
            let authToken = jwt.sign(userPayload, privateKey, signOptions)

            console.log(authToken)
            let successResponse = <AuthResponse>{
                authToken:authToken,
                success:true
            }
             return Promise.resolve(Result.Success(successResponse))
            }
            return Promise.resolve(Result.Success({success:false}))
        }catch(error){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release();
        }
    }

    async signup() : Promise<Result<AuthResponse, Error>>{
        const client = await longshot.connect();

        try{
            await client.query("BEGIN")
            let queryText = {
                user: 'INSERT INTO _user(d_id, u_id, age, gender, location_is_allowed, location signup_datetime)' + ' '+
                        'VALUES ($1, $2, $3, $4, $5, $6, NOW())'
            }

            let inserts = {
                user: this.toarray()
            }

            let insertRes = await client.query(queryText.user, inserts.user)
            await client.query("COMMIT");
            
            let userPayload = this.repr();
            let signOptions = {
                subject: this.d_id,
                algorithm: "RS256"
            }
            let authToken = jwt.sign(userPayload, privateKey, signOptions)

            console.log(authToken)
            let successResponse = <AuthResponse>{
                authToken:authToken,
                success:true
            }
             return Promise.resolve(Result.Success(successResponse))
        }
        catch(error){
            console.log("error at user signup", error)
            await client.query("ROLLBACK")
            return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release();
        }
    }
    
}





