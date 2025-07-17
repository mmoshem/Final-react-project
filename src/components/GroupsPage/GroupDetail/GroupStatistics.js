import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './GroupStatistics.css';

const GroupStatistics = ({ groupId, groupName, onClose }) => {
    const [analytics, setAnalytics] = useState(null);
    const [timeRange, setTimeRange] = useState('7'); // Default to 7 days
    const [customRange, setCustomRange] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Refs for D3 charts
    const postsChartRef = useRef(null);
    const memberChartRef = useRef(null);
    const hourlyChartRef = useRef(null);
    const weeklyChartRef = useRef(null);
    const engagementChartRef = useRef(null);
    const mediaChartRef = useRef(null);

    useEffect(() => {
        fetchAnalytics();
    }, [groupId, timeRange, customRange, customStart, customEnd]);

    useEffect(() => {
        if (analytics && analytics.postsAnalytics) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                drawCharts();
            }, 100);
        }
    }, [analytics]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/groups/${groupId}/analytics`;
            if (customRange && customStart && customEnd) {
                url += `?startDate=${customStart}&endDate=${customEnd}`;
            } else {
                url += `?timeRange=${timeRange}`;
            }
            console.log(`📊 Fetching analytics for group ${groupId}, timeRange: ${timeRange} days`);
            const response = await axios.get(url);
            console.log('📈 Analytics data received:', response.data);
            setAnalytics(response.data);
            setError('');
        } catch (err) {
            console.error('❌ Analytics error:', err);
            setError('Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    const drawCharts = () => {
        try {
            drawPostsTimeline();
            drawMemberGrowth();
            drawHourlyActivity();
            drawWeeklyActivity();
            drawEngagementChart();
            drawMediaUsageChart();
        } catch (error) {
            console.error('Error drawing charts:', error);
        }
    };

    const drawPostsTimeline = () => {
        const container = d3.select(postsChartRef.current);
        container.selectAll("*").remove();

        const data = analytics.postsAnalytics.postsTimeline;
        if (!data || data.length === 0) {
            container.append("div")
                .style("text-align", "center")
                .style("padding", "40px")
                .style("color", "#6b7280")
                .text("No posts data available");
            return;
        }

        const margin = { top: 30, right: 30, bottom: 60, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.bottom - margin.top;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 1])
            .range([height, 0]);

        // Line generator
        const line = d3.line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d.count))
            .curve(d3.curveMonotoneX);

        // Add gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height)
            .attr("x2", 0).attr("y2", 0);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#8b5cf6")
            .attr("stop-opacity", 0.1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#8b5cf6")
            .attr("stop-opacity", 0.8);

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%m/%d"))
                .ticks(Math.min(data.length, 7)))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add area under line
        const area = d3.area()
            .x(d => xScale(new Date(d.date)))
            .y0(height)
            .y1(d => yScale(d.count))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(data)
            .attr("fill", "url(#line-gradient)")
            .attr("d", area);

        // Add line
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#8b5cf6")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Add dots with hover effects
        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(new Date(d.date)))
            .attr("cy", d => yScale(d.count))
            .attr("r", 5)
            .attr("fill", "#8b5cf6")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(200).attr("r", 8);
                
                // Tooltip
                const tooltip = g.append("g").attr("class", "tooltip");
                const rect = tooltip.append("rect")
                    .attr("x", xScale(new Date(d.date)) - 30)
                    .attr("y", yScale(d.count) - 35)
                    .attr("width", 60)
                    .attr("height", 25)
                    .attr("fill", "rgba(0,0,0,0.8)")
                    .attr("rx", 4);
                
                tooltip.append("text")
                    .attr("x", xScale(new Date(d.date)))
                    .attr("y", yScale(d.count) - 15)
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .style("font-size", "12px")
                    .text(`${d.count} posts`);
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(200).attr("r", 5);
                g.select(".tooltip").remove();
            });

        // Add title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("📈 Posts Over Time");
    };

    const drawMemberGrowth = () => {
        const container = d3.select(memberChartRef.current);
        container.selectAll("*").remove();

        const data = analytics.memberAnalytics.memberGrowth;
        const margin = { top: 30, right: 30, bottom: 60, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.bottom - margin.top;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.members) || 1])
            .range([height, 0]);

        const area = d3.area()
            .x(d => xScale(new Date(d.date)))
            .y0(height)
            .y1(d => yScale(d.members))
            .curve(d3.curveMonotoneX);

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%m/%d"))
                .ticks(Math.min(data.length, 7)))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add area with gradient
        const memberGradient = svg.select("defs").empty() ? svg.append("defs") : svg.select("defs");
        memberGradient.append("linearGradient")
            .attr("id", "member-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height)
            .attr("x2", 0).attr("y2", 0);

        memberGradient.select("#member-gradient").selectAll("stop").remove();
        memberGradient.select("#member-gradient").append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.1);

        memberGradient.select("#member-gradient").append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.8);

        g.append("path")
            .datum(data)
            .attr("fill", "url(#member-gradient)")
            .attr("d", area);

        // Add title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("👥 Member Growth");
    };

    const drawHourlyActivity = () => {
        const container = d3.select(hourlyChartRef.current);
        container.selectAll("*").remove();

        const data = analytics.postsAnalytics.hourlyActivity;
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 250 - margin.bottom - margin.top;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.hour))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 1])
            .range([height, 0]);

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues(data.filter((d, i) => i % 3 === 0).map(d => d.hour)))
            .selectAll("text")
            .style("font-size", "11px");

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add bars
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.hour))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.count))
            .attr("height", d => height - yScale(d.count))
            .attr("fill", "#f59e0b")
            .attr("rx", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#d97706");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#f59e0b");
            });

        // Add title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("🕐 Activity by Hour");
    };

    const drawWeeklyActivity = () => {
        const container = d3.select(weeklyChartRef.current);
        container.selectAll("*").remove();

        const data = analytics.postsAnalytics.weeklyActivity;
        const margin = { top: 30, right: 30, bottom: 50, left: 50 }; 
        const width = 500 - margin.left - margin.right;
        const height = 250 - margin.bottom - margin.top;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.day))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 1])
            .range([height, 0]);

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add bars
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.day))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.count))
            .attr("height", d => height - yScale(d.count))
            .attr("fill", "#ef4444")
            .attr("rx", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#dc2626");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#ef4444");
            });

        // Add title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("📅 Activity by Day of Week");
    };

    const drawEngagementChart = () => {
        const container = d3.select(engagementChartRef.current);
        container.selectAll("*").remove();

        const data = [
            { type: 'Likes', count: analytics.postsAnalytics.totalLikes, color: '#ef4444' },
            { type: 'Comments', count: analytics.postsAnalytics.totalComments, color: '#8b5cf6' }
        ];

        if (data[0].count === 0 && data[1].count === 0) {
            container.append("div")
                .style("text-align", "center")
                .style("padding", "60px")
                .style("color", "#6b7280")
                .text("No engagement data yet");
            return;
        }

        const width = 400;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 40;

        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${width/2}, ${height/2})`);

        const pie = d3.pie().value(d => d.count);
        const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius);

        const arcs = g.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => d.data.color)
            .style("cursor", "pointer")
            .on("mouseover", function() {
                d3.select(this).transition().duration(200)
                    .attr("transform", "scale(1.05)");
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(200)
                    .attr("transform", "scale(1)");
            });

        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(d => d.data.count > 0 ? d.data.count : '');

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(20, 20)`);

        const legendItems = legend.selectAll(".legend-item")
            .data(data)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 25})`);

        legendItems.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => d.color)
            .attr("rx", 2);

        legendItems.append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("font-size", "14px")
            .style("fill", "#374151")
            .text(d => d.type);

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("❤️ Engagement Distribution");
    };

    const drawMediaUsageChart = () => {
        const container = d3.select(mediaChartRef.current);
        container.selectAll("*").remove();

        const totalPosts = analytics.postsAnalytics.totalPosts;
        const data = [
            { type: 'With Media', count: analytics.postsAnalytics.postsWithMedia, color: '#10b981' },
            { type: 'Text Only', count: totalPosts - analytics.postsAnalytics.postsWithMedia, color: '#6b7280' }
        ];

        // Increased top margin for better spacing
        const margin = { top: 60, right: 30, bottom: 50, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 250 - margin.bottom - margin.top;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.type))
            .range([0, width])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 1])
            .range([height, 0]);

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("font-size", "12px");

        // Add bars
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.type))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.count))
            .attr("height", d => height - yScale(d.count))
            .attr("fill", d => d.color)
            .attr("rx", 4)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.8);
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);
            });

        // Add value labels on bars
        g.selectAll(".label")
            .data(data)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.type) + xScale.bandwidth()/2)
            .attr("y", d => yScale(d.count) - 8)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text(d => d.count);

        // Add title (move it further down for spacing)
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", 30) // was -10, now 30 for better spacing
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#374151")
            .text("\uD83D\uDCF1 Media Usage in Posts");
    };

    if (loading) {
        return (
            <div className="statistics-modal">
                <div className="statistics-container">
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="statistics-modal">
                <div className="statistics-container">
                    <div className="error">{error}</div>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="statistics-container">
                <div className="statistics-header">
                    <h2>📊 Group Analytics: {groupName}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="time-range-selector">
                    <label>Time Range: </label>
                    <select
                        value={customRange ? 'custom' : timeRange}
                        onChange={e => {
                            if (e.target.value === 'custom') {
                                setCustomRange(true);
                            } else {
                                setCustomRange(false);
                                setTimeRange(e.target.value);
                            }
                        }}
                    >
                        <option value="3">Last 3 days</option>
                        <option value="7">Last 7 days</option>
                        <option value="14">Last 14 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="60">Last 60 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="180">Last 180 days</option>
                        <option value="365">Last 365 days</option>
                        <option value="all">All Time</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    {customRange && (
                        <span style={{ marginLeft: 12 }}>
                            <input
                                type="date"
                                value={customStart}
                                onChange={e => setCustomStart(e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <input
                                type="date"
                                value={customEnd}
                                onChange={e => setCustomEnd(e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <button
                                onClick={() => {
                                    if (customStart && customEnd) fetchAnalytics();
                                }}
                                disabled={!customStart || !customEnd}
                            >Apply</button>
                        </span>
                    )}
                </div>
                {/* Optionally, add custom date range picker here in the future */}

                <div className="stats-summary">
                    <div className="stat-card">
                        <h3>Total Posts</h3>
                        <p className="stat-number">{analytics.postsAnalytics.totalPosts}</p>
                        <span className="stat-subtitle">in {analytics.timeRange.label}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Avg Posts/Day</h3>
                        <p className="stat-number">{analytics.postsAnalytics.avgPostsPerDay}</p>
                        <span className="stat-subtitle">daily average</span>
                    </div>
                    <div className="stat-card">
                        <h3>Total Likes</h3>
                        <p className="stat-number">{analytics.postsAnalytics.totalLikes}</p>
                        <span className="stat-subtitle">❤️ reactions</span>
                    </div>
                    <div className="stat-card">
                        <h3>Total Members</h3>
                        <p className="stat-number">{analytics.memberAnalytics.totalMembers}</p>
                        <span className="stat-subtitle">group size</span>
                    </div>
                    <div className="stat-card">
                        <h3>Media Usage</h3>
                        <p className="stat-number">{analytics.postsAnalytics.mediaUsageRate}%</p>
                        <span className="stat-subtitle">posts with media</span>
                    </div>
                    <div className="stat-card">
                        <h3>Engagement Rate</h3>
                        <p className="stat-number">{analytics.summary.engagementRate}</p>
                        <span className="stat-subtitle">likes+comments per post</span>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-container">
                        <div ref={postsChartRef}></div>
                    </div>
                    <div className="chart-container">
                        <div ref={memberChartRef}></div>
                    </div>
                    <div className="chart-container">
                        <div ref={hourlyChartRef}></div>
                    </div>
                    <div className="chart-container">
                        <div ref={weeklyChartRef}></div>
                    </div>
                    <div className="chart-container">
                        <div ref={engagementChartRef}></div>
                    </div>
                    <div className="chart-container">
                        <div ref={mediaChartRef}></div>
                    </div>
                </div>

                <div className="insights">
                    <h3>📈 Key Insights</h3>
                    <div className="insights-grid">
                        <div className="insight-item">
                            <strong>Most Active Hour:</strong> {analytics.summary.mostActiveHour.label}
                        </div>
                        <div className="insight-item">
                            <strong>Most Active Day:</strong> {analytics.summary.mostActiveDay.fullDay || analytics.summary.mostActiveDay.day}
                        </div>
                        <div className="insight-item">
                            <strong>Pending Requests:</strong> {analytics.memberAnalytics.currentPendingRequests}
                        </div>
                        <div className="insight-item">
                            <strong>Activity Level:</strong> {analytics.summary.activityLevel}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupStatistics;