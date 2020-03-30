# Pinning locations Spain + Radius scale

Would you like to know how to make a map of Spain with a Radius Scale depending of the location affected cases? Have you got a couple of available hours?
So let's get busy with this!!

Our goal will be to display a map like the image of below:

![map affected coronavirus](./content/chart.png "affected coronavirus")

Cool Right?

Our goal will be to overcome the following three challenges:

- Place pins on a map based on location of each
- Scale pin radius based on affected cases number
- Spain got Canary Islands that is a territory placed far away, we need to cropt that islands and paste them in a visible place in the map
- Place two buttoms to update all the different radius for each date of affected cases

# Steps

First of all, the map of Spain will be display in our exercise from this way:

- The Spain topojson info must be collected, let's copy the raw document in this URL: https://github.com/deldersveld/topojson/blob/master/countries/spain/spain-comunidad-with-canary-islands.json

Now this file has to be stored, let's create in src a file called _spain.json_ once this was done, copy the raw document here. With the aim of viewing the raw document clearly let's click on the right buttom from our mouse and select format document.

- Let's import the file which we have just created _spain.json_. In addition it will be necessary to import d3 and topojson to do this exercise

_./src/index.ts_

```typescript
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
```

- Before displaying the map of Spain let's add a background color #FBFAF0 with 1024 px in width and 800 px in height:

_./src/index.ts_

```typescript
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");
```
- Let's build the map of Spain with each community:

_./src/index.ts_

```typescript
const geojson = topojson.feature(
  spainjson,
  spainjson.objects.ESP_adm1
);
```

- Now we must show all the communities of Spain printed with the colour in class _country_ which will be described more later

_./src/index.ts_

```typescript
svg
  .selectAll("path") // Select all the CCAA
  .data(geojson["features"])
  .enter()
  .append("path") // Aggregate all the CCAA
  .attr("class", "country")
  .attr("d", geoPath as any); // Data loaded from json file
);
```

At this point the only thing that we have in our project is the map of Spain but it seems too small, we have to adjust the size, moreover Canary Islands don't appear yet. 

- After proving different sizes to adjust the map, the corrects are 2300 for scale and [600, 2000] for translate how is shown below

_./src/index.ts_

```diff
const aProjection = d3
  .geoMercator()
  // Let's make the map bigger to fit in our resolution
+  .scale(2300)
  // Let's center the map
+  .translate([600, 2000]);
```

