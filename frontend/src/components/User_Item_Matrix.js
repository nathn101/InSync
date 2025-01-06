import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import config from '../context/config';
import { response } from 'express';

const UserItemMatrix = () => {
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    fetch(config.USER_ITEM_MATRIX_URL)
      .then((response) => response.json())
      .then((data) => {
        setMatrix(data);
        drawHeatmap(data);
      })
      .catch((error) => console.error('Error fetching user-item matrix:', error));
  }, []);
  console.log(matrix);
  const drawHeatmap = (data) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3
      .select('#heatmap')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const users = Object.keys(data);
    console.log("data:", data);
    const tracks = Array.from(new Set(users.flatMap((user) => Object.keys(data[user]))));

    const x = d3.scaleBand().range([0, width]).domain(users).padding(0.01);
    const y = d3.scaleBand().range([height, 0]).domain(tracks).padding(0.01);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, d3.max(users.flatMap((user) => Object.values(data[user])))]);

    svg
      .selectAll()
      .data(users.flatMap((user) => tracks.map((track) => ({ user, track, value: data[user][track] || 0 }))))
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.user))
      .attr('y', (d) => y(d.track))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => colorScale(d.value));
  };

  return <div id="heatmap"></div>;
};

export default UserItemMatrix;