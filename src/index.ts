// Here we find all the libraries that we need

import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { stats1March, stats23March, ResultEntry } from "./stats";

// This function takes two arguments(CCAA name and an array of ResultEntry) and return a radius based on the max value of the scale
const calculateRadiusBasedOnAffectedCases = (community: string, data: ResultEntry[]) => {
  
  // Here maxAffected calculates the max value of the array
  const maxAffected =
  data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0);
  
  // Here affectedRadiusScale calculates the scale depending of the max value previously calculated
  const affectedRadiusScale =
  d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([0, 50]);

  // Now the variable entry finds the CCAA name and the value of infected people with the name of the CCAA
  const entry = data.find(item => item.name === community);
  
  // At the end of this function the value required is returned
  return entry ? affectedRadiusScale(entry.value) : 0;
  };

// Here a backgroung will be created with the color #FBFAF0
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

// aProjection adjust the map of Spain with a correct scale and correctly centered
const aProjection = d3Composite
  .geoConicConformalSpain()
  .scale(3300) // Let's make the map bigger to fit in our resolution
  .translate([500, 400]); // Let's center the map

// In the following variables it will be convertered the topojson to a geojson
const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);


// Now the initial map of Spain will be displayed
svg
  .selectAll("path") // Select all the CCAA
  .data(geojson["features"])
  .enter()
  .append("path") // Aggregate all the CCAA
  .attr("class", "country")
  .attr("d", geoPath as any); // Data loaded from json file

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
      .attr("class", "affected-marker")
      .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
      .attr("cx", d => aProjection([d.long, d.lat])[0]) // Calculate the X position
      .attr("cy", d => aProjection([d.long, d.lat])[1]); // Calculate the Y position
  };
  
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
