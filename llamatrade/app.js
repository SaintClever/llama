const APCA_API_KEY_ID = import.meta.env.VITE_APCA_API_KEY_ID;
const APCA_API_SECRET_KEY = import.meta.env.VITE_APCA_API_SECRET_KEY;
const MARKETAUX_KEY = import.meta.env.VITE_MARKETAUX_KEY;


const url = "https://paper-api.alpaca.markets/v2/account";

// Canvas
let currentTradeChart = document.querySelector("#currentTradeChart");

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
let historicalSymbol = document.querySelector("#historical_symbol");
let startDate = document.querySelector("#start_date");
let endDate = document.querySelector("#end_date");
let historicalBtn = document.querySelector("#historical_btn");

// Account Activites
let table = document.querySelector("#table");
let tbody = table.querySelector("tbody");


// News
(async () => {
  try {
    const url = `https://api.marketaux.com/v1/news/all?&language=en&api_token=${MARKETAUX_KEY}`;

    let response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error("API Error");
    }

    const data = await response.data;
    console.log(data);
    
  } catch(error) {
    console.log(error);
  }
})();


// Account Data
(async () => {
  try {
    const url = "https://paper-api.alpaca.markets/v2/account";
    const config = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': APCA_API_KEY_ID,
        'APCA-API-SECRET-KEY': APCA_API_SECRET_KEY
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
(async () => {
try {
  const url = "https://paper-api.alpaca.markets/v2/account/activities?direction=desc&page_size=6";
  const config = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'APCA-API-KEY-ID': APCA_API_KEY_ID,
      'APCA-API-SECRET-KEY': APCA_API_SECRET_KEY
    }
  };

  let response = await axios.get(url, config);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.data;
  
  for (let i in data) {
    let tr = `<tr>
      <td>${data[i].activity_type === undefined ? '-': data[i].activity_type}</td>
      <td>${data[i].qty === undefined ? '-': data[i].qty}</td>
      <td>${data[i].price === undefined ? '-': data[i].price}</td>
      <td>${data[i].date === undefined ? '-': data[i].date}</td>
    </tr>`
    tbody.innerHTML += tr;
  };
} catch(error) {
  console.error(error);
}
})();


// Historical Quotes
let historicalQuotes = async () => {
  let removeSpaces = historicalSymbol.value.replaceAll(" ", "");
  let symbol = encodeURIComponent(removeSpaces);

  try {
    const url = `https://data.alpaca.markets/v2/stocks/quotes?symbols=${symbol}&start=${startDate.value}&end=${endDate.value}&limit=18&feed=sip&sort=asc`;
    const config = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': APCA_API_KEY_ID,
        'APCA-API-SECRET-KEY': APCA_API_SECRET_KEY
      }
    };

    let response = await axios.get(url, config);

    if (response.status !== 200) {
      throw new Error("API Error");
    }

    const data = response.data;    
    let quotes = data.quotes[symbol.toUpperCase()]
    let xValues = [];
    let yValues = [];

    for (let i in quotes) {
      try {
        xValues.push(quotes[i].ap);
        yValues.push(quotes[i].bp);
      } catch(error) {
        console.error(error);
      }
    }

    let count = [];
    for (let i = 0; i < 18; i++) {
      count.push(i);
    }

    new Chart("currentTradeChart", {
      type: "line",
      data: {
        labels: count,
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        scales: {
          yAxes: [{ticks: {min: 5, max: 750}}]
        }
      }
    })
  } catch(error) {
    console.error(error);
  }
}


// Event listeners
historicalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let logo = document.querySelector("#logo");
  logo.style.display = "none";
  currentTradeChart.style.display = "block";
  historicalQuotes();
})


buy.addEventListener("click", (e) => {
  e.preventDefault();
})