function httpGetCovid(url, async, country = undefined, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback && callback(JSON.parse(xmlHttp.responseText), country);
    }
  }
  xmlHttp.open('GET', url, async);
  xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttp.setRequestHeader("Vary", "origin");
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function replaceAll(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "g");

  return str.replace(re, function (matched) {
    return mapObj[matched];
  });
}

function numberWithSpaces(x) {
  if(x == 'ismeretlen') return x;
  if((x % 1) != 0) x = x.toFixed(2);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function httpGetPopulation(country, async, callback) {
  var data = null;

  countryOriginal = country;

  country = replaceAll(country, dict);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var population;

      if(JSON.parse(this.responseText)['ok']) {
        population = JSON.parse(this.responseText).body.population;
      } else {
        population = 'ismeretlen';
      }

      callback && callback(population, countryOriginal);
      if (!(JSON.parse(this.responseText)['ok'])) console.log(`Error: ${country} / ${countryOriginal}`);
    }
  });

  xhr.open("GET", `https://world-population.p.rapidapi.com/population?country_name=${country.replace('&', '%26')}`, async);
  xhr.setRequestHeader("x-rapidapi-key", "6212b4dbafmsh5582db9d9807c46p1f045fjsn9a590c5eda69");
  xhr.setRequestHeader("x-rapidapi-host", "world-population.p.rapidapi.com");

  xhr.send(data);
  return xhr.responseText;
}

function main(countries) {
  var country = countries[countryNumber].Country;
  httpGetCovid(`https://api.covid19api.com/total/country/${country}/status/confirmed`, true, country, function (response, country) {
    httpGetPopulation(country, true, function (population, country) {
      var benfordNumbers = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6];

      var lastCases = 0;
      var totalCases;
      var newCases;
      var length = 0;
      var startWith = new Array(9).fill(0);

      for (var i = 0; i < response.length; i++) {
        totalCases = response[i].Cases;
        newCases = totalCases - lastCases;
        lastCases = totalCases;

        var firstChar = String(newCases).charAt(0);

        if (firstChar != 0) {
          length++;
          startWith[firstChar - 1]++;
        }
      }

      if (length == 0) {
        //error handling
      } else {

        var expectedNumbers = new Array(9);

        for (var i = 0; i < 9; i++) {
          expectedNumbers[i] = length / 100 * benfordNumbers[i];
        }

        var replacedCountry = replaceAll(country, dict);
        if (replacedCountry != '' || replaced != undefined) country = replacedCountry;

        var ctx = $('<canvas>');
        var h2 = $('<h2>').text(country);
        var p = $('<p>').html(`<b>Populáció:</b> ${numberWithSpaces(population)},<br /><b>Fertőzöttek összesen:</b> ${numberWithSpaces(totalCases)},<br /><b>Napi új fertőzöttek (átlag):</b> ${numberWithSpaces(totalCases / length)}`);
        var div = $('<div>');
        $('body').append(div);
        $(div).append([h2, ctx, p]);
        $(ctx).get(0).getContext('2d');
        h2.innerText = country
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [1, 2, 2, 4, 5, 6, 7, 8, 9],
            datasets: [{
              label: 'kapott',
              data: startWith,
              backgroundColor: new Array(9).fill('rgba(54, 162, 235, 0.7)'),
              borderColor: new Array(9).fill('rgba(54, 162, 235, 1)'),
              borderWidth: 1,
              order: 2
            },
            {
              label: 'várt',
              type: 'line',
              data: expectedNumbers,
              backgroundColor: new Array(9).fill('rgba(54, 235, 200, 0)'),
              borderColor: new Array(9).fill('rgba(225, 38, 54, 1)'),
              borderWidth: 1,
              order: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }
        });

      }
    });
  });
}

var dict = {
  'United States of America': 'United States',
  'Russian Federation': 'Russia',
  'Pitcairn': '',
  'Virgin Islands, US': 'U.S. Virgin Islands',
  'Lao PDR': 'Laos',
  'Cape Verde': 'Cabo Verde',
  'Guernsey': '',
  'Macedonia, Republic of': 'North Macedonia',
  'Saint Vincent and Grenadines': 'St. Vincent & Grenadines',
  'Svalbard and Jan Mayen Islands': '',
  'Viet Nam': 'Vietnam',
  'Netherlands Antilles': 'Netherlands',
  'South Georgia and the South Sandwich Islands': '',
  'Saint Kitts and Nevis': 'Saint Kitts & Nevis',
  'Saint-Barthélemy': 'Saint Barthelemy',
  'Saint Pierre and Miquelon': 'Saint Pierre & Miquelon',
  'Palestinian Territory': 'State of Palestine',
  'Sao Tome and Principe': 'Sao Tome & Principe',
  'Wallis and Futuna Islands': 'Wallis & Futunaaos',
  'Tanzania, United Republic of': 'Tanzania',
  'US Minor Outlying Islands': '',
  'Taiwan, Republic of China': 'Taiwan',
  'Christmas Island': '',
  'Hong Kong, SAR China': 'Hong Kong',
  'Faroe Islands': '',
  'ALA Aland Islands': '',
  'Antarctica': '',
  'French Southern Territories': '',
  'Turks and Caicos Islands': 'Turks and Caicos',
  'Jersey': '',
  'Norfolk Island': '',
  'British Indian Ocean Territory': '',
  'Macao, SAR China': 'Macao',
  'Bouvet Island': '',
  'Republic of Kosovo': '',
  'Czech Republic': 'Czech Republic (Czechia)',
  'Iran, Islamic Republic of': 'Iran',
  'Swaziland': '',
  'Brunei Darussalam': 'Brunei',
  'Heard and Mcdonald Islands': '',
  'Micronesia, Federated States of': 'Micronesia'
}

var countries = JSON.parse(httpGetCovid('https://api.covid19api.com/countries'), false);
var countryNumber = 0;
function interval() {
  if (countryNumber == countries.length) {

  } else {
    main(countries);
    countryNumber++;
    setTimeout(interval, 1000);
  }
}
interval();