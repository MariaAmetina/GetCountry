'use strict';

const countriesContainer = document.querySelector('.countries');

// const getCountry = function (country) {
//   // AJAX call country
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send(); //ждем загрузки данных

//   request.addEventListener('load', function () {
//     //как загрузятся данные, сработает этот EventListener с 'load' и вызовется коллбэк
//     //получаем JSON строку, которую нужно преобразовать в объект, с помощью деструктуризации, т.к. после JSON.parse получаем массив с объектом внутри [{}]
//     const [data] = JSON.parse(this.responseText); // responseText - это то, что мы получаем (JSON строка с данными нужной нам страны)
//     console.log(data);
//     renderCountry(data)
//
//   });
// };

const renderCountry = function (data, className) {
  const html = `
      <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(2)} mil people</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
      </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// // getCountry('russia');
// // getCountry('usa');
// // getCountry('portugal');

// ////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////
// const renderError = function (msg) {
//   countriesContainer.insertAdjacentText('beforeend', msg);
//   //   countriesContainer.style.opacity = 1;
// };

// const getJSON = function (url, errorMsg = 'Something went wrong') {
//   return fetch(url).then(response => {
//     if (!response.ok) {
//       throw new Error(`${errorMsg} (${response.status})`); //сформированная ошибка сразу приостановит работу дальнейшую, ее перехватит .catch и выведет наше сообщение в ${err.message}
//     }

//     return response.json(); //// json() метод всегда можно вызвать (для получения такого объекта [{}] из полученной строки) на удачном результате от fetch, в нашем случае у response. Этот метот ВОЗВРАЩАЕТ также PROMISE
//   });
// };

// // const getCountryData = function (country) {
// //   //Country 1
// //   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
// //     .then(response => {
// //       if (!response.ok) {
// //         throw new Error(`Country not found (${response.status})`); //сформированная ошибка сразу приостановит работу дальнейшую, ее перехватит .catch и выведет наше сообщение в ${err.message}
// //       }

// //       return response.json(); //// json() метод всегда можно вызвать (для получения такого объекта [{}] из полученной строки) на удачном результате от fetch, в нашем случае у response. Этот метот ВОЗВРАЩАЕТ также PROMISE
// //     })
// //     .then(data => {
// //       renderCountry(data[0]);

// //       const neighbour = data[0].borders[0];

// //       if (!neighbour) return;

// //       //Country 2
// //       return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`); //нужно вернуть результат феча - это промис, чтобы дальше применить метод .then
// //       // .then, .catch, .finally всегда возвращают промис
// //     })
// //     .then(response => response.json())
// //     .then(data => renderCountry(data, 'neighbour'))
// //     .catch(err => {
// //       console.error(`${err}`);
// //       renderError(`Something went wrong ${err.message}. Try again!`);
// //     })
// //     .finally(() => {
// //       countriesContainer.style.opacity = 1; //вставляем эту строку кода сюда, убрав из двух предыдущих ф-ций, потому что .finally() выполняется в любом случае независимо от удачной или провальной подгрузки информации с API
// //     });
// // };

// const getCountryData = function (country) {
//   //Country 1
//   getJSON(
//     `https://restcountries.eu/rest/v2/name/${country}`,
//     'Country not found'
//   )
//     .then(data => {
//       renderCountry(data[0]);

//       const neighbour = data[0].borders[0];

//       if (!neighbour) throw new Error('No neighbour found');

//       //Country 2
//       return getJSON(
//         `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
//         'Country not found'
//       );
//     })
//     .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => {
//       console.error(`${err}`);
//       renderError(`Something went wrong: ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1; //вставляем эту строку кода сюда, убрав из двух предыдущих ф-ций, потому что .finally() выполняется в любом случае независимо от удачной или провальной подгрузки информации с API
//     });
// };

// getCountryData('usa');
// getCountryData('germany');

// REJECT ПРИ ИСПОЛЬЗОВАНИИ FETCH может быть только в случае отсутствия интернета

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// ASYNC AWAIT

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const whereAmI = async function () {
  try {
    //Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    //Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

    if (!resGeo.ok) throw new Error('Problem getting location data'); //если информация не зафетчится с сайта, то создастся ошибка с этой информацией. И не надо будет угадывать по дефолтной ошибке, которую дает браузер, угадывать, что же произошло

    const dataGeo = await resGeo.json();

    //Country data
    const response = await fetch(
      `https://restcountries.eu/rest/v2/name/${dataGeo.country}`
    ); //console.log(response); // это то же самое, что и fetch(`https://restcountries.eu/rest/v2/name/${country}`).then(res => console.log(res));

    if (!response.ok) throw new Error('Problem getting country name');

    const data = await response.json();
    renderCountry(data[0]);
  } catch (err) {
    console.error(`${err}💥`);
    renderError(`💥 ${err.message}`);
  }
};

whereAmI();

/////////////////////////////
// Another example

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`); //сформированная ошибка сразу приостановит работу дальнейшую, ее перехватит .catch и выведет наше сообщение в ${err.message}
    }

    return response.json(); //// json() метод всегда можно вызвать (для получения такого объекта [{}] из полученной строки) на удачном результате от fetch, в нашем случае у response. Этот метот ВОЗВРАЩАЕТ также PROMISE
  });
};

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c1}`
    // );
    // const [data2] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c2}`
    // );
    // const [data3] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c3}`
    // ); //т.к. не имеет значения порядок появления стран, нет смысла запускать их друг за другом, это занимает много времени.

    //поэтому будем использовать Promise.all, чтобы наши запросы загружались одновременно
    const data = await Promise.all([
      //если хоть один запрос вернет ошибку, то все будет ошибкой
      getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
    ]);

    console.log(data.map(country => country[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3Countries('russia', 'germany', 'sweden');
