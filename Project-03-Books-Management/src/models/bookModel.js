const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const bookSchema = new mongoose.Schema(
     {
        title: {type:String , required:true , trim:true , unique:true , lowercase: true},

        excerpt: {type:String , required:true , trim:true, lowercase: true},

        userId: {type:ObjectId  , ref:"User" , required:true, trim: true },

        ISBN: {type:String , required:true , trim:true , unique:true },

        category: {type:String , required:true , trim:true , lowercase: true},

        subcategory: [{type:String , required:true , trim:true , lowercase: true }],

        reviews: {type:Number, default: 0 },

        deletedAt: {type:Date },

        isDeleted: {type:Boolean , default: false},

        releasedAt: {type:String , required:true , trim: true },


    },{timestamps:true} );

module.exports = mongoose.model("Book" , bookSchema)