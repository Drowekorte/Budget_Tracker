const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 5555;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// routes
app.use(require("./routes/api.js"));
// app.get("/", (req, res) => {
//   console.log("go home")
//   res.sendFile(__dirname + "/public/index.html")
// })



mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, 
  useFindAndModify: false
});

mongoose.connection.once("open", ()=>{
  app.listen(PORT, ()=> {
      console.log ("server is running")
  })
}) 



