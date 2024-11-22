const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const reviewController = require('../controllers/reviewsController')
const dashboardRoutes = require('./dashboardRoutes');

router.post('/user/register',controller.register);
router.post('/user/login',controller.login);
router.use('/dashboard', dashboardRoutes);

router.get('/reviews', reviewController.reviews);
router.get('/reviews/:id', reviewController.getReviewsForUser);
router.get('/review/:userId/:bookId', reviewController.getReviewByUserAndBook);
router.post('/reviews/:userId', reviewController.addReview);
router.put('/reviews/:userId/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;