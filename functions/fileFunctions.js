
var fs = require('fs')
import { RESPONSES, BASE_DEV } from "./helperConstants";
var path = require('path')

/**
 * Converts the base64 string to image
 * and saves it to "users/u_id/profile/filename.ext"
 *
 *@param {String} u_id - user id
 *@param {String} filename - randomly generated filename
 *@param {String} imageData - base64 image
 *@returns {String} photo url.
 * 
 * 
 *
 *@example
 *  saveImage("user123", "myfile", "data:image/jpeg;randomstr")
 *@outputs http://localhost:4040/media/user123/profile/myfile.jpg
 * saves to /users/user123/profile/myfile.jpg
 */




function decodeBase64Image(dataString){
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if(matches === null || matches.length !== 3){
        return RESPONSES.IMAGE_UPLOAD_ERROR
    }

    response.type = matches[0]
    response.data = new Buffer(matches[2], 'base64')
    return response
}




/**
 * Decodes base64 data string to a jpg or png image,
 * and saves the image.
 * @param {string} u_id - user id to uniquely identify the directory.
 * @param {string} filename - randomly generated filename to uniquely identify the image.
 * @param {string} imageData - base64 data string.
 *
 * @returns {Object} {`boolean`, `string`} - on success- {errorStatus: false, imageURI}
 */
export async function saveImage(u_id, filename, imageData){

    return new Promise(async (resolve, reject) =>{
       // var ext = imageData.substring(11, imageData.indexOf(";base64")).toLowerCase()
        var imageBuffer = decodeBase64Image(imageData)
        if(imageBuffer.hasOwnProperty("errorStatus")){
             console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim())
            reject(RESPONSES.IMAGE_UPLOAD_ERROR)
        }
        //let imageFile = "../private/users/"+u_id+"/profile/"+filename+"."+ext
         let imageName = filename+"."+'jpg'
         let userDir = path.join(__dirname, '../private/user/' + u_id)
        
        if (!fs.existsSync(userDir)){
            fs.mkdirSync(userDir);
        }
        let imageDir = path.join(userDir, 'profile')
        console.log(imageDir)

         if (!fs.existsSync(imageDir)){
            fs.mkdirSync(imageDir);
        }
        let imageFile = imageDir + '/' +imageName
        console.log(imageFile)
        fs.writeFile(imageFile, imageBuffer.data, (err) =>{
            console.log(err)
              reject(RESPONSES.IMAGE_UPLOAD_ERROR)
        })
        let imageURI = BASE_DEV + u_id+"/profile/" + imageName 
        
        console.log(imageURI)
        resolve(imageURI)
    })

}