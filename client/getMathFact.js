//    Example math fact url
//   "https://numbersapi.p.rapidapi.com/1729/math?fragment=true&json=true"
const baseURL = "https://numbersapi.p.rapidapi.com/";
const endURL = "/math?fragment=true&json=true";
//placeholder for default data to pass to updateDOM
let an_arr = [{}];
//limit requests
let request_count = 0;

//DELETE async function to clear server data
async function delData(delurl = "") {
  try {
    const del_response = await fetch(delurl, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const empty_array = await del_response.json();

    console.log(
      "delData : delete request sent to server and response received"
    );
    console.log("delData  : empty_server_data \n", empty_array);

    return empty_array;
  } catch (error) {
    console.log("error", error);
  }
}

//on page load clear data on server
window.onload = delData("/delmath");

async function getMathFact(options) {
  try {
    const response = await axios.request(options);
    console.log("response from axios request", response.data);
    const math_fact = {
      number: response.data.number,
      text: response.data.text,
    };
    console.log("getMathFact: math_fact \n", math_fact);
    return math_fact;
  } catch (error) {
    console.log("error", error);
  }
}

//POST async function to post data to server
async function postData(url = " ", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const newData = await response.json();
    console.log("postData : data posted to server and response received");
    console.log("postData : data posted to server is ... \n", newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

//GET async function to get all server data
async function getServerData(a_url = "") {
  try {
    const server_response = await fetch(a_url);

    //.json() method to parse JSON responses into a usable JavaScript object literal or array automagically
    const server_data = await server_response.json();
    console.log("getServerData, server_response.json() \n ", server_data);

    return server_data;
  } catch (error) {
    console.log("get all server data ... error", error);
  }
}

//update DOM
async function updateDOM(data_from_server = an_arr) {
  console.log("updateDOM: ... data to display \n", data_from_server);
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";
  data_from_server.forEach(function (element, index) {
    const fact_div = document.createElement("div");
    fact_div.classList.add(`new_fact`);
    fact_div.innerHTML = `Number: ${element["number"]} Fact: ${element["text"]}`;

    resultContainer.appendChild(fact_div);
  });
}

//event listener
document
  .getElementById("get_math_fact")
  .addEventListener("click", performAction);

async function performAction() {
  //validate if user enetered an integer
  let input_box = document.getElementById("number_input_box");
  let a_number = document.getElementById("number_input_box").value;
  console.log(typeof a_number);

  // if (!Number.isInteger(parseInt(a_number))) {
  if (
    a_number === "" ||
    !Number.isInteger(Number(a_number)) ||
    Number(a_number) < 0
  ) {
    // input_box.placeholder = "Error: Please enter an integer";
    alert("Error: Please enter a positive integer");
    console.log("User did not enter an integer");
    return;
    //clear server....
    // delData("/delmath");
    // request_count = 0;
    // return;
  }

  //clear server after 5 requests, still proceeds with current request
  request_count += 1;
  console.log("request number: ", request_count);
  if (request_count > 6) {
    console.log("Max Reached");
    //clear server....
    delData("/delmath");
    //reset request count
    request_count = 0;
  }

  let a_url = baseURL + a_number + endURL;
  var axios_req_options = {
    method: "GET",
    // url: 'https://numbersapi.p.rapidapi.com/1729/math',
    url: a_url,
    params: { fragment: "true", json: "true" },
    headers: {
      "x-rapidapi-key": "823649a8e3msh93b3ac470417760p1d8fe7jsnf6823270f83e",
      "x-rapidapi-host": "numbersapi.p.rapidapi.com",
    },
  };
  getMathFact(axios_req_options).then(function (math_fact) {
    return postData("/mathfact", math_fact)
      .then(function () {
        return getServerData("/all");
      })
      .then(function (server_data) {
        return updateDOM(server_data);
      });
  });
}
