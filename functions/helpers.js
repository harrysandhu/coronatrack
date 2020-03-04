import { RESPONSES } from "./helperConstants";
var jwt = require('jsonwebtoken')
// import { conn } from "./db";
// var mysql = require("mysql");
import { EMAIL_MIN_LENGTH, 
		EMAIL_MAX_LENGTH,
		USERNAME_MIN_LENGTH, 
		USERNAME_MAX_LENGTH,
		PASSWORD_MIN_LENGTH } from './lengthConstants'



export function verifyAuthToken(req, res, next) {
	//get the auth header value
	const authToken = req.headers["authorization"];

	if (typeof authToken !== "undefined") {
		req.token = authToken;
		console.log(req.token);
		//next middleware
		next();
	} else {
		res.json({ error: "Unauthorized.", userAuthState: false });
	}
}






export function genVerificationCode(){
	return Math.floor((Math.random() * 100000))
}

export function genRandomToken(seedText, length) {
	let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		seedText.toUpperCase() +
		"abcdefghijklmnopqrstuvwxyz" +
		seedText +
		"123456789";
	let charLength = chars.length;
	var result = "";
	for (var i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * charLength)];
	}
	return result;
}

async function getRes(error, results, fields) {
	if (error) return RESPONSES.ERR_DB_CONNECTION;

	if (results.length === 0) return RESPONSES.EMAIL_AVAILABLE;
	else if (results.length > 0) return RESPONSES.EMAIL_UNAVAILABLE;
}

function emailAvailable() {
	return RESPONSES.EMAIL_AVAILABLE;
}
function emailUnavailable() {
	return RESPONSES.EMAIL_UNAVAILABLE;
}

export async function executeQuery(sql) {
	return new Promise((resolve, reject) => {
		conn.query(sql, (error, results, fields) => {
			if (error) {
				console.log("db error at executeQuery: ", error)
				reject(RESPONSES.ERR_DB_CONNECTION);
			}

			resolve(results);
		});
	});
}

export async function checkEmailAddress(email) {
	const emailExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email.length < EMAIL_MIN_LENGTH) {
		return RESPONSES.EMAIL_LENGTH;
	} else if (!emailExpression.test(email)) {
		return RESPONSES.EMAIL_FORMAT;
	}

	console.log(email);
	let sql = "SELECT email_address FROM ?? WHERE ?? = ?";
	let inserts = ["auth", "email_address", email];
	sql = mysql.format(sql, inserts);
	try {
		let mysqlQueryResponse = await executeQuery(sql);
		if (mysqlQueryResponse.length === 0) {
			return RESPONSES.EMAIL_AVAILABLE;
		} else if (mysqlQueryResponse.length > 0) {
			return RESPONSES.EMAIL_UNAVAILABLE;
		}
	} catch (e) {
		console.log(e)
		throw e;
	}
}


/**	
 * Checks and validates username.
 * @param {string} username - username to check.
 * @optional @param {string} u_id - u_id to check for,
 * ignores this u_id in sql query.
 * 
 */
export async function checkUsername(username){
	return new Promise( async (resolve, reject) =>{

	//username regex expression
	const usernameExpression = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/
	//trim any spaces
    username = username.trim().toLowerCase()
	//min length = 2
    if(
		username.length < USERNAME_MIN_LENGTH ||
		username.length > USERNAME_MAX_LENGTH
	) {
		 console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim())
    	reject(RESPONSES.USERNAME_LENGTH)
	}
    else if(!usernameExpression.test(username)){
    	 console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim())
        reject(RESPONSES.USERNAME_FORMAT)
    }
	var sql, inserts;

	try{
		if(arguments.length == 1){
			sql = "SELECT username FROM ?? WHERE ?? = ?"
			inserts = ['users', 'username', username]
			sql = mysql.format(sql, inserts)
			let mysqlQueryResponse = await executeQuery(sql)
			if(mysqlQueryResponse.length === 0){
				resolve(RESPONSES.USERNAME_AVAILABLE)
			}else{
				 console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim())
				reject(RESPONSES.USERNAME_UNAVAILABLE)
			}
		}else if(
				arguments.length == 2 && 
				arguments[1] !== null
				){
			let u_id = arguments[1]
			sql = "SELECT username, u_id FROM ?? WHERE ?? = ?"
			inserts = ['users', 'username', username]
			sql = mysql.format(sql, inserts)
			let mysqlQueryResponse = await executeQuery(sql)
			if(mysqlQueryResponse.length === 0){
				resolve(RESPONSES.USERNAME_AVAILABLE)
			}else if(
				mysqlQueryResponse.length === 1 &&
				mysqlQueryResponse[0]['u_id'] === u_id
				){
				console.log('mysql query response object: ', mysqlQueryResponse[0])
				resolve(RESPONSES.USERNAME_AVAILABLE)
			}else{
				 console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim())
				reject(RESPONSES.USERNAME_UNAVAILABLE)
			}

		}
	}catch(e){
		console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim(), e)
		reject(RESPONSES.USERNAME_UNAVAILABLE)
	}

	})

}

// export async function checkUsername(username){
//     const usernameExpression = /^[a-z]*[-._]?[a-z]*$/
//     username = username.trim().toLowerCase()
//     if(username.length < 3)
//         return RESPONSES.USERNAME_LENGTH
//     else if(!usernameExpression.test(username)){
//         return RESPONSES.USERNAME_FORMAT
//     }

//     console.log("username Testing:", username)
//     let sql = "SELECT username FROM ?? WHERE ?? = ?"
//     let inserts = ['users', 'username', username]
//     sql = mysql.format(sql, inserts)
//     try{
//         let mysqlQueryResponse = await executeQuery(sql)
//         if(mysqlQueryResponse.length === 0){
//             return RESPONSES.USERNAME_AVAILABLE
//         }else if(mysqlQueryResponse.length > 0){
//             return RESPONSES.USERNAME_UNAVAILABLE
//         }
//     }catch(e){
// 		console.log(e)
//         return e
//     }
// }

export async function checkPassword(password) {
	 return new Promise((resolve, reject) => {
        if(password === null || password.length < 8) reject(RESPONSES.PASSWORD_LENGTH)
        else resolve(RESPONSES.SUCCESS)
    })
}


export async function jwtVerifyUser(authToken, publicKey){
	return new Promise((resolve, reject) =>{
		jwt.verify(authToken, publicKey, (err, currentUser) =>{
			if(err) reject(RESPONSES.USER_UNAUTHORIZED)
			resolve(currentUser)
		})
	})
}


