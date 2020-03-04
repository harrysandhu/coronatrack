export default class Result<TSuccess, TError>{

    public static Success<T>(successObject: T){
        return new Result<T, any>(successObject, null, false);
    }

    public static Failure<T>(errorObject: T){
        return new Result<any, T>(null, errorObject, true);
    }

    constructor(
        private success: TSuccess,
        private error: TError,
        private isError: boolean
    ){
    };

    get(){
        return ( (!this.isError) ? this.success : this.error )
    }
}


