import React, { useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = ({ data }) => {
  useEffect(() => {
    if (data) {
      const layout = cloud()
        .size([500, 500])
        .words(
          data.map((d) => ({ text: d.topic, size: 10 + d.relevance * 30 }))
        )
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize((d) => d.size)
        .on("end", (words) => {
          d3.select("#word-cloud")
            .append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr(
              "transform",
              `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
            )
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", (d) => d.size + "px")
            .style("font-family", "Impact")
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text((d) => d.text);
        });

      layout.start();
    }
  }, [data]);

  return <div id="word-cloud"></div>;
};

export default WordCloud;
