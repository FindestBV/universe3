/**
 * LINECHART - CUSTOM TIP TAP (WIP)
 * @component
 *
 * @returns {JSX.Element} The rendered LINECHART component.
 */
import * as d3 from "d3";

import React, { useEffect, useRef } from "react";

interface DataPoint {
  year: number;
  count: number;
  topic: string; // Topic ID
  name: string; // Topic Name
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  text?: string;
  id?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 940, height = 500, text, id }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // console.log("line chart, should be item id in url", id);
  useEffect(() => {
    if (!data.length) return;

    // Parse data and extract years and topic groups
    const parsedData = data.map((d) => ({
      ...d,
      year: parseInt(d.year, 10),
    }));

    const years = [2000, 2005, 2010, 2015, 2020]; // Fixed years for X-axis
    const topics = [...new Set(parsedData.map((d) => d.topic))]; // Unique topics (group by topic ID)

    // Group data by topic
    const groupedData = topics.map((topic) => ({
      id: topic,
      name: parsedData.find((d) => d.topic === topic)?.name || "Unknown",
      values: years.map((year) => ({
        year,
        count: parsedData.find((d) => d.year === year && d.topic === topic)?.count || 0,
      })),
    }));

    // Define margins and chart size
    const margin = { top: 40, right: 200, bottom: 50, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear().domain([2000, 2020]).range([0, chartWidth]);
    const yScale = d3.scaleLinear().domain([0, 15000]).range([chartHeight, 0]);

    // Add gridlines
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

    // Add axes
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickValues(years).tickFormat(d3.format("d")));

    g.append("g").call(d3.axisLeft(yScale).tickFormat((d) => `${d / 1000}k`));

    // Define line generator
    const line = d3
      .line<{ year: number; count: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.count))
      .curve(d3.curveMonotoneX);

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Plot lines for each topic
    g.selectAll(".line")
      .data(groupedData)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.id)!)
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
      .text(`Number of Publications Per Year by ${text}`);

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${chartWidth + 80}, ${margin.top})`);

    legend
      .selectAll("rect")
      .data(groupedData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d.id)!);

    legend
      .selectAll("text")
      .data(groupedData)
      .enter()
      .append("text")
      .attr("x", 15)
      .attr("y", (_, i) => i * 20 + 9)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text((d) => d.name);
  }, [data, width, height]);

  return (
    <div className="custom-graph-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChart;
