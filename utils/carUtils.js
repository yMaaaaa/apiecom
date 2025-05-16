const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const filePath = "./db/cars.json";

const readDB = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
};

const writeDB = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const createCarId = (carData) => {
  const car = {
    id: uuidv4(),
    ...carData,
  };

  const carList = readDB();
  carList.push(car);
  writeDB(carList);
  return car;
};

module.exports = {
  readDB,
  createCarId,
  writeDB,
};
