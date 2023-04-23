import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './../line.css';

const LineChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales and axes
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Define the line
    const line = d3
      .line()
      .x((d) => x(d.year))
      .y((d) => y(d.relevance));

    // Load data
    d3.json('http://localhost:4000/getData').then((data) => {
      // Convert date strings to date objects
      data.forEach((d) => {
        d.year = new Date(d.published);
        d.relevance = +d.relevance;
      });

      // Sort data by year
      data.sort((a, b) => a.year - b.year);

      // Set domain of scales
      x.domain(d3.extent(data, (d) => d.year));
      y.domain(d3.extent(data, (d) => d.relevance));

      // Add x-axis
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

      // Add y-axis
      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Relevance');

      // Add line
      g.append('path').datum(data).attr('class', 'line').attr('d', line);
    });
  }, []);

  return (
    <div className='com5'>
     <h1>Year vs Relevance</h1>
      <svg ref={svgRef} width={800} height={500} ></svg>;
    </div>
    
  )
};

export default LineChart;
