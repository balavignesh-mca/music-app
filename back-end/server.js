const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 6000;
const app = express();

connectDb();

app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoute"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
