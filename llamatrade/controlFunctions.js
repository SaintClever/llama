const APCA_API_KEY_ID = import.meta.env.VITE_APCA_API_KEY_ID;
const APCA_API_SECRET_KEY = import.meta.env.VITE_APCA_API_SECRET_KEY;

// Historical Auctions
let historicalSymbol = document.querySelector("#historical_symbol");
let startDate = document.querySelector("#start_date");
let endDate = document.querySelector("#end_date");

// User Stock Pick
let userStockPick = async () => {
  let removeSpaces = historicalSymbol.value.replaceAll(" ", "");
  let symbol = encodeURIComponent(removeSpaces).toUpperCase();
  
  try {
    const url = `https://data.alpaca.markets/v1beta1/news?sort=desc&limit=1&symbols=${symbol}`;
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
    
    userChart.innerHTML = 
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
}


// Historical Quotes
let historicalQuotes = async () => {
  let removeSpaces = historicalSymbol.value.replaceAll(" ", "");
  let symbol = encodeURIComponent(removeSpaces).toUpperCase();

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

export { userStockPick, historicalQuotes };