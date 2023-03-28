const express = require("express");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routes/router");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`The Web server on port ${port}`);
});



// #config HBS
app.engine(
  "hbs",
  expressHbs.engine({
    extname: "hbs",
    helpers: {
      shortText: (value, max, options) => {
        if (value.length > max) {
          return value.substring(0, max) + "...";
        } else {
          return value;
        }
      },
      increase: (value, options) => {
        return parseInt(value) + 1;
      },
      decrease: (value, options) => {
        return parseInt(value) - 1;
      },
    },
  })
);
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/labs", router.router);


// #config MongoDB
const username = "thailmph27046";
const password = "leemanhthai";
const cluster = "mycluster";
const dbName = "CP17301";
const uri = `mongodb+srv://${username}:${password}@${cluster}.myjppwj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Connected successfully");
});

// #routes
app.get("/", (req, res) => {
  res.redirect('labs/list/1');
});
