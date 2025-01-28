import * as d3 from "d3";

import React, { useEffect, useRef } from "react";

interface DataPoint {
  year: number;
  count: number;
  topicName: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 800, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    // Convert string years to numbers
    const parsedData = data.map((d) => ({
      ...d,
      year: parseInt(d.year, 10),
    }));

    const years = [2000, 2005, 2010, 2015, 2020, 2025]; // Fixed X-Axis ticks
    const topics = [...new Set(parsedData.map((d) => d.topicName))];

    // Group data by topic and ensure all topics have entries for fixed years
    const topicData = topics.map((topic) => ({
      name: topic,
      values: years.map((year) => ({
        year,
        count: parsedData.find((d) => d.year === year && d.topicName === topic)?.count || 0,
      })),
    }));

    // Define margins and chart size
    const margin = { top: 40, right: 200, bottom: 50, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Select SVG and clear previous contents
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear().domain([2000, 2025]).range([0, chartWidth]);
    const yScale = d3.scaleLinear().domain([0, 15000]).range([chartHeight, 0]);

    // Add X grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(years)
          .tickSize(-chartHeight)
          .tickFormat(() => ""),
      )
      .selectAll("line")
      .attr("stroke", "#d3d3d3");

    // Add Y grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickValues([0, 5000, 10000, 15000])
          .tickSize(-chartWidth)
          .tickFormat(() => ""),
      )
      .selectAll("line")
      .attr("stroke", "#d3d3d3");

    // Add X Axis
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickValues(years).tickFormat(d3.format("d")));

    // Add Y Axis
    g.append("g").call(
      d3
        .axisLeft(yScale)
        .tickValues([0, 5000, 10000, 15000])
        .tickFormat((d) => `${d / 1000}k`),
    );

    // Define line generator
    const line = d3
      .line<{ year: number; count: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw lines
    g.selectAll(".line")
      .data(topicData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.name)!)
      .attr("stroke-width", 2)
      .attr("d", (d) => line(d.values)!);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "black")
      .text("Number of Publications Per Year by Topic");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${chartWidth + 80}, ${margin.top})`);

    legend
      .selectAll("rect")
      .data(topicData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d.name)!);

    legend
      .selectAll("text")
      .data(topicData)
      .enter()
      .append("text")
      .attr("x", 15)
      .attr("y", (_, i) => i * 20 + 9)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text((d) => d.name);
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;
