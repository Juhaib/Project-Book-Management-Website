const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel');
const validator = require('../validators/validator')

//------------------------------------Add Review for book--------------------------

const addReview = async function (req, res) {

    try {
        let bookID = req.params.bookId 

        if( !validator.isValidObjectId(bookID)){
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({_id: bookID, isDeleted: false}).lean()
        if(!book ){
            return res.status(404).send({status: false, message: 'Book not Found'})
        }

        let data = req.body

        if(!validator.isValidRequestBody(data)) {
            return res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide review details'})
            
        }

        let {review, rating, reviewedBy, isDeleted } = data

        if(review != undefined && !validator.isValid2(review)) {
            return res.status(400).send({ status: false, message: 'Please enter valid review' });
        }

        if(!validator.isValid(rating)){
            return res.status(400).send({ status: false, message: 'Rating is Required' });
        }

        if((typeof rating != "number") || (rating > 5 || rating < 1)) {
            return res.status(400).send({ status: false, message: 'Please Enter valid Rating' }); 
        }

        // if(!validator.isValid(reviewedBy)){
        //     data.reviewedBy = 'Guest'
        // }
        if(!validator.isValid(reviewedBy)){
            return res.status(400).send({ status: false, message: 'Reviewer Name is Required' });
        }

        if(! validator.isValid2(reviewedBy)){
            return res.status(400).send({ status: false, message: 'Please Enter valid Reviewer Name' }); 
       
        }

        if(isDeleted && (isDeleted === true  || typeof isDeleted !== Boolean)){
            return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
    }
        
        data.reviewedAt = new Date().toISOString()

        const condition = {_id: bookID, isDeleted: false}
        const updatedBook = await bookModel.findOneAndUpdate( condition , { $inc: {reviews: 1}}, {new: true}).lean().select({ __v: 0 })

        data.bookId = bookID
        const newReview = await reviewModel.create(data)

       // const reviewsDetail = await reviewModel.find({bookId: bookID, isDeleted: false}).select({_id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1}).lean()
        // updatedBook['reviewsData'] = reviewsDetail

        updatedBook['reviewsData'] = newReview

        return res.status(201).send({status: true , message: 'Books list', data: updatedBook})



    } catch (err) {
        res.status(500).send({status:false , msg: err.message});   
    }
  
}


//=========================update Review by id in params=============

const updateReview = async function(req,res){
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let data = req.body

        if(! validator.isValidRequestBody(data)){
           return res.status(400).send({status:false,message:"Invalid request parameters.Please provide review details" })
        }

        if(!validator.isValidObjectId(bookId)){
            return res.status(400).send({status:false,message:`${bookId} is not a valid book id` })
        }

        if(!validator.isValidObjectId(reviewId)){
            return res.status(400).send({status:false,message:`${reviewId} is not a valid review id ` })
        }

        let checkBook = await bookModel.findOne({_id:bookId, isDeleted:false}).lean().select({ __v: 0 })

        if(!checkBook){
            return res.status(404).send({status:false,message:"Book does not exist in our Database" })
        }

        let checkReviewId = await reviewModel.findOne({_id:reviewId, bookId:bookId, isDeleted:false})

        if(!checkReviewId){
            return res.status(404).send({status:false, message:"Review with this book id is does not exist"})
        }
        
        const {review, rating, reviewedBy}  = data

        if (!(review || rating || reviewedBy )) {
            return res.status(400).send({ status: false, message: 'Wrong keys are Present, Please enter correct updation keys' });
          }

        if(review != undefined && !validator.isValid2(review)) {
            return res.status(400).send({ status: false, message: 'Please enter valid review' });
        }

     
        if(rating && (( typeof rating != "number") || (rating > 5 || rating < 1))) {
            return res.status(400).send({ status: false, message: 'Please Enter valid Rating' }); 
        }


        if(reviewedBy != undefined &&  ! validator.isValid2(reviewedBy)){
            return res.status(400).send({ status: false, message: 'Please Enter valid Reviewer Name' })
        }

        data = { review, rating, reviewedBy}

        const update = await reviewModel.findOneAndUpdate({_id:reviewId}, data, {new:true}).select({ __v: 0 })

       // const reviewsDetail = await reviewModel.find({bookId: bookId, isDeleted: false}).select({_id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1}).lean()

       // checkBook['reviewsData'] = reviewsDetail

        checkBook['reviewsData'] = update

        return res.status(201).send({status: true , message: 'Books list', data: checkBook})
      
            //{...checkBook , reviewsDetail}
    }
    catch(error){
        res.status(500).send({status:false,error:error.message})
    }
}

//--------------------------------------- Delete Review by ID---------------------------

const deleteReview = async function (req,res){
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(! validator.isValidObjectId(bookId)){
           return res.status(400).send({status:false, message:`${bookId} is not a valid book id `})
        }

        if(! validator.isValidObjectId(reviewId)){
            return res.status(400).send({status:false, message:`${reviewId} is not a valid review id `})
        }

        let checkBookId = await bookModel.findOne({_id:bookId,isDeleted:false}).lean()

        if(!checkBookId){
             return res.status(404).send({status:false,message:"book does not found"})
        }

         let checkReviewId = await reviewModel.findOne({_id:reviewId, bookId:bookId, isDeleted:false}).lean()
        
        if(!checkReviewId){
            return res.status(404).send({status:false,message:"review with this book id is does not exist"})
         }

        let update = await reviewModel.findOneAndUpdate({_id:reviewId}, {isDeleted:true}, {new:true})
        let updateReviewCount = await bookModel.findOneAndUpdate({_id:bookId},{reviews:checkBookId.reviews-1},{new:true})

         return res.status(200).send({status:true, message:"Review sucessfully Deleted"})

    }
    catch(error){
        res.status(500).send({status:false, error:error.message});
    }
}




module.exports = { addReview, updateReview, deleteReview }