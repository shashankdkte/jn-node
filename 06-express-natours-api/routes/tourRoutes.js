const express = require('express');
const router = express.Router();
const tourController = require("../controllers/toursController")
const authController = require("../controllers/authController")
const reviewRouter = require("../routes/reviewRoutes")


// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use("/:tourId/reviews",reviewRouter)

router.route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
// router.param("id", tourController.checkID);
router
  .route('/')
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports = router;