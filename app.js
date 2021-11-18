// express module
const express = require('express');

// express application to be used
const app = express();

const port = 9051;

var codeList = [ 'CAN', 'USA', 'MEX', 'BLZ', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'PAN' ];

// list to be added to as paths are created
const pathCache = new Map();

// Country objects to be used in place of database
const canada = {
  name: 'Canada',
  code: 'CAN',
  adjacent: []
}

const unitedStates = {
  name: 'United States of America',
  code: 'USA',
  adjacent: []
}

const mexico = {
  name: 'Mexico',
  code: 'MEX',
  adjacent: []
}

const belize = {
  name: 'Belize',
  code: 'BLZ',
  adjacent: []
}

const guatemala = {
  name: 'Guatemala',
  code: 'GTM',
  adjacent: []
}

const elSalvador = {
  name: 'El Salvador',
  code: 'SLV',
  adjacent: []
}

const hondorus = {
  name: 'Hondorus',
  code: 'HND',
  adjacent: []
}

const nicaragua = {
  name: 'Nicaragua',
  code: 'NIC',
  adjacent: []
}

const costaRica = {
  name: 'Costa Rica',
  code: 'CRI',
  adjacent: []
}

const panama = {
  name: 'Panama',
  code: 'PAN',
  adjacent: []
}

// add adjacent countries to the country objects
canada.adjacent.push(unitedStates);

unitedStates.adjacent.push(canada);
unitedStates.adjacent.push(mexico);

mexico.adjacent.push(unitedStates);
mexico.adjacent.push(guatemala);
mexico.adjacent.push(belize);

belize.adjacent.push(mexico);
belize.adjacent.push(guatemala);

guatemala.adjacent.push(mexico);
guatemala.adjacent.push(belize);
guatemala.adjacent.push(hondorus);
guatemala.adjacent.push(elSalvador);

hondorus.adjacent.push(guatemala);
hondorus.adjacent.push(elSalvador);
hondorus.adjacent.push(nicaragua);

elSalvador.adjacent.push(guatemala);
elSalvador.adjacent.push(hondorus);

nicaragua.adjacent.push(hondorus);
nicaragua.adjacent.push(costaRica);

costaRica.adjacent.push(nicaragua);
costaRica.adjacent.push(panama);

panama.adjacent.push(costaRica);


// server listens on port 9051 for incoming connections
app.listen(process.env.PORT || port, () => console.log('Listening on port 9051!'));

// ENDPOINTS
app.get('/', function(req, res) {
  res.status(200);
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Please enter a valid country code from this list ${codeList}\nand enter it in this format <url>/<country_code>`)
});


app.get('/:code', function(req, res) {
  var countryCode = req.params['code'].toUpperCase();

  // check if valid code is input
  if(!codeList.includes(countryCode)) {
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${countryCode} is an invalid country code, please select from the following list of country codes: ${codeList}`);
  } else if (pathCache.has(countryCode)) {
    // check if path from USA to given country code has been cached
    console.log(`Found ${countryCode} in cache, returning path`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(pathCache.get(countryCode).toString());
  } else {
    // else find the path from USA to the given country code and add it to the cache
    var path = findPath(unitedStates, countryCode);
    console.log('Sending Path: ' + path);
    pathCache.set(countryCode, path);
    res.setHeader('Content-Type', 'text/plain');
    res.end(path.toString());
  }
});

app.get('/*', function(req, res) {
  var countryCode = req.params['code'].toUpperCase();

  // check if valid code is input
  if(!codeList.includes(countryCode)) {
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${countryCode} is an invalid country code, please select from the following list of country codes: ${codeList}`);
  }
});


/**
 * HELPER METHOD
 * This applies Breadth First Search (BFS) to the root country being passed in
 * to find the shortest path between the root country and the country that the
 * country code belongs to. Country objects and nodes are synonomous in this implementation
 *
 * @param rootCountry - the country object that will be used as the root node
 *        for the BFS. The Country we want the shortest path from.
 * @param countryCode - the code of the country object that we want the shortest
 *        path to.
 *
 * @returns - the list of all the country codes that are along the shortest path
 *          from the source country to the destination country
*/
function findPath(rootCountry, countryCode) {
  var queue = [rootCountry];
  var visited = [];
  var paths = new Map();
  paths.set(rootCountry.code, [rootCountry.code]);
  var currentCountry;

  // loop through the queue adding unvisited nodes to
  while (queue.length > 0) {
    if (visited.includes(queue[0])) {
      console.log('removing visited from queue');
      queue.shift();
    } else {
      currentCountry = queue[0];
      console.log('Current Country Code: ' + currentCountry.code);
      visited.push(currentCountry);
      if (currentCountry.code == countryCode) {
        var path = paths.get(currentCountry.code);
        console.log('Returning Path: ' + path);
        return path;
      }

      currentCountry.adjacent.forEach((adjacentCountry) => {
        if(!visited.includes(adjacentCountry)) {
          queue.push(adjacentCountry);

          // if the country code exists in the map, then its shortest path has already
          // been found and there is no need to overwrite it
          if(!paths.has(adjacentCountry.code)) {
            var currentPath = paths.get(currentCountry.code).slice(0);
            currentPath.push(adjacentCountry.code);
            paths.set(adjacentCountry.code, currentPath);
            console.log(`adjacentCountry: ${adjacentCountry.code} and the current path list AFTER ${currentPath}`);
          }
        }
      });
      console.log('dequeued' + queue.shift());
    }
  }
}
