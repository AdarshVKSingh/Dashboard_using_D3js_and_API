
import './App.css';
import React, { useState, useEffect } from "react";
import BarGraph from './components/Bar';
import PieChart from './components/topicpie';
import BubbleChart from './components/bubble';
import ScatterPlot from './components/scatter';
import Heatmap from './components/heatmap';
import Histogram from './components/histogram';
import LineGraph from './components/line';
import ScatterPlot2 from './components/scatter2';
import AreaChart from './components/area';
import ChoroplethMap from './components/chloropleth';
import WordCloud from './components/wordcloud';
import BarChartTopic from './components/bartopic';
import Title from './components/title';


function App() {

  return (

    <div className="App">
      
      <Title />
      <ScatterPlot />
      <PieChart />
      <BubbleChart />
      {/* <Heatmap/> */}
      {/* <Histogram/> */}
      <BarGraph />
      <LineGraph />
      <ScatterPlot2 />
      <AreaChart />
      {/* <ChoroplethMap/>
      <WordCloud/> */}
      <BarChartTopic />
    </div>
  )
}

export default App;
