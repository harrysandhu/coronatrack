import {Pool, Client} from 'pg'

export const longshot = new Pool({
    user: "longshot420",
    password: "YkqW8ThBtNOlqRAUv2eW",
    host: "longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com",
    port: 5230,
    database: "longshotdevdb"
})

//  postgresql://longshot420:YkqW8ThBtNOlqRAUv2eW@longshot-dev-db.c8nz7hvudrch.us-west-2.rds.amazonaws.com:5230/longshotdevdb

test_db('fewsa', 'g');

async function test_db(username:string, uId?:string){
    console.log("starting")
 if(uId){
    const client = await longshot.connect();
   
 console.log("here")
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
