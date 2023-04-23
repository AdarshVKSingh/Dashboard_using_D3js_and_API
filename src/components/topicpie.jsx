import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './../topicpie.css';

function PieChart() {
  const [data, setData] = useState([]);

  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/getData');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.topic_field))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.intensity)
      .sort(null);

    const data_ready = pie(data);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius))
      .attr('fill', d => color(d.data.topic_field))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    const legend = svg.selectAll(".legend")
      .data(data_ready)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width / 2 - 80}, ${-height / 2 + i * 20})`);

    legend.append("rect")
      .attr("x", radius + 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => color(d.data.topic_field));

    legend.append("text")
      .attr("x", radius + 36)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d.data.topic_field);
  };

  return (
    <div className='com2'>
      <h2>Pie Chart</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default PieChart;
