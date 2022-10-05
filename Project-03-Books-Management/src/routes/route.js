const express = require("express");
const router = express.Router();
const userController= require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const mw = require('../middleware/auth')

//==================User Api==================

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

//======================Book Api================

router.post("/books", mw.authentication, bookController.createBook)
router.get("/books", mw.authentication, bookController.getBookDetails)
router.get("/books/:bookId", mw.authentication, bookController.getBookDetailsByID)
router.put("/books/:bookId", mw.authentication, bookController.updateBook)
router.delete("/books/:bookId", mw.authentication, bookController.deleteBook)

//================Review APIs===========================

router.post("/books/:bookId/review", reviewController.addReview )
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


router.post("*", (req,res) =>{
    
    return res.status(404).send({ msg:"Page Not Found"})
})
router.get("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})
router.put("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})

router.delete("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})

module.exports = router;