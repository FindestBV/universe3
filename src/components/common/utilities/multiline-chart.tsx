import * as d3 from "d3";

import React from "react";

interface MultilineChartProps {
  data: Array<{
    name: string;
    color: string;
    items: Array<{ date: Date; value: number }>;
  }>;
  dimensions: {
    width: number;
    height: number;
    margin: { top: number; right: number; bottom: number; left: number };
  };
}

export const MultilineChart: React.FC<MultilineChartProps> = ({ data = [], dimensions }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [prevItems, setPrevItems] = React.useState<string[]>([]);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  React.useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("No data provided for MultilineChart");
      return;
    }

    // Validate if `data` has the required structure
    if (!data.every((d) => d.items && Array.isArray(d.items) && d.items.length > 0)) {
      console.error("Invalid data structure for MultilineChart");
      return;
    }

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(
          data.flatMap((d) => d.items),
          (d) => d.date,
        )!,
        d3.max(
          data.flatMap((d) => d.items),
          (d) => d.date,
        )!,
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(
          data.flatMap((d) => d.items),
          (d) => d.value,
        )! - 50,
        d3.max(
          data.flatMap((d) => d.items),
          (d) => d.value,
        )! + 50,
      ])
      .range([height, 0]);

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear previous chart elements

    const svg = svgEl.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickSize(-height + margin.bottom);
    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    xAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "white")
      .attr("font-size", "0.75rem");

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat((val) => `${val}%`);
    const yAxisGroup = svg.append("g").call(yAxis);

    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    yAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "white")
      .attr("font-size", "0.75rem");

    // Draw lines
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    const lines = svg
      .selectAll(".line")
      .data(data)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d.items));

    // Animate lines on first render
    lines.each((d, i, nodes) => {
      const element = nodes[i];
      const length = element.getTotalLength();
      if (!prevItems.includes(d.name)) {
        d3.select(element)
          .attr("stroke-dasharray", `${length},${length}`)
          .attr("stroke-dashoffset", length)
          .transition()
          .duration(750)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }
    });

    setPrevItems(data.map((d) => d.name));
  }, [data, dimensions, prevItems]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default MultilineChart;
