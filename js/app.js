// ide deklaráljátok a függvényeket.

/* Ez valamiért nem működik...:
function ascendingOrderByCost2(data) {
  var i;
  var sorted = false;
  do {
    sorted = true;
    for (i = 0, j = 1; i < data.length; i++ , j++) {
      if (data[i].cost_in_credits === null) { data[i].cost_in_credits = 0; }
      if (data[i].hasOwnProperty(['cost_in_credits'])) {
        if (parseInt(data[i].cost_in_credits) > parseInt(data[j].cost_in_credits)) {
          temp = data[i];
          data[i] = data[j];
          data[j] = temp;
          sorted = false;
        }
      }
    }
  } while (!sorted); return data
    ;
}
*/

// Ár szerint növekvő sorrendbe rendez.
function ascendingOrderByCost(input) {
  var i; var j; var end;
  end = input.length;
  while (end--) {
    for (i = 0, j = 1; i < end; i++, j++) {
      if (getInteger(input[i].cost_in_credits) > getInteger(input[j].cost_in_credits)) {
        var temp = input[i];
        input[i] = input[j];
        input[j] = temp;
      }
    }
  } return input;
}

// Így bírkózik meg a többi függvény a null-lal és az unknown-nal:
function getInteger(value) {
  if (value !== null && value !== 'unknown') {
    return parseInt(value, 10);
  }
  return 0;
}

// A null-os objektumokot indexét összeszedi egy tömbbe.
function nullConsumableFinder(input) {
  let arrayOfIndexes = [];
  for (var k in input) {
    if (input[k].consumables === null) { arrayOfIndexes.push(k); }
  }
  return arrayOfIndexes;
}

// Megadott indexek (arrayOfIndexes) alapját kivagdos elemeket egy tömbből.
function precisionDeleter(arrayOfIndexes, array) {
  for (var i = arrayOfIndexes.length - 1; i >= 0; i--) {
    array.splice(arrayOfIndexes[i], 1);
  }
  return array;
}

// A nullokat unknown-ra állítja.
function setNulltoUnknown(array) {
  for (var i = 0; i < array.length; i++) {
    for (var k in array[i]) {
      if (array[i][k] === null) {
        array[i][k] = 'unknown';
      }
    }
  }
  return array;
}

//  Stringbe írja egy objektumokból álló tömb adatait, és saját id szerint id-zott divekbe teszi őket.
function objectWriter(arrayOfobjects) {
  var output = '';
  for (var i = 0; i < arrayOfobjects.length; i++) {
    output += `<div class=ships id=${arrayOfobjects[i].id} style="background-color: aliceblue; width:300px; margin:  10px "onclick=makeDivOnSide(${arrayOfobjects[i].id})>`;
    for (var k in arrayOfobjects[i]) {
      if (arrayOfobjects[i].hasOwnProperty([k])) {
        output += `${[k]}: ${arrayOfobjects[i][k]}<br>`;
      }
    } output += '<br></div>';
  } return output;
}

// Kitölti a kapott stringgel az area id-jű divet.
function divFiller(string) {
  document.querySelector('.spaceship-list').innerHTML += string;
}

// Egy fős (crew = 1) legénységgel rendelkező hajók darabszáma.
function getSoloShips(array) {
  if (!array.length) return false;
  var count = 0;
  var message = '';
  for (var k in array) {
    if (array[k].crew === '1') count++;
  }
  message = count + ' db egyfős legénységgel rendelkező hajó van.';
  return message;
}

// A legnagyobb cargo_capacity-vel rendelkező hajó neve (model)
function getMaxCargoCapacityShip(array) {
  if (!array.length) return false;
  var maxCargoCapacityShip = array[0];
  for (var i = 0; i < array.length; i++) {
    if (getInteger(array[i].cargo_capacity) > getInteger(maxCargoCapacityShip.cargo_capacity)) {
      maxCargoCapacityShip = array[i];
    }
  } return ('A legnagyobb kapacitású model a ' + maxCargoCapacityShip.model);
}

