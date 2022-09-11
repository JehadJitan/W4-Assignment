//PAGE RELOADING TIMEOUT
let tempCountry = [];
let favouritesArray = [];

const refresh = () => {
  setTimeout(() => {
    window.location.reload();
  }, 50);
};

//DARK-LIGHT-MODE

const darkModeIcon = document.getElementById("iconToggle");
const darkModeAnchor = document.getElementById("darkModeToggle");
let darkMode = true;

const lightModeTheme = () => {
  document.documentElement.style.setProperty("--bg-color", "#fafafa");
  document.documentElement.style.setProperty("--text-color", "#000000");
  document.documentElement.style.setProperty("--elements-color", "#ffffff");
  document.documentElement.style.setProperty("--input-color", "#858585");
  document.documentElement.style.setProperty(
    "--box-shadow",
    "rgba(100, 100, 111, 0.2) 0px 10px 30px 0px;"
  );
  darkModeAnchor.innerHTML = `<i id="toggle-icon" class="far fa-moon"></i> Dark Mode`;
  localStorage.setItem("isDark", "no");
  darkMode = false;
};

const darkModeTheme = () => {
  document.documentElement.style.setProperty("--bg-color", "#121212");
  document.documentElement.style.setProperty("--text-color", "#ffffff");
  document.documentElement.style.setProperty("--elements-color", "#1e1e1e");
  document.documentElement.style.setProperty("--input-color", "#ffffff");
  document.documentElement.style.setProperty("--box-shadow", "none");

  localStorage.setItem("isDark", "yes");
  darkModeAnchor.innerHTML = `<i id="toggle-icon" class="fas fa-moon"></i> Light Mode`;
  darkMode = true;
};

//DARK-LIGHT-MODE-CLICK

darkModeAnchor.addEventListener("click", (e) => {
  darkMode ? lightModeTheme() : darkModeTheme();
  refresh();
  e.preventDefault();
});

///
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

//DOM LOAD

document.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("isDark");
  isDark === "yes" ? darkModeTheme() : lightModeTheme();
  const url = window.location.href.toString();
  if (url.includes("countryDetails.html")) {
    initializeDetailsPage();
    loadEventListeners();
  } else {
    getAllCountries();
    loadHomeBar();
  }
});

let loadHomeBar = () => {
  //DROPDOWN

  const dropbtn = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");

  dropbtn.addEventListener("click", (e) => {
    dropdownContent.classList.toggle("show");
    e.preventDefault();
  });

  //REGIONS

  const regions = document.querySelectorAll(".region");
  regions.forEach((region) => {
    region.addEventListener("click", (e) => {
      const value = e.target.innerHTML.toLowerCase();

      getRegionCountries(value);
      dropdownContent.classList.remove("show");
      e.preventDefault();
    });

    //SEARCH FOR A COUNTRY

    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const value = e.target.value.toLowerCase();

        getSearchedCountry(value);
        e.target.value = "";
        e.preventDefault();
      }
    });
  });

  const saveCountryName = (e) => {
    if (e.target.parentElement.classList.contains("country-link")) {
      const link = e.target.parentElement;
      const countryName = link.getAttribute("data-name").toLowerCase();

      localStorage.removeItem("country-name");
      localStorage.setItem("country-name", countryName);
      window.location.href = "./countryDetails.html";
    }
  };

  const countries = document.querySelector(".countries");
  countries.addEventListener("click", saveCountryName);
};

//COUNTRY PAGE EVENT LISTENERS

const loadEventListeners = () => {
  const saveCountryName = (e) => {
    if (e.target.classList.contains("country-btn")) {
      const btn = e.target;
      const countryCode = btn.value.toLowerCase();

      localStorage.removeItem("country-code");
      localStorage.setItem("country-code", countryCode);

      const code = JSON.stringify(localStorage.getItem("country-code"));
      getCountryByCode(code);
      refresh();
    }
  };
  const country = document.querySelector(".country");
  country.addEventListener("click", saveCountryName);
};

//MAIN PAGE RENDER

const renderMainPage = (countriesData) => {
  const countries = document.querySelector(".countries");
  favouritesArray = JSON.parse(localStorage.getItem("favouriteCoutries")) ?? [];
  renderFavourites();
  let country = countriesData;
  let cardsContainer = "";

  Object.entries(country).forEach((item) => {
    cardsContainer += `
           <div class="card" id="${
             item[1].name.common
           }" ondragstart="dragstartHandler(event);" ondragend="dragendHandler(event);" draggable="true">
           <a data-name="${
             item[1].name.common
           }" class="country-link" draggable="false">
             <img class="cardImg" src="${
               item[1].flags.svg
             }" draggable="false" alt="${item[1].name.common}">
           </a>
          
           <div class="cardBody">
               <a data-name="${item[1].name.common}" class="country-link">
                 <h3 class="countryName">${item[1].name.common}</h3>
               </a>
               <ul>
                 <li>
                    <span class="inputLabel">Population: </span>
                    <span>${item[1].population.toLocaleString("en")}</span>
                  </li>
                 <li>
                    <span class="inputLabel">Region: </span>
                    <span>${item[1].region}</span>
                </li>
                 <li>
                    <span class="inputLabel">Capital: </span>
                    <span>${item[1].capital}</span>
                </li>
               </ul>
              <div class="starDiv">
              <span id="starDivContent"><i class="fa-solid fa-star fa-xl"></i></span>
              </div>
           </div>
           </div>
         `;
    countries.innerHTML = cardsContainer;
    isFavourite(item[1].name.common);
  });
};

