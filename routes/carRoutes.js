const express = require("express");
const { readDB } = require("../utils/carUtils");
const {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
  rankCar,
} = require("../controllers/carController");
const authenticateJWT = require("../middlewares/tokenjwt");
const isAdmin = require("../middlewares/isAdmin");

const carRoute = express.Router();
//GetALlCars => Method: GET
carRoute.get("/", getAllCars);

//CreateCar => Method: POST
carRoute.post("/createcar", authenticateJWT, createCar);

//EditCar => Method: PUT
carRoute.put("/updateCar/:id", authenticateJWT, isAdmin, updateCar);

//DeleteCar => Method: DELETE

carRoute.delete("/deletecar/:id", authenticateJWT, isAdmin, deleteCar);

//==================>

//Rank Car

carRoute.post("/:id", authenticateJWT, rankCar);

module.exports = carRoute;