- Now the map looks great, good job! but still we are not able to watch the Canary Islands, in order to do that we can build a 
  map projection that positions that piece of land in another place, for instance for the USA you can
  find Albers USA projection: https://bl.ocks.org/mbostock/2869946, there's a great project created by
  [Roger Veciana](https://github.com/rveciana) that implements a lot of projections for several
  maps:

  - [Project site](https://geoexamples.com/d3-composite-projections/)
  - [Github project](https://github.com/rveciana/d3-composite-projections)

Let's install the library that contains this projections. Write this in your terminal:

```bash
npm install d3-composite-projections --save
```

- Let's import it in our _index.ts_ (we will use require since we don't have typings).

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
+ const d3Composite = require("d3-composite-projections");
```

- Before we used _d3_ projection using _geoMercator()_ to show the map instead of this projection we need to use the new projection _d3Composite_ and using _geoConicConformalSpain()_ (we will need to modify the
  _scale_ and _translate_ values too, due to the projection already is different). The new value for scale will be _3300_ and for translate it will be _[500, 400]_:

_./index.ts_

```diff
const aProjection =
-   d3
-  .geoMercator()
+  d3Composite
+  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
-  .scale(2300)
+  .scale(3300)
  // Let's center the map
-  .translate([600, 2000]);
+  .translate([500, 400]);
```

Finally, the map has been completed with the Canary Islands shown inside of our scale.

Now we want to display a circle in the middle of each community,
  we have collected the latitude and longitude for each community, let's add them to our
  project. Each of these points will represent the center of each circle drawn.

_./src/communities.ts_

```typescript
export const latLongCommunities = [
  {
    name: "Madrid",
    long: -3.70256,
    lat: 40.4165
  },
  {
    name: "Andalucía",
    long: -4.5,
    lat: 37.6
  },
  {
    name: "Valencia",
    long: -0.37739,
    lat: 39.45975
  },
  {
    name: "Murcia",
    long: -1.13004,
    lat: 37.98704
  },
  {
    name: "Extremadura",
    long: -6.16667,
    lat: 39.16667
  },
  {
    name: "Cataluña",
    long: 1.86768,
    lat: 41.82046
  },
  {
    name: "País Vasco",
    long: -2.75,
    lat: 43.0
  },
  {
    name: "Cantabria",
    long: -4.03333,
    lat: 43.2
  },
  {
    name: "Asturias",
    long: -5.86112,
    lat: 43.36662
  },
  {
    name: "Galicia",
    long: -7.86621,
    lat: 42.75508
  },
  {
    name: "Aragón",
    long: -1.0,
    lat: 41.0
  },
  {
    name: "Castilla y León",
    long: -4.45,
    lat: 41.383333
  },
  {
    name: "Castilla La Mancha",
    long: -3.000033,
    lat: 39.500011
  },
  {
    name: "Islas Canarias",
    long: -15.5,
    lat: 28.0
  },
  {
    name: "Islas Baleares",
    long: 2.52136,
    lat: 39.18969
  },
  {
    name: "La Rioja",
    long: -2.44373,
    lat: 42.4650
  },
  {
    name: "Navarra",
    long: -1.676069,
    lat: 42.695391
  }
];
```

Once latLongCommunities has been created let's import it in our code

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
+ import { latLongCommunities } from "./communities";
```

We must add the stats that we need to display (affected persons per community). On the one hand we have _stats1March_ on the ther hand, we have _stats23March_. It was used an interface named ResultEntry:

_./stats.ts_

```typescript
export interface ResultEntry {
  name: string;
  value: number;
}
export const stats1March: ResultEntry[] = [
  {
    name: "Madrid",
    value: 587
  },
  {
    name: "La Rioja",
    value: 102
  },
  {
    name: "Andalucía",
    value: 54
  },
  {
    name: "Cataluña",
    value: 101
  },
  {
    name: "Valencia",
    value: 50
  },
  {
    name: "Murcia",
    value: 5
  },
  {
    name: "Extremadura",
    value: 7
  },
  {
    name: "Castilla La Mancha",
    value: 26
  },
  {
    name: "País Vasco",
    value: 148
  },
  {
    name: "Cantabria",
    value: 12
  },
  {
    name: "Asturias",
    value: 10
  },
  {
    name: "Galicia",
    value: 18
  },
  {
    name: "Aragón",
    value: 32
  },
  {
    name: "Castilla y León",
    value: 40
  },
  {
    name: "Islas Canarias",
    value: 24
  },
  {
    name: "Islas Baleares",
    value: 11
  },
  {
    name: "Navarra",
    value: 13
  }
]
export const stats23March: ResultEntry[] = [
  {
    name: "Madrid",
    value: 10575
  },
  {
    name: "La Rioja",
    value: 747
  },
  {
    name: "Andalucía",
    value: 1961
  },
  {
    name: "Cataluña",
    value: 5925
  },
  {
    name: "Valencia",
    value: 1901
  },
  {
    name: "Murcia",
    value: 345
  },
  {
    name: "Extremadura",
    value: 493
  },
  {
    name: "Castilla La Mancha",
    value: 2078
  },
  {
    name: "País Vasco",
    value: 2421
  },
  {
    name: "Cantabria",
    value: 347
  },
  {
    name: "Asturias",
    value: 594
  },
  {
    name: "Galicia",
    value: 1208
  },
  {
    name: "Aragón",
    value: 638
  },
  {
    name: "Castilla y León",
    value: 2055
  },
  {
    name: "Islas Canarias",
    value: 481
  },
  {
    name: "Islas Baleares",
    value: 400
  },
  {
    name: "Navarra",
    value: 886
  }
];
```
Let's import it into our index.ts

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
+ import { stats1March, stats23March, ResultEntry } from "./stats";
```

Now it's time to create a function called _calculateRadiusBasedOnAffectedCases_ which receives two arguments _community_ and _data_. With this function we will be able to adjust the radius for each community.

_./src/index.ts_

```diff
+ const calculateRadiusBasedOnAffectedCases = (community: string, data: ResultEntry[]) => {}
```
Let's build this function step by step:

- Let's calculate the maximum number of affected of all communities:

_./src/index.ts_

```diff
const calculateRadiusBasedOnAffectedCases = (community: string, data: ResultEntry[]) => {
+  const maxAffected = stats.reduce(
+  (max, item) => (item.value > max ? item.value : max),
+  0)
}
```

- Let's create an scale to map affected to radius size.

_./src/index.ts_

```diff
const calculateRadiusBasedOnAffectedCases = (community: string, data: ResultEntry[]) => {
  const maxAffected = stats.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0)
+  const affectedRadiusScale = d3
+  .scaleLinear()
+  .domain([0, maxAffected])
+  .range([0, 50]);
}
```

- At the end, let's create _entry_ that will find the name and the number of infected people in data. The function will return the value of entry after aplying the _affectedRadiusScale_

_./src/index.ts_

```diff
const calculateRadiusBasedOnAffectedCases = (community: string, data: ResultEntry[]) => {
  const maxAffected = stats.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0)
  const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([0, 50]);
+  const entry = data.find(item => item.name === comunidad);
+  return entry ? affectedRadiusScale(entry.value) : 0;
}
```

Initially we will only show the map of Spain and depending the date (buttom pushed) it will be shown the different radiuses for each community. With _updateRadius(data: ResultEntry[])_ we will do this.

First _circles_ select all the circles that will be created, the data used will be stored in _latLongCommunities_ applying a merge in each one. The radius will be calculated with the function _calculateRadiusBasedOnAffectedCases_ (previously explained). Finally, we are going to select the coordinates X, Y for each circle. As it was previously told, the center of each circle will be the coordinates created in _latlongCommunities_.

_./src/index.ts_

```typescript
// updateRadius takes an argument(array ResultEntry) and calculates the radius for each CCAA
  const updateRadius = (data: ResultEntry[]) => {
    const circles = svg.selectAll("circle");
    circles
      .data(latLongCommunities)
      .enter()
      .append("circle") // Aggregate all the circles
      .merge(circles as any)
      .transition()
      .duration(500)
      .attr("r", d =>
      calculateRadiusBasedOnAffectedCases(d.name, data))
      .attr("cx", d => aProjection([d.long, d.lat])[0])
      .attr("cy", d => aProjection([d.long, d.lat])[1]);
```

Black circles are ugly let's add some styles, we will just use a red background and
  add some transparency to let the user see the spot and the map under that spot.

_./src/map.css_

```css
.country {
  stroke-width: 1;
  stroke: #2f4858;
  fill: #008c86;
}

.affected-marker {
  stroke-width: 1;
  stroke: #bc5b40;
  fill: #f88f70;
  fill-opacity: 0.7;
}
```

Let's apply this style to the black circles that we are rendering:

_./src/index.ts_

```diff
// updateRadius takes an argument(array ResultEntry) and calculates the radius for each CCAA
  const updateRadius = (data: ResultEntry[]) => {
    const circles = svg.selectAll("circle");
    circles
      .data(latLongCommunities)
      .enter()
      .append("circle") // Aggregate all the circles
      .merge(circles as any)
      .transition()
      .duration(500)
+     .attr("class", "affected-marker")
      .attr("r", d =>
      calculateRadiusBasedOnAffectedCases(d.name, data))
      .attr("cx", d => aProjection([d.long, d.lat])[0])
      .attr("cy", d => aProjection([d.long, d.lat])[1]);
```
We are finishing the exercise, now we must add in our html the two buttoms with each date, assigning an id for each one:

_./src/index.html_
```html
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="./map.css" />
    <link rel="stylesheet" type="text/css" href="./base.css" />
  </head>
  <body>
    <button id="1March">1 March</button>
    <button id="23March">23 March</button>
    <script src="./index.ts"></script>
  </body>
</html>
```
Now we must update the data with each buttom just created. To make this we must use document and _getElementById_ will take the id that we previously created in our html file _1March_ and _23March_ and with _addEventListener("click")_ we add a function that makes an action, what we would like to do here is to update the data depending the buttom clicked.

_./src/index.ts_

```typescript
// Here with the buttom in HTML "1 March", the map of infected people in that date will be displayed
  document
  .getElementById("1March")
  .addEventListener("click", function handleInfected1March() {
    updateRadius(stats1March);
  });

  // Here with the buttom in HTML "23 March", the map of infected people in that date will be displayed
  document
  .getElementById("23March")
  .addEventListener("click", function handleInfected23March() {
    updateRadius(stats23March);
  });
```
Congratulations! With this last step our exercise will be completed!

Hope you have enjoyed with this interesting and funny task.