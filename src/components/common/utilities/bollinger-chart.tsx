import * as d3 from "d3";

import React, { useEffect, useRef } from "react";

const rollingMean = (values: Float64Array, N: number): (number | null)[] =>
  values.map((_, i, arr) => {
    if (i < N - 1) return null;
    const window = arr.slice(i - N + 1, i + 1);
    return d3.mean(window) ?? null;
  });

const rollingStd = (values: Float64Array, N: number): (number | null)[] =>
  values.map((_, i, arr) => {
    if (i < N - 1) return null;
    const window = arr.slice(i - N + 1, i + 1);
    return d3.deviation(window) ?? null;
  });

const calculateBollingerBands = (values: Float64Array, N: number, K: number[]) => {
  const mean = rollingMean(values, N);
  const std = rollingStd(values, N);

  return K.map((k) =>
    values.map((_, i) => (mean[i] === null || std[i] === null ? NaN : mean[i]! + k * std[i]!)),
  );
};

interface BollingerBandsChartProps {
  data: { Date: Date; Close: number }[];
}

export const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !tooltipRef.current) return;

    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const width = 928;
    const height = 600;

    const values = Float64Array.from(data, (d) => d.Close);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLog()
      .domain(d3.extent(values) as [number, number])
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<number>()
      .defined((_, i) => !isNaN(data[i].Date.getTime()) && !isNaN(values[i]))
      .x((_, i) => x(data[i].Date))
      .y((d) => y(d));

    const N = 20;
    const K = [-2, 0, 2];
    const bands = [values, ...calculateBollingerBands(values, N, K)];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickValues(d3.ticks(...y.domain(), 10))
          .tickFormat((d) => d),
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.left - margin.right)
          .attr("stroke-opacity", 0.1),
      )
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("↑ Daily close ($)"),
      );

    const colors = ["#aaa", "#007bff", "#00ff00", "#ff0000"];
    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(bands)
      .join("path")
      .attr("stroke", (_, i) => colors[i])
      .attr("d", line);

    // Add clickable points
    const points = svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Close))
      .attr("r", 4)
      .attr("fill", "#ff5722")
      .style("cursor", "pointer");

    // Add click event listener
    points.on("click", (event, d) => {
      // Update tooltip position and content
      tooltipRef.current!.style.visibility = "visible";
      tooltipRef.current!.style.top = `${event.pageY - 10}px`;
      tooltipRef.current!.style.left = `${event.pageX + 10}px`;
      tooltipRef.current!.innerHTML = `
        <strong>Date:</strong> ${d.Date.toDateString()}<br>
        <strong>Close:</strong> $${d.Close.toFixed(2)}
      `;

      // Log click interaction
      console.log(`Clicked on: Date=${d.Date.toDateString()}, Close=$${d.Close.toFixed(2)}`);

      // Highlight the clicked point
      points.attr("fill", "#ff5722"); // Reset all points
      d3.select(event.currentTarget).attr("fill", "#00ff00"); // Highlight the clicked point
    });

    // Hide tooltip on outside click
    svg.on("click", () => {
      tooltipRef.current!.style.visibility = "hidden";
    });
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width="928" height="600" style={{ maxWidth: "100%", height: "auto" }} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          background: "rgba(0, 0, 0, 0.85)",
          color: "#fff",
          padding: "8px",
          borderRadius: "4px",
          pointerEvents: "none",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
};

export default BollingerBandsChart;
