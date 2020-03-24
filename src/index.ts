import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { stats1March, stats23March, ResultEntry } from "./stats";


const maxAffected1March = stats1March.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const maxAffected23March = stats23March.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);

const affectedRadiusScale1March = d3
  .scaleLinear()
  .domain([0, maxAffected1March])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height

  const affectedRadiusScale23March = d3
  .scaleLinear()
  .domain([0, maxAffected23March])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height

const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: ResultEntry[]) => {
  if (data == stats1March)
  {
  const entry = data.find(item => item.name === comunidad);

  return entry ? affectedRadiusScale1March(entry.value) : 0;
  }
  else
  {
  const entry = data.find(item => item.name === comunidad);

  return entry ? affectedRadiusScale23March(entry.value) : 0;
  }
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

svg
  .selectAll("path") // selecciona todos las CCAA
  .data(geojson["features"])
  .enter()
  .append("path") // añade todas las CCAA
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any);

  svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);


  const updateCircles = (data: ResultEntry[]) => {
    const circles = svg.selectAll("circle");
    circles
      .data(latLongCommunities)
      .merge(circles as any)
      .transition()
      .duration(500)
      .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data));
  };
  document
  .getElementById("1March")
  .addEventListener("click", function handleResultsApril() {
    updateCircles(stats1March);
  });

document
  .getElementById("23March")
  .addEventListener("click", function handleResultsNovember() {
    updateCircles(stats23March);
  });
