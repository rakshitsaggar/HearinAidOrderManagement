import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card, Button, Input, Select, Table, Badge, LoadingSpinner } from '../components/UI';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer_id: '',
    order_id: '',
    appointment_type: '',
    scheduled_date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, customersRes, ordersRes] = await Promise.all([
        api.get('/appointments').catch(() => ({ data: [] })),
        api.get('/customers').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] }))
      ]);

      setAppointments(appointmentsRes.data || []);
      setCustomers(customersRes.data || [
        { id: 1, first_name: 'John', last_name: 'Smith' },
        { id: 2, first_name: 'Jane', last_name: 'Doe' }
      ]);
      setOrders(ordersRes.data || [
        { id: 1, CustomerId: 1 },
        { id: 2, CustomerId: 2 }
      ]);

      // Demo appointments if none exist
      if (appointmentsRes.data?.length === 0) {
        setAppointments([
          {
            id: 1,
            CustomerId: 1,
            OrderId: 1,
            appointment_type: 'consultation',
            scheduled_date: '2024-02-15T10:00:00',
            status: 'scheduled',
            notes: 'Initial hearing assessment'
          },
          {
            id: 2,
            CustomerId: 2,
            OrderId: 2,
            appointment_type: 'fitting',
            scheduled_date: '2024-02-16T14:00:00',
            status: 'scheduled',
            notes: 'Hearing aid fitting and adjustment'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.customer_id) newErrors.customer_id = 'Please select a customer';
    if (!form.appointment_type) newErrors.appointment_type = 'Please select appointment type';
    if (!form.scheduled_date) newErrors.scheduled_date = 'Please select date and time';
    else {
      const appointmentDate = new Date(form.scheduled_date);
      const now = new Date();
      if (appointmentDate <= now) {
        newErrors.scheduled_date = 'Appointment must be scheduled for future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await api.post('/appointments', form);
      
      // Reset form and refresh data
      setForm({
        customer_id: '',
        order_id: '',
        appointment_type: '',
        scheduled_date: '',
        notes: ''
      });
      setShowForm(false);
      setErrors({});
      await fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      // Simulate success for demo
      const newAppointment = {
        id: Date.now(),
        CustomerId: parseInt(form.customer_id),
        OrderId: parseInt(form.order_id) || null,
        appointment_type: form.appointment_type,
        scheduled_date: form.scheduled_date,
        status: 'scheduled',
        notes: form.notes
      };
      
      setAppointments([newAppointment, ...appointments]);
      setForm({
        customer_id: '',
        order_id: '',
        appointment_type: '',
        scheduled_date: '',
        notes: ''
      });
      setShowForm(false);
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Initial Consultation' },
    { value: 'fitting', label: 'Hearing Aid Fitting' },
    { value: 'adjustment', label: 'Device Adjustment' },
    { value: 'maintenance', label: 'Maintenance & Cleaning' },
    { value: 'follow-up', label: 'Follow-up Check' },
    { value: 'repair', label: 'Repair Service' }
  ];

  const getTypeIcon = (type) => {
    const icons = {
      consultation: '💬',
      fitting: '🔧',
      adjustment: '⚙️',
      maintenance: '🛠️',
      'follow-up': '📋',
      repair: '🔨'
    };
    return icons[type] || '📅';
  };

  const getTypeColor = (type) => {
    const colors = {
      consultation: 'blue',
      fitting: 'green',
      adjustment: 'yellow',
      maintenance: 'gray',
      'follow-up': 'blue',
      repair: 'red'
    };
    return colors[type] || 'gray';
  };

  const customerOptions = customers.map(c => ({
    value: c.id.toString(),
    label: `${c.first_name} ${c.last_name}`
  }));

  const orderOptions = orders
    .filter(order => form.customer_id ? order.CustomerId.toString() === form.customer_id : true)
    .map(order => ({
      value: order.id.toString(),
      label: `Order #${order.id}`
    }));

  const columns = [
    {
      header: 'Date & Time',
      accessor: (appointment) => {
        const date = new Date(appointment.scheduled_date);
        const isUpcoming = date > new Date();
        return (
          <div>
            <p className="font-medium">{date.toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            {!isUpcoming && <Badge color="red" className="text-xs">Past</Badge>}
          </div>
        );
      }
    },
    {
      header: 'Customer',
      accessor: (appointment) => {
        const customer = customers.find(c => c.id === appointment.CustomerId);
        return (
          <div>
            <p className="font-medium">
              {customer ? `${customer.first_name} ${customer.last_name}` : `Customer #${appointment.CustomerId}`}
            </p>
            <p className="text-sm text-gray-500">ID: {appointment.CustomerId}</p>
          </div>
        );
      }
    },
    {
      header: 'Type',
      accessor: (appointment) => (
        <Badge color={getTypeColor(appointment.appointment_type)}>
          {getTypeIcon(appointment.appointment_type)} {appointment.appointment_type}
        </Badge>
      )
    },
    {
      header: 'Order',
      accessor: (appointment) => 
        appointment.OrderId ? `Order #${appointment.OrderId}` : 'No order'
    },
    {
      header: 'Notes',
      accessor: (appointment) => 
        appointment.notes ? (
          <div className="max-w-xs truncate" title={appointment.notes}>
            {appointment.notes}
          </div>
        ) : (
          <span className="text-gray-400">No notes</span>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage customer appointments</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          Schedule Appointment
        </Button>
      </div>

      {/* Appointment Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Schedule New Appointment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              options={customerOptions}
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value, order_id: '' })}
              error={errors.customer_id}
              placeholder="Select customer..."
              required
            />
            
            <Select
              label="Order (Optional)"
              options={orderOptions}
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              placeholder="Select related order..."
              disabled={!form.customer_id}
            />
            
            <Select
              label="Appointment Type"
              options={appointmentTypes}
              value={form.appointment_type}
              onChange={(e) => setForm({ ...form, appointment_type: e.target.value })}
              error={errors.appointment_type}
              placeholder="Select type..."
              required
            />
            
            <Input
              label="Date & Time"
              type="datetime-local"
              value={form.scheduled_date}
              onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
              error={errors.scheduled_date}
              required
            />
            
            <div className="md:col-span-2">
              <Input
                label="Notes (Optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes or instructions..."
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" loading={submitting}>
                Schedule Appointment
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Appointments Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Appointments ({appointments.length})</h2>
        {appointments.length > 0 ? (
          <Table columns={columns} data={appointments} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Schedule your first appointment
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}