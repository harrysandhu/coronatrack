import {Pool, Client} from 'pg';
import fs from 'fs'

let connections = {
    firestar : 'host=firestar.postgres.database.azure.com port=5432 dbname=hasettDev user=firestar_user@firestar password=@./%_1ab@psql1 sslmode=require'
}



export const firepool = new Pool({
    user : 'harryxsandhu',
    password : 'gxbxmfy039gdph44',
    host : 'firestore-x-1-do-user-1754324-0.db.ondigitalocean.com',
    port : 25060,
    database : 'firestoredb',
    ssl : true
})


export const longshot = new Pool({
    user: "longshot69",
    password: "Harry1032.",
    host: "longshot1.caxc13yttpfm.us-east-2.rds.amazonaws.com",
    port: 5432,
    database: "longshotdb",
    ssl: true,
    idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})


async function xs(username:string, uId?:string){
 try{
    const client = await longshot.connect();
    console.log("tyooo")
        try{
            await client.query('BEGIN')
            const queryText = 'SELECT current_date'
            const res = await client.query(queryText)
            //select so no need to commi t;
            console.log(res.rows)
        }catch(e){
            await client.query('ROLLBACK');
            console.log(e)
        }finally{
            client.release()
        }
    }catch(e){
        console.log(e)
    }
}

console.log("helo")
xs("saf", "fsa")


/*

// user's personal account
    _user
----------------
    
    user_id
    name
    username
    email_address
    phone_number
    phone_number_ext
    location_id
    current_location
    is_business_user
    profile_pic_url
    email_is_verified
    phone_is_verified


    //auth
    ------------
        _auth
    ------------
    user_id
    auth_id
    password_hash
    salt
    user_id -> _user(user_id)



    //business account
    ------------
        _business_user
    ------------
    user_id
    business_id
    business_name
    business_phones {}
    business_email



  


 */


 /**
    
 
 
  */

