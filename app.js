const express = require("express");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const hostName = process.env.HTTP_HOST || "127.0.0.1";

app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});
