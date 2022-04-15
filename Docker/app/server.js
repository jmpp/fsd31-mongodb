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

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});