
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const validator = require('../validators/validator')


//=================== Create Books Api====================================

const createBook = async function (req, res) {
    try {
        
        let data = req.body
       


        if(!validator.isValidRequestBody(data)) {
            return res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide Book details'})
            
        }

        const {title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt} = data

        if (! validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: 'userId is Required' });
        }

        //userId = userId.trim()
        if (! validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Please enter valid user ID' });
        }

        // Authorization
      
        if(userId != req.userId){
            return res.status(401).send({status: false , message: "Unauthorized User"})
        }

        if (! validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is Required' });
        }

        if (! validator.isValid2(title)) {
            return res.status(400).send({ status: false, message: 'Please Enter Valid title' });
        }

        const duplicateTitle = await bookModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already Exist" })
        }

        if (! validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Excerpt is Required' });
        }

        if (! validator.isValid2(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please enter valid excerpt' });
        }


        // Check exist or not this UserId
        const isExistUserId = await userModel.findOne({ userId: userId });
        if (! isExistUserId) {
            return res.status(400).send({ status: false, message: "User ID is Not exists in our Database" })
        }

        if (! validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: 'ISBN is Required' });
        }

        
        if (! validator.isValidISBN(ISBN)){
            return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
        }

         // Check duplicate ISBN
         const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
         if (duplicateISBN) {
             return res.status(400).send({ status: false, message: "ISBN is already exist" })
         }

         if (! validator.isValid(category)) {
            return res.status(400).send({ status: false, message: 'category is Required' });
        }

        if ( !validator.isValid2(category)) {
            return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
        }

        if (! validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'subcategory is Required' });
        }

        if(!Array.isArray(subcategory)){
            return res.status(400).send({ status: false, data: "Subcategory is must be an Array" })
      
          }

        if (! validator.check(subcategory)) {
            return res.status(400).send({ status: false, message: 'Enter Valid Subcategory' });
        } 

        if (! validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: 'Please Enter Released Date' });
        }

        
        if (! validator.releaseFormat(releasedAt)) {
            return res.status(400).send({ status: false, message: "Invalid Released Date " });
        }

        if (reviews && (typeof reviews !== 'number')) {
            return res.status(400).send({ status: false, message: "Reviews Must be numbers" })
        }
    
        if(isDeleted && (isDeleted === true  || typeof isDeleted !== Boolean)){
                return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
        }
        
        
       
        const bookDetails = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'successfully created ', data:  bookDetails  })


    } 
    catch (err) {
        res.status(500).send({status:false , message: err.message});
    }

}

//======================= get All Books Api====================================

const getBookDetails = async function (req, res) {

    try {
        let queryData = req.query

        let {userId, category, subcategory , ...remaining} = queryData

        if(validator.isValidRequestBody(remaining)){
            return res.status(400).send({status: false , message: "userId, category, subcategory --> only these filters are allowed"})
        }


        if(userId && !validator.isValidObjectId(userId.trim())){
            return res.status(400).send({ status: false, message: 'Please enter Valid User ID' });
        }

        if(userId) {
            let user = await userModel.findById(userId)
            if(!user){
                return res.status(404).send({ status: false, message: 'User does not exist' })
            }
        }
        

        if ( category && ! validator.isValid2(category)) {
            return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
        }

        if(subcategory){
            queryData.subcategory =   { $all: [].concat(req.query.subcategory) }
        }
        //

        let condition = { isDeleted: false }
        let data = Object.assign(queryData, condition)

         
        let allBooks = await bookModel.find(data).collation({locale: 'en'}).sort({title: 1}).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1})
        if(! allBooks.length){
            return res.status(404).send({status: false , msg:"Book not found"})
        }
        return res.status(200).send({status: true ,message: 'Books list', data: allBooks})
      
    
    } 
    catch (err) {
        res.status(500).send({status:false , msg: err.message});
    }

}

//=========================get Book details By Id Api======================================

const getBookDetailsByID = async function(req, res) {

    try {
        let bookID = req.params.bookId 


        if( ! validator.isValidObjectId(bookID)){
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({_id: bookID, isDeleted: false}).lean().select({__v: 0})

        if(!book){
            return res.status(404).send({status: false, message: 'Book not Found'})
        }
        let reviewsDetail = await reviewModel.find({bookId: bookID, isDeleted: false}).select({_id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1}).lean()

        
        book['reviewsData'] = reviewsDetail

        return res.status(200).send({status: true , message: 'Books list', data: book})

        
    } catch (err) {
        res.status(500).send({status:false , msg: err.message});
    }
}

//======================Update Book Api===============================

const updateBook = async function (req, res) {

    try {
        let bookID = req.params.bookId 


        if( ! validator.isValidObjectId(bookID)){
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({_id: bookID, isDeleted: false}).lean()

        if(!book ){
            return res.status(404).send({status: false, message: 'Book not Found'})
        }

        let userId = book.userId
       
        // Authorization
        if(userId != req.userId){
            return res.status(401).send({status: false , message: "Unauthorized User"})
        }

        let data = req.body

        if(!validator.isValidRequestBody(data)) {
            return res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide Book details'})    
        }

        let {title, excerpt, releasedAt, ISBN, } = data
        
        if (!(title || excerpt || ISBN || releasedAt)) {
            return res.status(400).send({ status: false, message: 'Wrong keys are Present, Please enter correct updation keys' });
          }


        if (title && !validator.isValid2(title)) {
            return res.status(400).send({ status: false, message: 'Please Enter Valid title' });
        }

        const duplicateTitle = await bookModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already Exist " })
        }


        if (excerpt && !validator.isValid2(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please enter valid excerpt' });
        }

    
        
        if (ISBN && !validator.isValidISBN(ISBN.trim())){
            return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
        }

         // Check duplicate ISBN
         const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
         if (duplicateISBN) {
             return res.status(400).send({ status: false, message: "ISBN is already exist" })
         }

        
        if (releasedAt && !validator.releaseFormat(releasedAt.trim())) {
            return res.status(400).send({ status: false, message: "Released Date Format Should be in 'YYYY-MM-DD' Format " });
        }

        let condition = {_id: bookID , isDeleted: false}

        data = {title, excerpt, releasedAt, ISBN }

        // data = /*{ $or: [{ title: title }, { excerpt: excerpt }, { releasedAt: releasedAt }, { ISBN: ISBN }]}*/
        let updatedData = await bookModel.findOneAndUpdate( condition , {$set: data}, {new: true})

        if(!updatedData){
            return res.status(404).send({status: false, message: 'Book with this data not found'})
        }

        return res.status(200).send({ status: true, message: "success", data: updatedData });
    
        
    } 
    catch (err) {
        res.status(500).send({status:false , msg: err.message});  
    }
}

//=============================Delete Book Api==========================================


const deleteBook = async function (req, res) {

    try {
        let bookID = req.params.bookId 

        if( !validator.isValidObjectId(bookID)){
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({_id: bookID, isDeleted: false})
        if(!book ){
            return res.status(404).send({status: false, message: 'Book not Found'})
        }

        let userId = book.userId
       
        // Authorization
        if(userId != req.userId){
            return res.status(401).send({status: false , message: "Unauthorized User"})
        }

        let deletedBook = await bookModel.findOneAndUpdate({_id: bookID}, {isDeleted: true, deletedAt: new Date().toISOString()})
  
        return res.status(200).send({status: true , message: 'Book Deleted Successfully!!!'})

        
    } 
    catch (err) {
        res.status(500).send({status:false , msg: err.message});
    }

}

module.exports = {createBook, getBookDetails, getBookDetailsByID, updateBook, deleteBook }

