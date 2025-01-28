import * as d3 from "d3";

import React, { useEffect, useRef } from "react";

interface DataPoint {
  Date: Date;
  Close: number;
}

interface BollingerBandsChartProps {
  data: DataPoint[]; // Array of objects with Date and Close values
  N: number; // Number of periods for Bollinger bands
  K: number; // Multiplier for standard deviation
}

export const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ data, N, K }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper function for Bollinger band calculations
  const calculateBollingerBands = (values: Float64Array, N: number, K: number[]) => {
    const rollingMean = values.map((_, i, arr) => {
      if (i < N - 1) return null;
      const window = arr.slice(i - N + 1, i + 1);
      return d3.mean(window) ?? null;
    });

    const rollingStd = values.map((_, i, arr) => {
      if (i < N - 1) return null;
      const window = arr.slice(i - N + 1, i + 1);
      return d3.deviation(window) ?? null;
    });

    return K.map((k) =>
      values.map((_, i) => {
        if (rollingMean[i] === null || rollingStd[i] === null) return NaN;
        return rollingMean[i]! + k * rollingStd[i]!;
      }),
    );
  };

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 928;
    const height = 600;
    const marginTop = 10;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const values = Float64Array.from(data, (d) => d.Close);

    // X and Y scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date) as [Date, Date])
      .rangeRound([marginLeft, width - marginRight]);

    const y = d3
      .scaleLog()
      .domain(d3.extent(values) as [number, number])
      .rangeRound([height - marginBottom - 20, marginTop]);

    // Line generator
    const line = d3
      .line<number>()
      .defined((_, i) => !isNaN(data[i].Date.getTime()) && !isNaN(values[i]))
      .x((_, i) => x(data[i].Date)!)
      .y((d) => y(d)!);

    // Bollinger bands
    const bands = [values, ...calculateBollingerBands(values, N, [-K, 0, +K])];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing chart

    // Append axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickValues(d3.ticks(...y.domain(), 10))
          .tickFormat((d) => d.toString()),
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
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

    // Draw Bollinger bands and main line
    const colors = ["#aaa", "green", "blue", "red"];
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
  }, [data, N, K]);

  return <svg ref={svgRef} width="928" height="600" style={{ maxWidth: "100%", height: "auto" }} />;
};

export default BollingerBandsChart;
