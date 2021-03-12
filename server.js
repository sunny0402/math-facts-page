let math_fact_array = [];

const express = require("express");
const app = express();

/* Middleware*/
//body-parser middleware: grab HTTP body, decode info , append to req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "500kb" }));
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cors = require("cors");
app.use(cors());

// rate limit: https://blog.logrocket.com/rate-limiting-node-js/
const myrateLimit = require("express-rate-limit");
const thelimit = myrateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 1000,
  message: "You have exceeded the 1000 requests in 24 hrs limit!",
  headers: true,
});
app.use(thelimit);

/* Initialize the main project folder*/
app.use(express.static("client"));

const port = 3000;
/* Spin up the server*/
//for deploying app: process.env.PORT
const server = app.listen(process.env.PORT || port, listening);
function listening() {
  console.log(`running on localhost: ${port}`);
}

// GET route
app.get("/all", sendData);

function sendData(request, response) {
  //options: res.send(), res.json(), res.end()
  console.log("server.js, sendData incoming get request is", request.body);

  console.log("server.js, sendData response is \n", math_fact_array);

  response.json(math_fact_array);
}

//POST route
app.post("/mathfact", addMathFact);

function addMathFact(req, res) {
  console.log(
    "addMathFact, math_fact_array BEFORE push new data",
    math_fact_array
  );
  console.log("addMathFact, incoming post request body", req.body);

  math_fact_array.push({ number: req.body.number, text: req.body.text });

  console.log(
    "addMathFact, math_fact_array AFTER push new data",
    math_fact_array
  );

  res.json(math_fact_array);
}

// Delete route
app.delete("/delmath", clearMathFacts);

function clearMathFacts(req, res) {
  console.log("clearMathFacts, incoming req.body", req.body);
  console.log(
    "clearMathFacts, math_fact_array BEFORE delete data",
    math_fact_array
  );

  while (math_fact_array.length) {
    math_fact_array.pop();
  }

  console.log(
    "clearMathFacts, math_fact_array AFTER delete data",
    math_fact_array
  );

  res.json(math_fact_array);
}
