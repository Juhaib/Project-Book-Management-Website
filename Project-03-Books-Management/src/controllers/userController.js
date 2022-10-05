const userModel = require('../models/userModel');
const validator = require('../validators/validator')
const jwt = require('jsonwebtoken');





//==================== Create User Api =============================

const createUser = async function(req, res) {
    try {
        let data = req.body
     
        if(!validator.isValidRequestBody(data)) {
            res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide User details'})
            return
        }

        const { title, name, phone, email, password, address } = data

        if(!validator.isValid(title)) {
            res.status(400).send({status: false , message: 'Title is required'})
            return

        }

        if(!validator.isValidTitle(title)) {
            res.status(400).send({status: false , message: 'Title Must be of these values [Mr, Mrs, Miss]'})
            return
        }

        if(!validator.isValid(name)) {
            res.status(400).send({status: false , message: 'Name is required'})
            return
        }

        if(!validator.isValid2(name)) {
            res.status(400).send({status: false , message: 'Name is not a valid name'})
            return
        }
        
        let validString = /\d/;
        if(validString.test(name)) 
            return res.status(400).send({ status: false, msg: "Name must be valid it should not contains numbers" });


        if(!validator.isValid(phone)) {
            res.status(400).send({status: false , message: 'Phone number is required'})
            return

        }

        if( !validator.isValidPhone(phone)) {
            res.status(400).send({status: false , message: 'Phone number is not a valid'})
            return

        }

        const isExistPhone = await userModel.findOne({phone: phone})
        if(isExistPhone){
            res.status(400).send({status: false , message:'This phone number is already Exist'})
            return
        }

        if(!validator.isValid(email)) {
            res.status(400).send({status: false , message: 'Email is required'})
            return
        }

        if(!validator.isValidEmail(email)) {
            res.status(400).send({status: false , message: 'Email is invalid'})
            return
        }

        const isExistEmail = await userModel.findOne({email: email})
        if(isExistEmail){
            res.status(400).send({status: false , message:'This Email is already Exist'})
            return
        }

        if(!validator.isValid(password)) {
            res.status(400).send({status: false , message: 'password is required'})
            return
        }

        if(!validator.isValidPassword(password)){
            res.status(400).send({status: false , message:'It is not valid password'})
            return
        }

        

        if(address.street && !validator.isValid2(address.street)){
            res.status(400).send({status: false , message: 'Enter a valid Street'})
            return
        }

        if(address.city && !validator.isValid2(address.city)){
            res.status(400).send({status: false , message: 'Enter a valid city name'})
            return
        }

        if(validString.test(address.city)) 
            return res.status(400).send({ status: false, msg: "City name must be valid it should not contains numbers" });


        if(address.pincode && !validator.isValidPincode(address.pincode)){
            res.status(400).send({status: false , message: ` ${address.pincode}  is not valid city pincode`})
            return
        }
        
       // data = { title, name, phone, email, password, address }

        let userData = await userModel.create(data)
        res.status(201).send({ status:true, message: 'Success', data: userData })

    } catch (error) {
        res.status(500).send({status:false , msg: error.message});
    }
}



//=======================Login user=================================

const loginUser = async (req, res) => {

try{
     let data = req.body

     if(!validator.isValidRequestBody(data)) {
        res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide Login details'})
        return
    }

    const { email , password } = data

    if(!validator.isValid(email)) {
        res.status(400).send({status: false , message: 'Email is required'})
        return
    }

    if(!validator.isValidEmail(email)) {
        res.status(400).send({status: false , message: 'Email is invalid'})
        return
    }

    if(!validator.isValid(password)) {
        res.status(400).send({status: false , message: 'password is required'})
        return
    }

    if(!validator.isValidPassword(password)){
        res.status(400).send({status: false , message:'It is not valid password'})
        return
    }

    if(email && password) {
        let user = await userModel.findOne({email: email , password: password})
         
        if(!user){
           return  res.status(400).send({status:false,msg:"Invalid Email or Password"})
        }

         let token = jwt.sign(
             {
                 userId: user._id.toString(),
                 iat: Math.floor(Date.now() / 1000),
                 exp: Math.floor(Date.now() / 1000)+ 10*60*60
                 },
                 "functionUp-Uranium" 
                 )
                 res.header("x-api-key" , token)
                 res.status(200).send({status:true , msg:"login Success" , data: token })
     }
}
catch(error){
    res.status(500).send({ status:false , msg:error.message});
}

}


module.exports.createUser= createUser;
module.exports.loginUser= loginUser;