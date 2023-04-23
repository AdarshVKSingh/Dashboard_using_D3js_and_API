import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './../heatmap.css';

const Heatmap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Fetch data from http://localhost:4000/getData
    d3.json('http://localhost:4000/getData').then(data => {
      // Define dimensions and margins of the chart
      const margin = { top: 50, right: 30, bottom: 30, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create scales for x, y, and color
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width]);
      const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([height, 0]);
      const colorScale = d3.scaleSequential()
        .domain(d3.extent(data, d => d.value))
        .interpolator(d3.interpolateRdYlBu);

      // Create x and y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%Y-%m-%d'));

      // Add x and y axes to the chart
      svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis);
      svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

      // Create a rectangle for each data point
      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.region) + margin.left)
        .attr('y', d => yScale(new Date(d.date)) + margin.top)
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('fill', d => colorScale(d.value));

      // Add labels to the chart
      svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2)
        .style('text-anchor', 'middle')
        .text('Heatmap Plot of Data by Region');

      svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + margin.bottom / 2)
        .style('text-anchor', 'middle')
        .text('Region');

      svg.append('text')
        .attr('transform', `rotate(-90)`)
        .attr('x', -(height / 2 + margin.top))
        .attr('y', margin.left / 2)
        .style('text-anchor', 'middle')
        .text('Date');
    });
  }, []);

  return (
    <svg ref={svgRef} width="600" height="400" />
  );
};

export default Heatmap;
