import {BusinessUserInterface} from  './Interfaces/Interfaces'

class Test {

      private b_id:string = "";
    private email:string = "";
    private name:string = "";
    private username:string = "";
    private phone:string = "";
    private phone_ext:string = "";
    private password_hash:string = "";
    private salt:string = "";
    private profile_pic_url:string = "";
    private email_is_verified:boolean = false;
    private phone_is_verified:boolean = false;

   
    constructor(){}

    static isBI(xx: any): xx is BusinessUserInterface {
        //return xx && xx.b_id && xx.email;
         return xx && xx.b_id && xx.email && xx.name && xx.username && xx.phone && xx.phone_ext && xx.profile_pic_url && typeof(xx.email_is_verified)  === "boolean" && typeof(xx.phone_is_verified)  === "boolean" ;
    }
}





