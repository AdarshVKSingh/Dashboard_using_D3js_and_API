import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import './../scatter2.css';

const ScatterPlot2 = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("http://localhost:4000/getData")
      .then(data => {
        const xScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.intensity)])
          .range([0, width]);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.relevance)])
          .range([height, 0]);

        svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(xScale));

        svg.append("g")
          .call(d3.axisLeft(yScale));

        svg.selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.intensity))
          .attr("cy", d => yScale(d.relevance))
          .attr("r", 5)
          .style("fill", "#69b3a2");

        svg.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
          .style("text-anchor", "middle")
          .text("Intensity");

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Relevance");
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="com6">
      <h1>Intensity vs Relevance</h1>
      <svg ref={svgRef} />;
    </div>
  )
};

export default ScatterPlot2;
