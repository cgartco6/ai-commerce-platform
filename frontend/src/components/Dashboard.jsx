import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, ArcElement, Title, Tooltip, Legend
);

const Dashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    visitors: 0,
    conversionRate: 0,
    activeCampaigns: 0
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      const data = await response.json();
      setMetrics(data.metrics);
      setAiRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>AI Commerce Dashboard</h1>
      
      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Revenue</h3>
          <div className="metric-value">${metrics.revenue.toLocaleString()}</div>
          <div className="metric-change positive">+12.5%</div>
        </div>
        
        <div className="metric-card">
          <h3>Visitors</h3>
          <div className="metric-value">{metrics.visitors.toLocaleString()}</div>
          <div className="metric-change positive">+8.3%</div>
        </div>
        
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">{metrics.conversionRate}%</div>
          <div className="metric-change positive">+2.1%</div>
        </div>
        
        <div className="metric-card">
          <h3>Active Campaigns</h3>
          <div className="metric-value">{metrics.activeCampaigns}</div>
          <div className="metric-change">Optimizing</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <Line data={revenueData} />
        </div>
        
        <div className="chart-card">
          <h3>Traffic Sources</h3>
          <Doughnut data={{
            labels: ['Organic', 'Social', 'Email', 'Direct'],
            datasets: [{
              data: [45, 25, 15, 15],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
          }} />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="recommendations-section">
        <h3>AI Recommendations</h3>
        <div className="recommendations-list">
          {aiRecommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <span className={`rec-icon ${rec.type}`}>
                {rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : '💡'}
              </span>
              <span>{rec.message}</span>
              <button className="action-btn">Apply</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
