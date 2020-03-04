
let jwt:any = require('jsonwebtoken')
let RESPONSES:any = require('../functions/helperConstants').RESPONSES;
import Result from './Result'
import Error from './Interfaces/Error'
import SResponse from './Interfaces/SResponse'
import CategoryResult from './Interfaces/CategoryResult'
import DBResult from './Interfaces/DBResult'
import * as FS from "./settings/FieldSettings"
import {firepool} from './config/dbConfig'
import {ERROR_RESPONSE} from './helper/ErrorResponse'
import {RESPONSE} from './helper/Response'
import UserAuthData from './Interfaces/UserAuthData';




export default interface CategoryInterface {
    categoryId:number,
    categoryName:string,
    categoryWeight:number
}

export type CategoryType = {
    categoryId?:number,
    categoryName:string,
    categoryWeight?:number
}

export default class Category {

    categoryName:string;
    categoryWeight:number;
    
    constructor(categoryName:string){
            let fs = FS.CategorySettings;
            categoryName = categoryName.trim().toLowerCase()
            if(categoryName.length < fs.minLength || categoryName.length > fs.maxLength){
                throw ERROR_RESPONSE.category.invalid
            }
            else if(!fs.regex.test(categoryName)){
                 throw ERROR_RESPONSE.category.invalid
            }
                this.categoryName = categoryName;
                this.categoryWeight = 0;
            
    }

     /**
     * Gets the categories that are LIKE the keyword category.
     * @param keyword the reference category.
     * @return CategoryResult Category[] the list of related categories.
     */
    static async getRelatedCategories(keyword:string) : Promise<Result<DBResult<CategoryInterface>, Error>> {

                let fs = FS.CategorySettings;
                keyword = keyword.trim().toLowerCase();
                if (!fs.regex.test(keyword)) {
                 throw ERROR_RESPONSE.category.invalid;
                }
                const client = await firepool.connect();
                try{   
                    await client.query('BEGIN');
                    let queryText = 'SELECT categoryId, categoryName, categoryWeight FROM category WHERE LOWER(categoryName) LIKE $1 ORDER BY categoryWeight, categoryName';
                    let res = await client.query(queryText, ['%'+keyword+'%'])
                    console.log(res.rows)
                    return Promise.resolve(Result.Success(<DBResult<CategoryInterface>>{"data": res.rows}))
                }
                catch(e) {
                    console.log("Exception:", e);
                     return Promise.reject(Result.Failure(ERROR_RESPONSE.category.invalid))
                }
                finally {
                    client.release()
                }
        }
     
     

    /**
     * Creates new category.
     * @param keyword the category to create.
     * @return Category object.
     */
    public static async createCategory(keyword:string) : Promise<Result<DBResult<CategoryInterface>, Error>>{
         
         const client  = await firepool.connect();
         try{
            let newCategory = new Category(keyword);
            await client.query('BEGIN')
            let queryText = 'INSERT INTO Category (categoryName, categoryWeight) VALUES ($1, $2)';
            let res = await client.query(queryText, [newCategory.categoryName, newCategory.categoryWeight])
            await client.query('COMMIT')
    
            let selectQueryText = 'SELECT * FROM Category WHERE categoryName = $1';
            let selectRes = await client.query(selectQueryText, [newCategory.categoryName])

            return Promise.resolve(Result.Success(<DBResult<CategoryInterface>>{"data": selectRes.rows[0]}))
         }
         catch(e){
             await client.query('ROLLBACK')
                console.log("Exception:", e);
                     return Promise.reject(Result.Failure(ERROR_RESPONSE.category.invalid))
         }
         finally{
            client.release()
         }
    }   

   
}