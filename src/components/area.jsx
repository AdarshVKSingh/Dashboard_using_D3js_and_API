import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import './../area.css';
function AreaChart() {
  const svgRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:4000/getData");
      const data = await response.json();
      const parsedData = data
        .filter((d) => d.published && d.likelihood)
        .map((d) => ({
          published: new Date(d.published),
          likelihood: d.likelihood,
        }))
        .sort((a, b) => a.published - b.published);

      const svg = d3.select(svgRef.current);

      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const width = svg.attr("width") - margin.left - margin.right;
      const height = svg.attr("height") - margin.top - margin.bottom;

      const x = d3
        .scaleTime()
        .domain(d3.extent(parsedData, (d) => d.published))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d.likelihood)]).nice()
        .range([height - margin.bottom, margin.top]);

      const area = d3
        .area()
        .curve(d3.curveCatmullRom)
        .x((d) => x(d.published))
        .y0(y(0))
        .y1((d) => y(d.likelihood));

      svg
        .append("path")
        .datum(parsedData)
        .attr("fill", "steelblue")
        .attr("d", area);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width - margin.right)
        .attr("y", margin.bottom - 10)
        .attr("fill", "#000")
        .text("Published");

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr("x", -margin.left)
        .attr("y", margin.top + 10)
        .attr("fill", "#000")
        .text("Likelihood");
    }
    fetchData();
  }, []);

  return (

    <div className="com7">
     <h3>Published Date vs Likelihood</h3>
      <svg
      ref={svgRef}
      width="800"
      height="600"
      style={{ border: "1px solid black" }}
    />
    </div>
    
  );
}

export default AreaChart;
