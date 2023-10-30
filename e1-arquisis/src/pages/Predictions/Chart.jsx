import React from "react";
import { Line } from "react-chartjs-2";
import PropTypes from 'prop-types'; // Step 1

function LineChart({ chartData }) {
  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "My predictions"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}

// Step 2
LineChart.propTypes = {
  chartData: PropTypes.object.isRequired
};

export default LineChart;
