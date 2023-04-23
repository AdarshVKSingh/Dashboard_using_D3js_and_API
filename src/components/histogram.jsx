import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './../histogram.css'

const Histogram = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Fetch data from http://localhost:4000/getData
    d3.json('http://localhost:4000/getData').then(data => {
      // Define dimensions and margins of the chart
      const margin = { top: 50, right: 30, bottom: 30, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create scales for x and y
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width])
        .padding(0.1);
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height, 0]);

      // Create x and y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Add x and y axes to the chart
      svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis);
      svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

      // Create a bar for each data point
      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.region) + margin.left)
        .attr('y', d => yScale(d.count) + margin.top)
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .attr('fill', 'steelblue');

      // Add labels to the chart
      svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2)
        .style('text-anchor', 'middle')
        .text('Histogram of Data by Region');

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
        .text('Count');
    });
  }, []);

  return (
    <svg ref={svgRef} width="600" height="400" />
  );
};

export default Histogram;
