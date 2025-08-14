import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card, Select, Button, Badge, Table, LoadingSpinner } from '../components/UI';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Demo data if API fails
      setOrders([
        {
          id: 1,
          CustomerId: 1,
          status: 'ordered',
          final_amount: 17500,
          createdAt: '2024-01-15',
          tracking_number: 'TRK001'
        },
        {
          id: 2,
          CustomerId: 2,
          status: 'shipped',
          final_amount: 31500,
          createdAt: '2024-01-14',
          tracking_number: 'TRK002'
        },
        {
          id: 3,
          CustomerId: 1,
          status: 'delivered',
          final_amount: 24500,
          createdAt: '2024-01-10',
          tracking_number: 'TRK003'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      // Simulate success for demo
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const downloadInvoice = (orderId) => {
    // In a real app, this would download the PDF
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  const getStatusConfig = (status) => {
    const config = {
      ordered: { color: 'gray', icon: '📋', label: 'Ordered' },
      shipped: { color: 'blue', icon: '🚚', label: 'Shipped' },
      delivered: { color: 'yellow', icon: '📦', label: 'Delivered' },
      fitted: { color: 'green', icon: '✅', label: 'Fitted' }
    };
    return config[status] || config.ordered;
  };

  const statusOptions = [
    { value: 'ordered', label: '📋 Ordered' },
    { value: 'shipped', label: '🚚 Shipped' },
    { value: 'delivered', label: '📦 Delivered' },
    { value: 'fitted', label: '✅ Fitted' }
  ];

  const columns = [
    {
      header: 'Order',
      accessor: (order) => (
        <div>
          <p className="font-medium">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">Customer #{order.CustomerId}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (order) => {
        const statusConfig = getStatusConfig(order.status);
        return (
          <Badge color={statusConfig.color}>
            {statusConfig.icon} {statusConfig.label}
          </Badge>
        );
      }
    },
    {
      header: 'Amount',
      accessor: (order) => (
        <div>
          <p className="font-medium">₹{order.final_amount?.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Final amount</p>
        </div>
      )
    },
    {
      header: 'Tracking',
      accessor: (order) => order.tracking_number || 'Not assigned'
    },
    {
      header: 'Actions',
      accessor: (order) => (
        <div className="flex flex-col space-y-2">
          <Select
            options={statusOptions}
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            disabled={updatingStatus[order.id]}
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadInvoice(order.id)}
            >
              Invoice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Order details for #${order.id}`)}
            >
              Details
            </Button>
          </div>
        </div>
      )
    }
  ];

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage all customer orders</p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statusOptions.map(status => {
          const count = orders.filter(order => order.status === status.value).length;
          const statusConfig = getStatusConfig(status.value);
          
          return (
            <Card key={status.value} className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {statusConfig.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
                <div className="text-3xl">{statusConfig.icon}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">All Orders ({orders.length})</h2>
          <Button onClick={() => window.location.href = '/new-order'}>
            New Order
          </Button>
        </div>
        
        {orders.length > 0 ? (
          <Table columns={columns} data={orders} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders found</p>
            <Button onClick={() => window.location.href = '/new-order'}>
              Create your first order
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}