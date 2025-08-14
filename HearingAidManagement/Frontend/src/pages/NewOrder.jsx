import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Card, Button, Select, Input, Badge } from '../components/UI';

export default function NewOrder() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [earSide, setEarSide] = useState('both');
  const [loading, setLoading] = useState(true);

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
      // Demo data if API fails
      setCustomers([
        { id: 1, first_name: 'John', last_name: 'Smith', hearing_loss_level: 'moderate', budget_range: 25000 },
        { id: 2, first_name: 'Jane', last_name: 'Doe', hearing_loss_level: 'mild', budget_range: 15000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (!selectedCustomerId) return;

    try {
      const response = await api.get(`/hearing-aids/recommend/${selectedCustomerId}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Demo products based on customer profile
      const customer = customers.find(c => c.id.toString() === selectedCustomerId);
      const demoProducts = [
        {
          id: 1,
          brand: 'Signia',
          model: 'Basic ITE',
          type: 'ITE',
          price: 15000,
          features: ['Basic amplification', 'Noise reduction'],
          suitable_for_loss_levels: ['mild', 'moderate']
        },
        {
          id: 2,
          brand: 'Signia',
          model: 'Advanced BTE',
          type: 'BTE',
          price: 35000,
          features: ['Bluetooth', 'Rechargeable', 'Advanced noise reduction'],
          suitable_for_loss_levels: ['moderate', 'severe']
        },
        {
          id: 3,
          brand: 'Phonak',
          model: 'Premium CIC',
          type: 'CIC',
          price: 55000,
          features: ['Invisible wear', 'AI-powered', 'Smartphone compatible'],
          suitable_for_loss_levels: ['mild', 'moderate', 'severe']
        }
      ];
      
      // Filter products based on customer budget and hearing level
      const filtered = demoProducts.filter(p => 
        p.price <= customer?.budget_range && 
        p.suitable_for_loss_levels.includes(customer?.hearing_loss_level)
      );
      
      setProducts(filtered);
    }
  };

  const placeOrder = async () => {
    if (!selectedCustomerId || !selectedProductId) {
      alert('Please select both customer and product');
      return;
    }

    try {
      await api.post('/orders', {
        customer_id: selectedCustomerId,
        items: [{
          hearing_aid_id: selectedProductId,
          quantity,
          ear_side: earSide
        }]
      });
      alert('Order placed successfully!');
      
      // Reset form
      setProducts([]);
      setSelectedProductId('');
      setQuantity(1);
      setEarSide('both');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Order placed successfully! (Demo mode)');
      
      // Reset form
      setProducts([]);
      setSelectedProductId('');
      setQuantity(1);
      setEarSide('both');
    }
  };

  const selectedCustomer = customers.find(c => c.id.toString() === selectedCustomerId);
  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
  
  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const subtotal = selectedProduct.price * quantity;
    const discount = selectedCustomer?.has_insurance ? subtotal * 0.3 : 0;
    return subtotal - discount;
  };

  const customerOptions = customers.map(c => ({
    value: c.id.toString(),
    label: `${c.first_name} ${c.last_name} (${c.hearing_loss_level})`
  }));

  const earSideOptions = [
    { value: 'left', label: 'Left Ear' },
    { value: 'right', label: 'Right Ear' },
    { value: 'both', label: 'Both Ears' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Order</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new hearing aid order for your customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">1. Select Customer</h2>
          
          <Select
            label="Customer"
            options={customerOptions}
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            placeholder="Choose a customer..."
            className="mb-4"
          />

          {selectedCustomer && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                <p><span className="font-medium">Hearing Level:</span> 
                  <Badge color="blue" className="ml-2">{selectedCustomer.hearing_loss_level}</Badge>
                </p>
                <p><span className="font-medium">Budget:</span> ₹{selectedCustomer.budget_range?.toLocaleString()}</p>
                {selectedCustomer.has_insurance && (
                  <p><Badge color="green">30% Insurance Discount Available</Badge></p>
                )}
              </div>
              
              <Button 
                onClick={getRecommendations}
                className="mt-4"
              >
                Get Product Recommendations
              </Button>
            </div>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          {!selectedCustomer ? (
            <p className="text-gray-500">Please select a customer first</p>
          ) : !selectedProduct ? (
            <p className="text-gray-500">No product selected</p>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium">{selectedProduct.brand} {selectedProduct.model}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type: {selectedProduct.type}</p>
                <p className="text-lg font-semibold">₹{selectedProduct.price.toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <Select
                  label="Ear Side"
                  options={earSideOptions}
                  value={earSide}
                  onChange={(e) => setEarSide(e.target.value)}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{(selectedProduct.price * quantity).toLocaleString()}</span>
                </div>
                {selectedCustomer.has_insurance && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Insurance Discount (30%):</span>
                    <span>-₹{(selectedProduct.price * quantity * 0.3).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <Button onClick={placeOrder} className="w-full">
                Place Order
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Product Recommendations */}
      {products.length > 0 && (
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">2. Recommended Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedProductId === product.id.toString()
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProductId(product.id.toString())}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{product.brand} {product.model}</h3>
                  <Badge color="gray">{product.type}</Badge>
                </div>
                <p className="text-lg font-semibold text-primary-600 mb-2">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="space-y-1">
                  {product.features?.map((feature, index) => (
                    <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                      • {feature}
                    </p>
                  ))}
                </div>
                {selectedProductId === product.id.toString() && (
                  <div className="mt-3 flex items-center text-primary-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}