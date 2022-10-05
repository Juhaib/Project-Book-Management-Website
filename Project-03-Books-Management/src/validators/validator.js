//========================= Validators =========================

const mongoose = require("mongoose")

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}


const isValid = function(value) {
    
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true
 }

 const isValid2 = function(value) {
    const dv = /[a-zA-Z]/; 
    if(typeof value !== 'string') return false
    if(dv.test(value)=== false) return false
    return true
 }

 const isValidPincode = function(value) {
    const dv = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/; 
    if(typeof value !== 'string') return false
    if(dv.test(value)=== false) return false
    return true
 }

 const isValidTitle = function(title) {
     //console.log(['Mr','Mrs','Miss'].includes(title));
     return ['Mr','Mrs','Miss'].includes(title)
 }


 const isValidEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email) 
  
}

const isValidPhone = function(mobileNumber) {
    return /^([+]\d{2}[ ])?\d{10}$/.test(mobileNumber) 
    //return /^[6789]\d{9}$/.test(mobileNumber)
 }

 const isValidPassword = function(pass){
     let passRE = /^(?!\S*\s)(?=\D*\d)(?=.*[!@#$%^&*])(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).{8,15}$/;
     return passRE.test(pass)
 }

 const isValidObjectId = (objectId) => {
    if (mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
  };

  const isValidISBN = (ISBN) => {
    let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return  reISBN.test(ISBN)
  }


//  const check = (value) => {
//     return value.every(ele => (typeof(ele) === "string"))
// }


const check = (value) => {
    let isStr =  value.every(ele => (typeof(ele) === "string"))
    if(isStr == false) return false
    let arr= value.map(x => x.trim())
    let isEmptyStr = arr.includes('');
    if(isEmptyStr == true) return false
    return true
}



const releaseFormat = (releasedAt) => {

   // const reAt = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    let reAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;// YYYY-MM-DD
    return reAt.test(releasedAt)
}



module.exports = { isValid, isValid2, isValidRequestBody, isValidTitle, isValidEmail, isValidPhone, isValidPassword , isValidPincode, isValidObjectId, isValidISBN, check, releaseFormat}

