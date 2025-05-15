const { readDB, createCarId, writeDB } = require("../utils/carUtils");

const getAllCars = (req, res) => {
  const cars = readDB();
  res.json(cars);
};

const createCar = (req, res) => {
  const { energy, country, manufacturer, year, model, power, type } = req.body;

  const newCar = createCarId({
    energy,
    country,
    manufacturer,
    year,
    model,
    power,
    type,
  });

  res.status(201).json({
    message: "Car added successfully",
    car: newCar,
  });
};

const updateCar = (req, res) => {
  //Récupérer l'id de la voiture à modifier
  const { id } = req.params;
  const { energy, country, manufacturer, year, model, power, type } = req.body;

  //Vérifuer la BDD (Base de données) pour voir si la voiture existe
  let cars = readDB();
  let car = cars.find((c) => c.id === id);

  if (!car) {
    return res.status(404).json({
      message: "Car not found",
    });
  }

  car.energy = energy || car.energy;
  car.country = country || car.country;
  car.manufacturer = manufacturer || car.manufacturer;
  car.year = year || car.year;
  car.model = model || car.model;
  car.power = power || car.power;
  car.type = type || car.type;
  //Enregistrer la voiture modifiée dans la BDD

  writeDB(cars);
  res.json({
    message: "Car updated successfully",
    car,
  });
};

const deleteCar = (req, res) => {
  const { id } = req.params;
  let deletedCar = readDB();

  const index = deletedCar.findIndex((c) => c.id === id);

  if (!index === -1) {
    return res.status(404).json({
      message: "Car not found",
    });
  }
  //Méthode pour supprimer un élément d'un tableau
  deletedCar.splice(index, 1);
  writeDB(deletedCar);

  res.json({
    message: "Car deleted successfully",
  });
};

module.exports = {
  getAllCars,
  createCar,
  updateCar,
  writeDB,
  deleteCar,
};

//    const cars = readDB();
//    res.json(cars);
