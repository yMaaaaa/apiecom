const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readUsers } = require("../utils/userUtils.Js");
const { writeUsers } = require("../utils/userUtils.Js");
const { createUserRoleBased } = require("../utils/userUtils.Js");
const JWT_SECRET = "grosmotdepassesah";

const registerUser = async (req, res) => {
  try {
    //M'assurer que req.body existe bien
    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { username, password, role = "client" } = req.body;
    console.log("Data reçu: ", req.body);

    //Vérifier si l'utilisateur existe
    const users = readUsers();
    //Il cherche dans le tableau
    const existingUser = users.find((u) => u.username === username);
    //Renvoie un message si le nom d'utilisateur existe déjà
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //  const newUser = { username, password: hashedPassword };

    const newUser = createUserRoleBased(
      {
        username,
        password: hashedPassword,
      },
      role
    );
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error({ message: "Error registering user", error: error.message });
  }
  res.status(500).json({
    message: "Internal server error",
  });
};

const loginUser = async (req, res) => {
  console.log(`${loginUser} req.body =`, req.body);

  try {
    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const { username, password } = req.body;
    //Lire BDD Users
    const users = readUsers();
    const user = users.find((u) => u.username === username);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    //Create JWT
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //Set token in HttpOnly Tcookie
    res.cookie("token", token, {
      httpOnly: true, //Empêche JS d'accéder au cookie(XXS Attack)
      sameSite: "Strict", //Empêche le cookie d'être envoyé avec des requêtes cross-origin(CSRF)
      maxAge: "3600000", //1h Expiration 60^3(60 * 60 * 60)
    });

    res.json({ message: "Login Sucessful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

const logoutUser = (req, res) => {
  //Logout en supprimant le cookie
  res.clearCookie("token", {
    httpOnly: true, //prevent JS acces
    sameSite: "Strict",
    path: "/", //Path is set to root:
  });
  res.status(200).json({
    message: "User is disconnected",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
