// import APCA_API_KEY from "./env.js";
const url = "https://paper-api.alpaca.markets/v2/account";

// Account
let accountNumber = document.querySelector("#account_number");
let buyingPower = document.querySelector("#buying_power");
let cash = document.querySelector("#cash");

// Trading
let symbol = document.querySelector("#symbol");
let quantity = document.querySelector("#quantity");
let buy = document.querySelector("#buy");
let sell = document.querySelector("#sell");

// Historical Auctions
let startDate = document.querySelector("#start_date");
let endDate = document.querySelector("#end_date");
let historicalSymbol = document.querySelector("#historical_symbol");

// Account Activites
let table = document.querySelector("#table");
let tbody = table.querySelector("tbody");


// Account Data
(accountData = async () => {
  try {
    const url = "https://paper-api.alpaca.markets/v2/account";
    const config = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': APCA_API_KEY['APCA-API-KEY-ID'],
        'APCA-API-SECRET-KEY': APCA_API_KEY['APCA-API-SECRET-KEY']
      }
    };

    let response = await axios.get(url, config);
    
    if (response.status !== 200) {
      throw new Error("API Error");
    }

    const data = await response.data;
    // console.log(data);

    accountNumber.textContent = `Account#: ${data.account_number}`;
    buyingPower.innerText = `Buying Power:\n${data.currency}: $${data.buying_power}`;
    cash.innerText = `Cash:\n${data.currency}: $${data.cash}`;
  } catch(error) {
    console.log(error);
  }
})();


// Account Activities
(accountActivities = async () => {
try {
  const url = "https://paper-api.alpaca.markets/v2/account/activities?direction=desc&page_size=6";
  const config = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'APCA-API-KEY-ID': APCA_API_KEY['APCA-API-KEY-ID'],
      'APCA-API-SECRET-KEY': APCA_API_KEY['APCA-API-SECRET-KEY']
    }
  };

  let response = await axios.get(url, config);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.data;
  
  for (let i in data) {
    let tr = `<tr>
      <td>${data[i].activity_type}</td>
      <td>${data[i].qty}</td>
      <td>${data[i].price}</td>
      <td>${data[i].date}</td>
    </tr>`
    tbody.innerHTML += tr;
  };
} catch(error) {
  console.error(error);
}
})();


// Historical auctions
let historicalAuctions = async () => {
  try {
    const url = `https://data.alpaca.markets/v2/stocks/auctions?symbols=${historicalSymbol}&start=${startDate}&end=${endDate}&limit=1000&feed=sip&sort=asc`;
    const config = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': APCA_API_KEY['APCA-API-KEY-ID'],
        'APCA-API-SECRET-KEY': APCA_API_KEY['APCA-API-SECRET-KEY']
      }
    };

    let response = await axios.get(url, config);

    if (response.status !== 200) {
      throw new Error("API Error");
    }

    const data = response.data;
    console.log(data);

  } catch(error) {
    console.error(error);
  }
}

historicalAuctions();


// Event listeners
// button.addEventListener("click", (e) => {
//   e.preventDefault();
//   apiCall();
// });