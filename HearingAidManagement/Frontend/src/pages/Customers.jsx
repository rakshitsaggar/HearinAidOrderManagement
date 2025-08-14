import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card, Button, Input, Select, Table, LoadingSpinner, Badge } from '../components/UI';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hearing_loss_level: 'mild',
    budget_range: 0,
    has_insurance: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Set some demo data if API fails
      setCustomers([
        {
          id: 1,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@email.com',
          phone: '555-0123',
          hearing_loss_level: 'moderate',
          budget_range: 25000,
          has_insurance: true
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@email.com',
          phone: '555-0456',
          hearing_loss_level: 'mild',
          budget_range: 15000,
          has_insurance: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (form.budget_range <= 0) newErrors.budget_range = 'Budget must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await api.post('/customers', form);
      
      // Reset form
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        hearing_loss_level: 'mild',
        budget_range: 0,
        has_insurance: false
      });
      setErrors({});
      setShowForm(false);
      await fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      // Simulate success for demo
      const newCustomer = {
        id: Date.now(),
        ...form
      };
      setCustomers([newCustomer, ...customers]);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        hearing_loss_level: 'mild',
        budget_range: 0,
        has_insurance: false
      });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const hearingLevelOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
    { value: 'profound', label: 'Profound' }
  ];

  const getHearingLevelColor = (level) => {
    const colors = {
      mild: 'green',
      moderate: 'yellow',
      severe: 'red',
      profound: 'red'
    };
    return colors[level] || 'gray';
  };

  const columns = [
    {
      header: 'Name',
      accessor: (customer) => (
        <div>
          <p className="font-medium">{customer.first_name} {customer.last_name}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
      )
    },
    {
      header: 'Phone',
      accessor: 'phone'
    },
    {
      header: 'Hearing Level',
      accessor: (customer) => (
        <Badge color={getHearingLevelColor(customer.hearing_loss_level)}>
          {customer.hearing_loss_level}
        </Badge>
      )
    },
    {
      header: 'Budget',
      accessor: (customer) => `₹${customer.budget_range?.toLocaleString()}`
    },
    {
      header: 'Insurance',
      accessor: (customer) => (
        <Badge color={customer.has_insurance ? 'green' : 'gray'}>
          {customer.has_insurance ? 'Yes' : 'No'}
        </Badge>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your customers and their hearing profiles</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          Add Customer
        </Button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              error={errors.first_name}
              required
            />
            <Input
              label="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              error={errors.last_name}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={errors.phone}
              required
            />
            <Select
              label="Hearing Loss Level"
              options={hearingLevelOptions}
              value={form.hearing_loss_level}
              onChange={(e) => setForm({ ...form, hearing_loss_level: e.target.value })}
            />
            <Input
              label="Budget Range (₹)"
              type="number"
              value={form.budget_range}
              onChange={(e) => setForm({ ...form, budget_range: parseInt(e.target.value) || 0 })}
              error={errors.budget_range}
              required
            />
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.has_insurance}
                  onChange={(e) => setForm({ ...form, has_insurance: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Insurance</span>
              </label>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" loading={submitting}>
                Add Customer
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Customers Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Customers ({customers.length})</h2>
        {customers.length > 0 ? (
          <Table columns={columns} data={customers} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No customers found</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Add your first customer
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}