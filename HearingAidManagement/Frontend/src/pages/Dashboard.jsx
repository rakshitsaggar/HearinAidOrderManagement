import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Card, LoadingSpinner, Badge } from '../components/UI';

export default function Dashboard() {
  const [data, setData] = useState({
    orders: [],
    customers: [],
    stats: {
      totalOrders: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      completedOrders: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/customers').catch(() => ({ data: [] }))
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      setData({
        orders: orders.slice(0, 5), // Recent 5 orders
        customers: customers.slice(0, 5), // Recent 5 customers
        stats: {
          totalOrders: orders.length,
          totalCustomers: customers.length,
          pendingOrders: orders.filter(o => o.status !== 'fitted').length,
          completedOrders: orders.filter(o => o.status === 'fitted').length
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ordered: 'gray',
      shipped: 'blue',
      delivered: 'yellow',
      fitted: 'green'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ordered: '📋',
      shipped: '🚚',
      delivered: '📦',
      fitted: '✅'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your hearing aid management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.totalOrders}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.totalCustomers}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.pendingOrders}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.completedOrders}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </Card>
      </div>

      {/* Recent Orders and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          
          {data.orders.length > 0 ? (
            <div className="space-y-4">
              {data.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer #{order.CustomerId} • ₹{order.final_amount?.toLocaleString()}
                    </p>
                  </div>
                  <Badge color={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)} {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
              <Link
                to="/new-order"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Create your first order
              </Link>
            </div>
          )}
        </Card>

        {/* Recent Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Customers</h2>
            <Link
              to="/customers"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          
          {data.customers.length > 0 ? (
            <div className="space-y-4">
              {data.customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.first_name} {customer.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {customer.email} • Budget: ₹{customer.budget_range?.toLocaleString()}
                    </p>
                  </div>
                  <Badge color="blue">
                    {customer.hearing_loss_level}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No customers yet</p>
              <Link
                to="/customers"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Add your first customer
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}