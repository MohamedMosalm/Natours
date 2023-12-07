const express = require("express");

const app = express();

const port = 3000;
const hostName = "127.0.0.1";

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});
