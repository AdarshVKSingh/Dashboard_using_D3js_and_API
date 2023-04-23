import React, { useEffect, useRef ,useState} from 'react';
import * as d3 from 'd3';
import './../bartopic.css';

const BarChartTopic = () => {
  const chartRef = useRef(null);
  const [num,setnum] = useState(0);

  useEffect(() => {
    if(num>0){
        console.log('bargraph')
        return;
      }
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/getData');
      const data = await response.json();
      const groupedData = d3.group(data, (d) => d.topic);
      const chartData = Array.from(groupedData, ([topic, values]) => ({ topic, count: values.length }));

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(chartData.map((d) => d.topic));

      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(chartData, (d) => d.count)]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.topic))
        .attr('y', (d) => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d.count));
    };

    fetchData();
  }, []);

  return (
    <div className="com8">
    <h1>Topic Analysis</h1>
      <div ref={chartRef}></div>;
    </div>
  )
};

export default BarChartTopic;
