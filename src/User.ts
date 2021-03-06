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
import {UserInterface, RecordInterface} from  './Interfaces/Interfaces'
import {Gender} from './Gender'

import {Weights} from './Weights' 
var Geohash = require('ngeohash');
import {SymptomState} from './SymptomState'


export default class User {

    private d_id:string = "";
    private u_id:string = "";
    private age:number = 0;
    private gender:Gender = Gender.OTHER;
    private locationIsAllowed:boolean = false;
    private location:any = {};

    static isValidUI(u: any): u is UserInterface {

        return u && u.d_id && u.u_id && u.age
         && u.gender && u.location;
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

  async getLatestRecord(): Promise<Result<any, Error>>{
        const client = await longshot.connect();

        try{
            await client.query('BEGIN')
            let queryText = 'SELECT * from _record WHERE d_id=$1' + ' ' 
                            +'ORDER BY record_datetime DESC LIMIT 1';
            let inserts = [this.d_id]
            let result = await client.query(queryText, inserts)
            if(result.rows.length != 0){
                console.log(result.rows[0])
                // let newRec = new Record(result.rows[0]);
                return Promise.resolve(Result.Success({record:new Record(result.rows[0]),  isEmptyRecord:false}))
            }else{
                return Promise.resolve(Result.Success({record:Record.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord:true }))
            }
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException))
        }finally{
            client.release()
        }
    }

    async getRecordByDate(dateISO:string): Promise<Result<any, Error>>{
        const client = await longshot.connect();

        try{
            await client.query('BEGIN')
            let queryText = 'SELECT * from _record WHERE d_id=$1 AND' + ' ' 
                            +'DATE(record_datetime) = DATE($2) ORDER BY record_datetime DESC LIMIT 1';
            let inserts = [this.d_id, dateISO]
            let result = await client.query(queryText, inserts)
            if(result.rows.length != 0){
                console.log(result.rows[0])
                // let newRec = new Record(result.rows[0]);
                return Promise.resolve(Result.Success({record:result.rows[0],  isEmptyRecord:false}))
            }else{
                return Promise.resolve(Result.Success({record:Record.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord:true }))
            }
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException))
        }finally{
            client.release()
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
                return Promise.resolve(Result.Success({record:result.rows[0],  isEmptyRecord:false}))
            }else{
                return Promise.resolve(Result.Success({record:Record.getEmptyRecord(this.d_id, "", this.location), isEmptyRecord:true }))
            }
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release()
        }
    }

    async insertRecord(record:RecordInterface, dateISO:string) : Promise<Result<any, Error>>{
        console.log("insert record start: ", JSON.stringify({location:record.location}))
        const client = await longshot.connect()
        try{
            await client.query('BEGIN')
            let queryText = "INSERT INTO _record(record_datetime, d_id, location, symptoms) VALUES ($1, $2, $3, $4)";
            let inserts = [dateISO, this.d_id, JSON.stringify(record.location), JSON.stringify(record.symptoms)]
            let res = await client.query(queryText, inserts)
              await client.query("COMMIT");
            console.log("RESULT AT INSERTRECORD: ", res)
            
            let symptoms = record['symptoms']
            let x = 0;
             Object.keys(symptoms).map((symptom) =>{
            x += (symptoms[symptom]['state'] * Weights[symptom])
            })
            
            let {latitude, longitude } = record.location.coords
            let precision = 9;
            let locationGeohash = Geohash.encode(latitude, longitude, precision);
            console.log("wefan\n\scojkfisaduh\n\nzxjkfsiduxzcjnkn\n\ndscizxnjk")

            let queryText1 = 'UPDATE _infection SET at_datetime = NOW(), location_geohash=$1, infection_probability=$2 WHERE d_id = $3';
            let inserts1 = [locationGeohash, x, this.d_id];
            
            // let queryText1 = 'INSERT INTO _infection(d_id, location_geohash, infection_probability, at_datetime) VALUES ($1, $2, $3, NOW() )';

            let res2 = await client.query(queryText1, inserts1)
             await client.query("COMMIT");
            console.log("RESULT AT INSERT INFEC: ", res2)
            return Promise.resolve(Result.Success({record:record, success:true}))
        }catch(error){
            console.log("error at insertRecord: ", error)
            await client.query('ROLLBACK')
             return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release()
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

            let {latitude, longitude } = this.location;
            let precision = 9;
            let locationGeohash = Geohash.encode(latitude, longitude, precision);
            let infection_probability = 0;


            await client.query("BEGIN")
            let queryText = {
                user: 'INSERT INTO _user(d_id, u_id, age, gender, location_is_allowed, location, signup_datetime)' + ' '+
                        'VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                infection:  'INSERT INTO _infection(d_id, location_geohash, infection_probability, at_datetime) VALUES ($1, $2, $3, NOW() )'
            }


            let inserts = {
                user: this.toarray(),
                infection: [this.d_id, locationGeohash, infection_probability]
            }

            let insertRes = await client.query(queryText.user, inserts.user)
            let insertRes2 = await client.query(queryText.infection, inserts.infection)
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












// INSERT INTO _record(record_datetime, d_id, location, symptoms) VALUES(NOW(), '0E1B0311-6950-4D8B-8AF4-D1BC94DC3478', '{	"location": {
//     "coords": {
//       "speed": -1,
//       "heading": -1,
//       "accuracy": 5,
//       "altitude": 0,
//       "latitude": 37.785834,
//       "longitude": -122.406417,
//       "altitudeAccuracy": -1
//     },
//     "timestamp": 1583362321134.426
//   }}', '{	"symptoms":{
//   "fever": {
//     "name": "Fever",
//     "weight": 12.5,
//     "state": 2
//   },
//   "cold": {
//     "name": "Cold",
//     "weight": 15,
//     "state": 2
//   },
//   "cough": {
//     "name": "Cough",
//     "weight": 12.5,
//     "state": 2
//   },
//   "breathing": {
//     "name": "Breathing Difficulty",
//     "weight": 8,
//     "state": 0
//   },
//   "bodyAche": {
//     "name": "Body Ache",
//     "weight": 2,
//     "state": 0
//   }
// }}')