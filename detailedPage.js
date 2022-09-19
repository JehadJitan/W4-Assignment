//RENDER DETAILED COUNTRY PAGE

const renderDetailedPage = (countriesData) => {
  const countryElement = document.querySelector(".country");
  let country = countriesData[0];
  let mainDiv = "";

  //FORMAT NATIVENAME+BORDER+LANGUAGE+CURRENCY
  const nativeNames = country.name.nativeName;
  const nativeName = Object.values(nativeNames)[0].common;
  const currencies = country.currencies;
  let currencyArr = [];
  for (const key in currencies) {
    currencyArr.push(currencies[key].name);
  }
  const currency = currencyArr.join(", ");
  const languages = country.languages;
  let languagesArr = [];
  for (const key in languages) {
    languagesArr.push(languages[key]);
  }
  const language = languagesArr.join(", ");
  threeBorders = country.borders.slice(0, 3);
  const borders = Object.assign({}, threeBorders);

  mainDiv += `
  <div class="countryImage">
  <img src="${country.flags.svg}" alt="${country.name.common}">
  </div>
  <div class="countryDetails">
  <div class="details">
      <div class="firstColumn">
          <h2 class="countryName">${country.name.common}</h2>
          <ul>
              <li>
                  <span class="inputLabel">Native Name: </span>
                  <span>${nativeName}</span>
              </li>
              <li>
                  <span class="inputLabel">Population: </span>
                  <span>${country.population.toLocaleString("en")}</span>
              </li>
              <li>
                  <span class="inputLabel">Region: </span>
                  <span>${country.region}</span>
              </li>
              <li>
                  <span class="inputLabel">Sub Region: </span>
                  <span>${country.subregion}</span>
              </li>
              <li>
                  <span class="inputLabel">Capital: </span>
                  <span>${country.capital}</span>
              </li>
  
          </ul>
      </div>
      <div class="secondColumn">
          <ul>
              <li>
                  <span class="inputLabel">Top Level Domain: </span>
                  <span>${country.tld}</span>
              </li>
              <li>
                  <span class="inputLabel">Currencies: </span>
                  <span>${currency}</span>
              </li>
              <li>
                  <span class="inputLabel">Languages: </span>
                  <span>${language}</span>
              </li>
          </ul>
      </div>
  </div>
  ${
    Object.keys(borders).length === 0
      ? ""
      : `
     <div class="borderCountries">
         <div class="borderCountriesLabel">
             <h4>Border Countries:</h4>
         </div>
         <div class="borderCountriesButton">
         ${Object.keys(borders)
           .map(function (key) {
             return (
               "<button class='borderButton'  value='" +
               borders[key] +
               "'>" +
               borders[key] +
               "</button>"
             );
           })
           .join("")}    
         </div>`
  }
     </div>`;
  countryElement.innerHTML = mainDiv;
};

document.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("isDark");
  isDark === "yes" ? darkModeTheme() : lightModeTheme();
  const url = window.location.href.toString();
  if (url.includes("countryDetails.html")) {
    initializeDetailsPage();
    loadEventListeners();
  } else {
    //   getAllCountries();
    loadHomeBar();
  }
});

const getDetailedCountry = (name) => {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then((response) => response.json())
    .then(function (response) {
      const countriesData2 = response;
      console.log(countriesData2);
      renderDetailedPage(countriesData2);
    })
    .catch((err) => console.log("Error:", err));
};
// getCountry("germany");

const initializeDetailsPage = () => {
  const name = localStorage.getItem("country-name");
  getDetailedCountry(name);
};
