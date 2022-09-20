require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// import routes
const postsRoutes = require("./api/routes/posts");
const userRoutes = require("./api/routes/users");

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());

//mongoose
const port = process.env.PORT || 8000;

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_DB);
//   } catch (error) {
//     throw error;
//   }
// };

// mongoose.connection.on("disconnected", () => {
//   console.log("mongodb disconnected");
// });

// mongoose.connection.on("connected", () => {
//   console.log("mongodb connected");
// });

// // handle error
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({ error: err.message || "No such route" });
//   next();
// });

// app.listen(port, () => {
//   connect();
//   console.log(`Listening on port ${port}`);
// });

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 8000, () =>
      console.log(`listening on port ${port}`)
    )
  )
  .catch((err) => console.log(err.message));

// mongoose.set("useFindAndModify", false);

// routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