function renderFavourites() {
  const favourites = document.querySelector(".favouritesList");
  let favouritesListContainer = "";

  favouritesArray.forEach((item) => {
    favouritesListContainer += `
      <div class="favouriteCountry" id="${item.name}" draggable="true" ondragstart="drag(event)" onClick="removeFavourite(event)">
      <div class="flagCountry">
      <img class="favouriteCountryImage" src="${item.flag}" alt="${item.name}">
        <span class="favouriteCountryName">${item.name}<span>
        </div>
        <div class="remove">
        <span class="removeFavourite"><i class="fa-solid fa-circle-xmark  text-red"></i></span>
        </div>
      </div>
    `;
  });
  favourites.innerHTML = favouritesListContainer;
}

function dragstartHandler(ev) {
  console.log("dragStart");
  const dataList = ev.dataTransfer.items;
  console.log(ev.target.id);
  dataList.add(ev.target.id, "text/plain");
  const tempCountry2 = tempCountry.find((country) => {
    return country.name.common === ev.target.id;
    // country[1].capital;
  });
  console.log(tempCountry2);
  ev.dataTransfer.setData("countryName", tempCountry2.name.common);
  ev.dataTransfer.setData("countryFlag", tempCountry2.flags.svg);
}

function dropHandler(ev) {
  console.log("Drop");
  console.log(ev.dataTransfer.getData("countryName"));
  if (
    favouritesArray.some(
      (favourite) => favourite.name === ev.dataTransfer.getData("countryName")
    )
  ) {
    return;
  }
  favouritesArray.push({
    name: ev.dataTransfer.getData("countryName"),
    flag: ev.dataTransfer.getData("countryFlag"),
  });
  localStorage.setItem("favouriteCoutries", JSON.stringify(favouritesArray));
  renderFavourites();
  ev.preventDefault();
  const data = event.dataTransfer.items;
}

function dragoverHandler(ev) {
  console.log("dragOver");
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

function dragendHandler(ev) {
  console.log("dragEnd");
  const dataList = ev.dataTransfer.items;
  for (let i = 0; i < dataList.length; i++) {
    dataList.remove(i);
  }
  dataList.clear();
}

function removeFavourite(ev) {
  const tempCountry2 = tempCountry.find((country) => {
    return country.name.common === ev.target.id;
  });
  let favouriteToRemove = tempCountry2.name.common;
  let filteredPeople = favouritesArray.filter(
    (item) => item.name !== favouriteToRemove
  );
  favouritesArray = [...filteredPeople];
  localStorage.setItem("favouriteCoutries", JSON.stringify(favouritesArray));
  renderFavourites();
}

function isFavourite(country) {
  // console.log(favouritesArray);
  const found = favouritesArray.some((el) => el.name === country);
  if (found) {
    console.log(country, "is a favourite and should be yellow stared");
    document.getElementById("starDivContent").style.color = "oranged";
  }
}

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
  // console.log(borders);

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

//FETCHING APIS

const getAllCountries = () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then(function (response) {
      const countriesData2 = response;
      renderMainPage(countriesData2);
      tempCountry = response;
    })
    .catch((err) => console.log("Error:", err));
};

const getSearchedCountry = (name) => {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then((response) => response.json())
    .then(function (response) {
      const countriesData2 = response;
      console.log(countriesData2);
      renderMainPage(countriesData2);
    })
    .catch((err) => console.log("Error:", err));
};

const getRegionCountries = (region) => {
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((response) => response.json())
    .then(function (response) {
      const countriesData2 = response;
      console.log(countriesData2);
      renderMainPage(countriesData2);
    })
    .catch((err) => console.log("Error:", err));
};

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

const getCountryByCode = (code) => {
  fetch(`https://restcountries.com/v3.1/alpha/${code}`)
    .then((response) => response.json())
    .then(function (response) {
      const countriesData2 = response;
      console.log(countriesData2);
      renderMainPage(countriesData2);
    })
    .catch((err) => console.log("Error:", err));
};

const initializeDetailsPage = () => {
  const name = localStorage.getItem("country-name");
  getDetailedCountry(name);
};
