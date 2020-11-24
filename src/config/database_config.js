"use strict";
// import {Pool, Client} from 'pg'
// import fs from 'fs'
// export const longshot = new Pool({
//     user: "longshot69",
//     password: "mi1dsas4dp92zzv2",
//     host: "longshot-cluster-do-user-1754324-0.b.db.ondigitalocean.com",
//     port: 25060,
//     database: "longshotdevdb",
//     ssl: true
// })
// //  postgresql://longshot420:YkqW8ThBtNOlqRAUv2eW@longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com:5230/longshotdevdb
// test_db('fewsa', 'g');
// async function test_db(username:string, uId?:string){
//     console.log("starting")
//  if(uId){
//     const client = await longshot.connect();
//  console.log("here")
//         try{
//             await client.query('BEGIN')
//             const queryText = 'SELECT current_date'
//             const res = await client.query(queryText)
//             //select so no need to commi t;
//             console.log(res.rows)
//         }catch(e){
//             await client.query('ROLLBACK');
//             console.log(e)
//         }finally{
//             client.release()
//         }
//     }else console.log("he")
// }
var Pool = require('pg-pool');
var pool2 = new Pool({
    user: "longshot69",
    password: "Harry1032.",
    host: "longshot1.caxc13yttpfm.us-east-2.rds.amazonaws.com",
    port: 5432,
    database: "longshotdb",
    ssl: true
});
pool2.connect().then(function (client) {
    client.query('select $1::text as name', ['pg-pool']).then(function (res) {
        client.release();
        console.log('hello from', res.rows[0].name);
    })
        .catch(function (e) {
        client.release();
        console.error('query error', e.message, e.stack);
    });
});
