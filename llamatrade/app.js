const APCA_API_KEY_ID = import.meta.env.VITE_APCA_API_KEY_ID;
const APCA_API_SECRET_KEY = import.meta.env.VITE_APCA_API_SECRET_KEY;

import {userStockPick, historicalQuotes} from './controlFunctions';

const url = "https://paper-api.alpaca.markets/v2/account";
const defaultImg = "https://www.benzinga.com/next-assets/images/schema-publisher-logo-benzinga.png";

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
let dialog = document.querySelector("#dialog");

// User Stock Pick
let historicalBtn = document.querySelector("#historical_btn");

// Account Activites
let table = document.querySelector("#table");
let tbody = table.querySelector("tbody");

// News
let logo = document.querySelector("#logo");
let userChart = document.querySelector("#userChart");
let globalChart = document.querySelector("#globalChart");


// News
(async () => {
  try {
    const url = 'https://data.alpaca.markets/v1beta1/news?sort=desc&limit=1';
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

    globalChart.innerHTML = 
        `
        <a href="${data.news[0].url}" target="_blank">
          <h3>${data.news[0].headline}</h3>
          <img style="width: 250px;" src="${data.news[0].images[2] === undefined ? defaultImg: data.news[0].images[2].url}" alt="${data.news[0].source}"><br>
          Source: ${data.news[0].source}<br>
          Author: ${data.news[0].author}
        </a>
        `;
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
    const url = "https://paper-api.alpaca.markets/v2/account/activities?direction=desc&page_size=7";
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


// Event listeners
// Show History data
historicalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logo.style.display = "none";
  currentTradeChart.style.display = "block";
  historicalQuotes();
  userStockPick();
});


// Buy Order
buy.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.style.display = "block";
  setTimeout(() => {
    dialog.style.display = "none";
  }, 5000);
});