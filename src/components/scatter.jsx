import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './../scatter.css';

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/getData');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3
        .select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.intensity)])
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.likelihood)])
        .range([height, 0]);

      const xAxis = d3.axisBottom(x).ticks(5);
      const yAxis = d3.axisLeft(y).ticks(5);

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      svg.append('g').call(yAxis);

      svg
        .append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.intensity))
        .attr('cy', d => y(d.likelihood))
        .attr('r', 5)
        .attr('fill', '#69b3a2');
    }
  }, [data]);

  return (
    <div className="com1">
    {/* <h6>Likelihood vs Intensity</h6> */}
      <svg ref={svgRef}></svg>
      <h2>Likelihood</h2>
    </div>

  )
};

export default ScatterPlot;
