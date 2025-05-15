//Je prépare ma BDD
const fs = require("fs");
const userDB = "./db/users.json";
const { v4: uuidv4 } = require("uuid");

//Read User de la BDD / Json FILE
const readUsers = () => {
  try {
    if (fs.existsSync(userDB)) {
      const data = fs.readFileSync(userDB, "utf-8");
      //Opération ternaire: envoyer un tableau vide au cas où data inexistante.
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error("Error reading users", error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(userDB, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users to DB", error);
  }
};

//Ajouter utilisateur avec Role
const createUserRoleBased = (userData, role = "client") => {
  const user = {
    id: uuidv4(),
    ...userData,
    role,
  };
  const usersList = readUsers();
  usersList.push(user);
  writeUsers(usersList);
  return user;
};

module.exports = {
  writeUsers,
  readUsers,
  createUserRoleBased,
};
