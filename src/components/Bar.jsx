import React, { useEffect, useRef ,useState} from 'react';
import * as d3 from 'd3';
import './../bar.css';

function BarGraph() {
  const graphRef = useRef(null);

  const [num,setnum] = useState(0);

  useEffect(() => {
    if(num>0){
      console.log('bargraph')
      return;
    }
    setnum(num+1);
    // Fetch data from the server
    fetch('http://localhost:4000/getData')
      .then(response => response.json())
      .then(data => {
        // Create a new SVG element
        
        const svg = d3.select(graphRef.current)
          .append('svg')
          .attr('width', 500)
          .attr('height', 500);

        // Define the dimensions of the graph
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 500 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create the scales for the x and y axes
        const xScale = d3.scaleBand()
          .range([0, width])
          .domain(data.map(d => d.sector))
          .padding(0.1);
        const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(data, d => d.intensity)]);

        // Add the x axis to the SVG element
        svg.append('g')
          .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .attr("x", -15)
          .attr("y", 0)
          .attr("dy", ".35em")
          .style("text-anchor", "end");

        // Add the y axis to the SVG element
        svg.append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .call(d3.axisLeft(yScale));

        // Add the bars to the SVG element
        svg.selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d.sector) + margin.left)
          .attr('y', d => yScale(d.intensity) + margin.top)
          .attr('width', xScale.bandwidth())
          .attr('height', d => height - yScale(d.intensity));
      });
  }, []);

  return (
    <div className="bar-graph-container com4">
      <div className="x-axis-label"><h3>Sector</h3></div>
      <div ref={graphRef} className='check' id="barcheck"></div>
    </div>
  );
}

export default BarGraph;
