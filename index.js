const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const login = require("./routers/Guest/Login");
const register = require("./routers/Guest/Register");
const payment = require("./routers/User/PaymentMethod");
const products = require("./routers/User/Products");
const getProducts = require("./routers/Guest/GetProducts");
const cart = require("./routers/User/Cart");
const reports = require("./routers/User/Reports");
const rating = require("./routers/User/Rating");
const user = require("./routers/User/User");
const isUserRatedApp = require("./routers/User/IsUserRated");
const addUser = require("./routers/Admin/AddUser");
const deleteReps = require("./routers/Admin/DeleteReps");
const getRatings = require("./routers/Admin/GetRatings");
const getReps = require("./routers/Admin/GetReports");
const setAsAdmin = require("./routers/Admin/SetAsAdmin");
const sendNotification = require("./routers/Admin/SendNotification");
const purchase = require("./routers/Stripe/StripeApi");
const getUsers = require("./routers/Admin/GetUsers");
const { authMiddleware } = require("./middlewares/authentication");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

config();

const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Drago Tech Shop",
      description: "Tech shop swagger documentation",
      contact: {
        name: "Dragisa",
      },
      servers: ["https://techshop-be.vercel.app/"],
    },
    schemes: ["http", "https"],
  },
  apis: ["./routers/*/*.js"],
};

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

const startServer = () => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`---Server running on port ${process.env.PORT || 5000}---`);
  });
};
app.use(express.json());
app.use(cors());

app.use("/login", login);
app.use("/register", register);
app.use("/products", getProducts);

app.use(authMiddleware);
app.use("/purchase", purchase);
app.use("/ratedBy", isUserRatedApp);
app.use("/payment", payment);
app.use("/user", user);
app.use("/products", products);
app.use("/cart", cart);
app.use("/reports", reports);
app.use("/rate", rating);

app.use(
  "/admin",
  addUser,
  deleteReps,
  getRatings,
  getReps,
  setAsAdmin,
  sendNotification,
  getUsers
);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("---Connected to database---");
    startServer();
  } catch (e) {
    console.error("Connection to database failed", e);
  }
};

connectToDatabase();
