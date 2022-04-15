"use strict";
const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3002;

app.set("view engine", "pug");

app.use(morgan("combined"));
app.use("/static", express.static("./static"));

// App routing
app.use("/", require("./router"));

const DB_NAME = 'ny';

require('./database')
  .open(DB_NAME)
  .then(() => {
    // Démarrage de l'application Node.js
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  });

