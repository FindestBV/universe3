import * as d3 from "d3";

import React, { useEffect, useRef } from "react";

interface RadialStackedBarChartProps {
  data: Array<{ state: string; age: string; population: number }>;
}

export const RadialStackedBarChart: React.FC<RadialStackedBarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 928;
    const height = width;
    const innerRadius = 180;
    const outerRadius = Math.min(width, height) / 2;

    // Deduplicate and process data
    const aggregatedData = Array.from(
      d3.rollup(
        data,
        (group) => d3.sum(group, (d) => d.population),
        (d) => d.state,
        (d) => d.age,
      ),
      ([state, ages]) => Array.from(ages, ([age, population]) => ({ state, age, population })),
    ).flat();

    const series = d3
      .stack()
      .keys(d3.union(aggregatedData.map((d) => d.age))) // Distinct age groups
      .value(([_, D], key) => D.get(key)?.population || 0)(
      d3.index(
        aggregatedData,
        (d) => d.state,
        (d) => d.age,
      ),
    );

    // Scales
    const x = d3
      .scaleBand()
      .domain(aggregatedData.map((d) => d.state))
      .range([0, 2 * Math.PI])
      .align(0);

    const y = d3
      .scaleRadial()
      .domain([0, d3.max(series, (s) => d3.max(s, (d) => d[1]))!])
      .range([innerRadius, outerRadius]);

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(
        d3.schemeSpectral[Math.min(series.length, 11)] || // Up to 11 colors
          d3.quantize(d3.interpolateSpectral, series.length), // Fallback
      )
      .unknown("#ccc");

    const arc = d3
      .arc<any>()
      .innerRadius((d) => y(d[0])!)
      .outerRadius((d) => y(d[1])!)
      .startAngle((d) => x(d.data[0])!)
      .endAngle((d) => x(d.data[0])! + x.bandwidth()!)
      .padAngle(1.5 / innerRadius)
      .padRadius(innerRadius);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing chart

    svg
      .attr("width", "100%")
      .attr("height", "auto")
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "))
      .style("font", "10px sans-serif");

    // Series group
    svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key)!)
      .selectAll("path")
      .data((D) => D.map((d) => ({ ...d, key: D.key })))
      .join("path")
      .attr("d", arc)
      .append("title")
      .text(
        (d) =>
          `${d.data[0]} ${d.key}\nPopulation: ${d.data[1].get(d.key)?.population.toLocaleString()}`,
      );

    // X-axis
    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll("g")
      .data(x.domain())
      .join("g")
      .attr(
        "transform",
        (d) => `
        rotate(${((x(d)! + x.bandwidth() / 2) * 180) / Math.PI - 90})
        translate(${innerRadius},0)
      `,
      )
      .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000"))
      .call((g) =>
        g
          .append("text")
          .attr("transform", (d) =>
            (x(d)! + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)",
          )
          .text((d) => d),
      );

    // Y-axis
    svg
      .append("g")
      .attr("text-anchor", "middle")
      .call((g) =>
        g
          .append("text")
          .attr("y", -y(y.ticks(5).pop()!))
          .attr("dy", "-1em")
          .text("Population"),
      )
      .call((g) =>
        g
          .selectAll("g")
          .data(y.ticks(5).slice(1))
          .join("g")
          .call((g) =>
            g
              .append("circle")
              .attr("r", y)
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.5)
              .attr("fill", "none"),
          )
          .call((g) =>
            g
              .append("text")
              .attr("y", (d) => -y(d))
              .attr("dy", "0.35em")
              .attr("stroke", "#fff")
              .attr("stroke-width", 5)
              .text(y.tickFormat(5, "s"))
              .clone(true)
              .attr("fill", "#000")
              .attr("stroke", "none"),
          ),
      );

    // Legend
    svg
      .append("g")
      .selectAll("g")
      .data(color.domain())
      .join("g")
      .attr("transform", (_, i, nodes) => `translate(-40,${(nodes.length / 2 - i - 1) * 20})`)
      .call((g) =>
        g
          .append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", (d) => color(d)!),
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text((d) => d),
      );
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default RadialStackedBarChart;
