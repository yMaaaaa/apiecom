const express = require("express");
const carRouter = require("./routes/carRoutes");
const authRoute = require("./routes/authRoute");
const app = express();
const cookieParser = require("cookie-parser");

const host = "localhost";
const port = 3050;

app.use(express.json());
app.use(cookieParser());
app.use("/api/V1/cars", carRouter);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
