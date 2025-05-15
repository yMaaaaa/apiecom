const express = require("express");
const { readDB } = require("../utils/carUtils");
const {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const authenticateJWT = require("../middlewares/tokenjwt");
const isAdmin = require("../middlewares/isAdmin");

const carRoute = express.Router();
//GetALlCars => Method: GET
carRoute.get("/", authenticateJWT, isAdmin, getAllCars);

module.exports = carRoute;

//CreateCar => Method: POST
carRoute.post("/createcar", createCar);

//EditCar => Method: PUT
carRoute.put("/updateCar/:id", updateCar);

//DeleteCar => Method: DELETE

carRoute.delete("/deletecar/:id", deleteCar);
