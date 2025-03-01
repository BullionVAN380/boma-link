'use client';

import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  propertiesByStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  propertiesByType: {
    sale: number;
    rent: number;
  };
  propertiesByCity: Record<string, number>;
  monthlyListings: Record<string, number>;
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-700 mb-2">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-600">
        No analytics data available
      </div>
    );
  }

  const statusChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          analyticsData.propertiesByStatus.pending,
          analyticsData.propertiesByStatus.approved,
          analyticsData.propertiesByStatus.rejected,
        ],
        backgroundColor: ['#FCD34D', '#34D399', '#F87171'],
      },
    ],
  };

  const typeChartData = {
    labels: ['For Sale', 'For Rent'],
    datasets: [
      {
        data: [
          analyticsData.propertiesByType.sale,
          analyticsData.propertiesByType.rent,
        ],
        backgroundColor: ['#60A5FA', '#818CF8'],
      },
    ],
  };

  const cityChartData = {
    labels: Object.keys(analyticsData.propertiesByCity),
    datasets: [
      {
        label: 'Properties by City',
        data: Object.values(analyticsData.propertiesByCity),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(analyticsData.monthlyListings),
    datasets: [
      {
        label: 'Monthly Listings',
        data: Object.values(analyticsData.monthlyListings),
        borderColor: '#3B82F6',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-900">
              {Object.values(analyticsData.propertiesByStatus).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Approved</h3>
            <p className="text-3xl font-bold text-green-900">
              {analyticsData.propertiesByStatus.approved}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-900">
              {analyticsData.propertiesByStatus.pending}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700">Rejected</h3>
            <p className="text-3xl font-bold text-red-900">
              {analyticsData.propertiesByStatus.rejected}
            </p>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="h-[200px]">
            <Pie data={statusChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Property Types */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Property Types</h3>
          <div className="h-[200px]">
            <Pie data={typeChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Properties by City */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Properties by City</h3>
          <div className="h-[200px]">
            <Bar
              data={cityChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Listings Trend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Listings Trend</h3>
        <div className="h-[300px]">
          <Line
            data={monthlyChartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
