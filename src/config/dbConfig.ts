import {Pool, Client} from 'pg';

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
    password: "mi1dsas4dp92zzv2",
    host: "longshot-cluster-do-user-1754324-0.b.db.ondigitalocean.com",
    port: 5230,
    database: "longshotdevdb"
})

// export const longshot = new Pool({
//     user: "longshot420",
//     password: "YkqW8ThBtNOlqRAUv2eW",
//     host: "longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com",
//     port: 5230,
//     database: "longshotdevdb"
// })

//  postgresql://longshot420:YkqW8ThBtNOlqRAUv2eW@longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com:5230/longshotdevdb


//postgresql://harryxsandhu:gxbxmfy039gdph44@firestore-x-1-do-user-1754324-0.db.ondigitalocean.com:25060/firestoredb?sslmode=require


// // get latest timehash and create after every 60 mins
// export var timelong = 2;


// getTimeHash();


// export async function getTimeHash(){
//     setTimeout(() => {
//        timelong = timelong + 3;
//        console.log(timelong);
//     }, 300);
// }




//
async function x(username:string, uId?:string){
 if(uId){
    const client = await longshot.connect();

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
    }else console.log("he")
}




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


 postgresql://longshot420:YkqW8ThBtNOlqRAUv2eW@longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com:5230/longshotdevdb