import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import './../bubble.css';

const BubbleChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/getData");
      const rawData = await response.json();
      const countryData = rawData.reduce((acc, curr) => {
        if (!acc[curr.country]) {
          acc[curr.country] = {
            count: 1,
            relevance: parseFloat(curr.relevance),
          };
        } else {
          acc[curr.country].count++;
          acc[curr.country].relevance += parseFloat(curr.relevance);
        }
        return acc;
      }, {});
      const countryDataArray = Object.keys(countryData).map((key) => ({
        country: key,
        count: countryData[key].count,
        relevance: countryData[key].relevance,
      }));
      setData(countryDataArray);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.relevance)])
      .range([height - margin.bottom, margin.top]);

    const radius = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([0, 30]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current);

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.count))
      .attr("cy", (d) => y(d.relevance))
      .attr("r", (d) => radius(d.count))
      .attr("fill", (d) => color(d.country))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2},${height + margin.top + 20})`
      )
      .style("text-anchor", "middle")
      .text("Count");

    svg
      .append("text")
      .attr(
        "transform",
        `translate(${margin.left - 40},${height / 2}) rotate(-90)`
      )
      .style("text-anchor", "middle")
      .text("Relevance");

  }, [data]);

  return (
    <div className="com3">
      <h1>Bubble Chart</h1>
      <svg ref={svgRef} style={{ height: 500, width: 500 }}></svg>
    </div>
  );
};

export default BubbleChart;