// Az összes hajó utasainak (passengers) összesített száma
function getTotalPassengers(array) {
  if (!array.length) return false;
  var message = '';
  var totalPassengers = 0;
  for (var i in array) {
    if (array[i].hasOwnProperty(['passengers'])) {
      totalPassengers += getInteger(array[i].passengers);
    }
  }
  message = totalPassengers + ' Az összes hajó utasainak összesített száma.';
  return message;
}
// A leghosszabb(lengthiness) hajó képének a neve
function getPicOfLongestShip(array) {
  if (!array.length) return false;
  var longestShip = array[0];
  for (var i = 0; i < array.length; i++) {
    if (array[i].hasOwnProperty(['lengthiness'])) {
      if (getInteger(array[i].lengthiness) > getInteger(longestShip.lengthiness)) {
        longestShip = array[i];
      }
    }
  }  return ('A leghosszabb hajó képének a neve: ' + longestShip.image);
}

// Egy lentre helyezett divbe írja ki a kért statisztikát.
function statWriter(array) {
  var statDiv = document.createElement('DIV');
  statDiv.className = 'statDiv';
  statDiv.style.border = '3px solid black';
  statDiv.style.position = 'absolute; bottom: 0';
  statDiv.innerHTML = '<b>Statisztikák:</b> <br>' + getPicOfLongestShip(array) + '<br>'
  + getTotalPassengers(array) + '<br>' + getMaxCargoCapacityShip(array) + '<br>' + getSoloShips(array);
  var list = document.querySelector('.spaceship-list');
  list.appendChild(statDiv);
}


// Keresés (nem case sensitive). Nem túl elegánsan  :) Mivel a nyers tömbadatok a successAjaxban vannak, ezért ez a kereső
// kiolvassa a kiírt divekből childNode-ok alapján. Először megvizsgálja, hogy a modelnév mutat-e egyezést a
// search inputtal, és ha igen, bedobja egy tömbbe, úgy hogy mögé van csatolva az ID-je. A tömböt ABC-sorba
// rendezi, és levágja az utolsó 2 karaktert, ami így megadja az ID-t, a kiirató függvény paraméterét.
function search() {
  var input = document.getElementById('search-text').value.toLowerCase();
  var divs = document.querySelectorAll('.ships');
  let foundArray = [];
  for (var i = 0; i < divs.length; i++) {
    var foundId = divs[i].childNodes[0].substringData(3, divs[i].childNodes[0].length);
    if (divs[i].childNodes[16].substringData(7, divs[i].childNodes[16].length).toLowerCase().search(input) > -0b1) {
      foundArray.push(divs[i].childNodes[16].substringData(7, divs[i].childNodes[16].length) + foundId);
    }
  } if (foundArray.length) {
    foundArray.sort();
    foundId = (foundArray[0].substring(foundArray[0].length - 2, foundArray[0].length));
    return makeDivOnSide(parseInt(foundId, 0o12));
  }
  return alert('Ez a részlet nem található egyik modelnévben sem.');
}
// Az eredetit nem módosítva átírja az inputtömb image-kulcsainak értékét, úgy, hogy az HTML számára olvasható
// image-tag legyen

function imageLinker(array) {
  var result = JSON.parse(JSON.stringify(array));
  for (var i = 0; i < result.length; i++) {
    result[i].image = `<br><img src=/img/${result[i].image} alt="Could not find picture for ${result[i].model}.">`;
  } return result;
}

// Bármelyik hajós div-re kattintva divet készít oldalra, ha az még nem létezik (vagyis csak a 3 alap node van benne),
// majd belemásolja a kattintott div tartalmát. Ha már van div, akkor csak kicseréli a tartalmat.

function makeDivOnSide(idNo) {
  var side = document.querySelector('.one-spaceship');
  if (side.childNodes.length < 4) {
    var sideDiv = document.createElement('DIV');
    sideDiv.innerHTML = document.getElementById(idNo).innerHTML;
    sideDiv.className = 'sideDiv';
    sideDiv.style.backgroundColor = 'aliceblue';
    side.appendChild(sideDiv);
  } else {
    document.querySelector('.sideDiv').innerHTML = document.getElementById(idNo).innerHTML
    ;
  }
}

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  // Innen lehet hívni.
  function doIt() {
    var searchBtn = document.querySelector('#search-button');
    searchBtn.addEventListener('click', search);
  }
  doIt();

  // 2. feladat:
  ascendingOrderByCost(userDatas);
  // 3. feladat:
  // 4. feladat:
  precisionDeleter(nullConsumableFinder(userDatas), userDatas);
  setNulltoUnknown(userDatas);
  divFiller(objectWriter(imageLinker(userDatas)));
  // 5. feladat:
  statWriter(userDatas);
  // 6. feladat:
}
getData('/json/spaceships.json', successAjax);
