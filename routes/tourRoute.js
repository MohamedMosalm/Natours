const express = require("express");
const toursController = require(`${__dirname}/../controllers/toursController.js`);
const router = express.Router();

router
  .route("/")
  .get(toursController.getAllTours)
  .post(toursController.createTour);

router
  .route("/:tourId")
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
