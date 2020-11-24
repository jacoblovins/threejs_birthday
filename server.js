
const express = require("express");
const session = require("express-session");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static("public"));

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(
  "/build/",
  express.static(path.join(__dirname, "node_modules/three/build"))
);
app.use(
  "/jsm/",
  express.static(path.join(__dirname, "node_modules/three/examples/jsm"))
);

app.listen(PORT, () => {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});

