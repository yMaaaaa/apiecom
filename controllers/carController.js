const { readDB, createCarId, writeDB } = require("../utils/carUtils");

const getAllCars = (req, res) => {
  let cars = readDB();

  //Extraire les paramètres de query pour faire le filtre
  const { energy, year, country, type, manufacturer } = req.query;

  //Filtrer les voitures par energyn year, country, type ou manufacturer,
  //Si fourni dans le query
  if (energy) {
    cars = cars.filter(
      (car) =>
        car.energy && car.energy.toLowerCase().includes(energy.toLowerCase())
    );
  }
  if (year) {
    cars = cars.filter(
      (car) => car.year && car.year.toLowerCase().includes(year.toLowerCase())
    );
  }
  if (country) {
    cars = cars.filter(
      (car) =>
        car.country && car.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (type) {
    cars = cars.filter(
      (car) => car.type && car.type.toLowerCase().includes(type.toLowerCase())
    );
  }
  if (manufacturer) {
    cars = cars.filter(
      (car) =>
        car.manufacturer &&
        car.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
    );
  }

  //Récupérer dynamiquement les filtres dans le query
  const filters = req.query;
  //Itérer tout les paramètres de query pour filtrer de manière dynamique
  for (let key in filters) {
    if (filters[key]) {
      //Filtrer de manière dynamique en se basant sur la key (modèle, year etc..)
      cars = cars.filter(
        (car) =>
          car[key] &&
          car[key].toLowerCase().includes(filters[key].toLowerCase())
      );
    }

    //Filtrer par année
    if (key === "year") {
      cars = cars.filter(
        (car) => car[key] && car[key] === parseInt(filtres[key], 10)
      );
    } else {
      cars = cars.filter(
        (car) =>
          car[key] &&
          car[key].toLowerCase().includes(filters[key].toLowerCase()),
        console.log(typeof filters[key])
      );
    }
  }

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
const rankCar = (req, res) => {
  const { id } = req.params; // récupérer l'ID de l'URL
  const { rating } = req.body; //Classement voiture data dans la request body

  console.log("Rating: ", rating);
  console.log("Type Rating: ", typeof rating);

  //Convertir rating à un Nombre
  const numericRating = parseInt(rating, 10);

  console.log("Parsed numericRating: ", typeof numericRating);

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      message: "Rating doit être entre 1 et 5",
    });
  }

  //Empêcher les admins de rating

  if (req.user.role === "admin") {
    return res.status(403).json({
      message: "Admins ne peuvent pas classer les voitures",
    });
  }

  //Récupérer le username de JWT token
  const username = req.user.username;

  // Trouver l'ID de la voiture à classer
  const cars = readDB();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    console.log("Car not found avec ID : ", id);
    return res.status(404).json({
      message: "Car not found",
    });
  }

  //On s'assure que la propriété "ratings" existe, et que c'est un Array (Tableau)
  if (!car.ratings) {
    car.ratings = []; //Initialiser le tableau rating si il n'existe pas.
  }

  //Check si l'utilisateur a déjà classer la voiture
  const userAlreadyRatedCar = car.ratings.find(
    (rating) => rating.username === username
  );
  if (userAlreadyRatedCar) {
    return res.status(400).json({
      message: "Vous avez déjà classé cette voiture",
    });
  }

  //Ajouter le Rating au tableau ratings avec le username
  const newRating = { username, numericRating };
  car.ratings.push(newRating);

  //Ajouter les voitures mises à jour à la BDD
  writeDB(cars);

  res.status(201).json({
    message: "Rating ajouté, mreci !",
    car,
  });
};

module.exports = {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
  rankCar,
};

//    const cars = readDB();
//    res.json(cars);
