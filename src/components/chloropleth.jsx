import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const projection = d3.geoMercator().scale(130).translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 10]);

    d3.json('http://localhost:4000/getData').then((data) => {
      const mapData = data.reduce((acc, d) => {
        const region = d.region;
        if (!acc[region]) {
          acc[region] = { region, relevance: 0 };
        }
        acc[region].relevance += d.relevance;
        return acc;
      }, {});

      d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((geoData) => {
        geoData.features.forEach((d) => {
          const region = d.properties.name;
          if (mapData[region]) {
            d.relevance = mapData[region].relevance;
          }
        });

        svg
          .selectAll('path')
          .data(geoData.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('fill', (d) => {
            const relevance = d.relevance || 0;
            return colorScale(relevance);
          });
      });
    });
  }, []);

  return (
    <svg ref={svgRef} width="960" height="500">
      <g className="countries" />
    </svg>
  );
};

export default ChoroplethMap;
