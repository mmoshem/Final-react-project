// components/profile/StatisticsSection.js
import React from "react";
import "./StatisticsSection.css";

export default function StatisticsSection() {
  return (
    <div className="no-stats-box">
      <div className="no-stats-icon">📊</div>
      <h3>No statistics yet</h3>
      <p>Once you start engaging, your stats will show up here.</p>
    </div>
  );
}
