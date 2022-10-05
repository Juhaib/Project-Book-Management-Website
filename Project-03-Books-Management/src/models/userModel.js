const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({ 

        title: {
          type:String,
          required:true, 
          enum:["Mr", "Mrs", "Miss"],
          trim:true
        },
        name: {
          type:String,
          required:true,
          trim:true 
        },
        phone:{
          type:String,
          required:true,
          trim:true,
          unique:true,
          validate: {
            validator: function (value) {
                return /^([+]\d{2}[ ])?\d{10}$/.test(value)
              }, msg: "Please enter 10 digit number", isAsync: false,

          }, 
        },
        email: {
          type:String,
          required:true,
          trim:true,
          unique:true,
          lowercase: true,
          validate: {
            validator: function(email) {
                return  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
            }, message: 'Please fill a valid email address', isAsynic: false

          }

        }, 
        password: {
          type:String,
          required:true,
          trim:true,
          minlength:8, 
          maxlength:15
        },

        address: {
          street: { type:String, trim:true },
          city: { type:String, trim:true },
          pincode: { type:String, trim:true }
        },
        
      }, { timestamps: true } );


module.exports = mongoose.model("User", userSchema);