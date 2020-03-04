interface Settings {
    name:string,
    minLength:number,
    maxLength: number,
    regex: any,   
}


export const UsernameSettings = <Settings>{
    name: "username",
    minLength: 3,
    maxLength: 15,
    regex: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/
}

export const EmailSettings = <Settings>{
    name: "emailAddress",
    minLength: 4,
    maxLength: 320,
    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

export const PasswordSettings = <Settings>{
    name: "password",
    minLength: 8,
    maxLength:  100,
    regex: null
}


export const CategorySettings = <Settings>{
    name: "category",
    minLength: 1,
    maxLength: 50,
    regex: /^[A-Za-z]+$/
}

export const PhoneNumberSettings = <Settings>{
    name: "phone",
    minLength: 10,
    maxLength: 10,
    regex: /^[0-9]*$/
}