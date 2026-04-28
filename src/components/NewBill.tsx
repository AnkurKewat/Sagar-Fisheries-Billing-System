import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBilling } from '../context/BillingContext';
import type { Bill, BillItem } from '../types';
import { Plus, Minus } from 'lucide-react';

const CATEGORIES = ['Scampi U3', 'Scampi U5', 'Scampi U7', 'Scampi U10', 'Scampi U15', 'Scampi U20', 'Peeling', 'M Peeling'];

const NewBill: React.FC = () => {
  const { addBill, bills } = useBilling();
  const navigate = useNavigate();

  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState('');
  
  const [purchasedFrom, setPurchasedFrom] = useState('');
  
  const [items, setItems] = useState<{id: string, category: string, weight: number | '', rate: number | ''}[]>([
    { id: Date.now().toString(), category: CATEGORIES[0], weight: '', rate: '' }
  ]);
  
  const [transportType, setTransportType] = useState<'Train' | 'Truck' | ''>('');
  const [transportNumber, setTransportNumber] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'Cheque' | ''>('');
  const [paymentReference, setPaymentReference] = useState('');
  const [amountDeposited, setAmountDeposited] = useState<number | ''>('');

  const amount = useMemo(() => {
    return items.reduce((sum, item) => {
      const w = typeof item.weight === 'number' ? item.weight : 0;
      const r = typeof item.rate === 'number' ? item.rate : 0;
      return sum + (w * r);
    }, 0);
  }, [items]);



  const pendingAmount = useMemo(() => {
    const d = typeof amountDeposited === 'number' ? amountDeposited : 0;
    return amount - d;
  }, [amount, amountDeposited]);

  useEffect(() => {
    // Generate Sequential Bill Number and Date
    const nextNum = bills.length + 1;
    setBillNumber(`SF-${nextNum.toString().padStart(3, '0')}`);
    const now = new Date();
    setDate(now.toLocaleString());
  }, [bills.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out completely empty rows
    const filledItems = items.filter(item => item.weight !== '' || item.rate !== '');
    
    // Check if any filled item has invalid weight or rate
    const hasInvalidItems = filledItems.some(item => typeof item.weight !== 'number' || typeof item.rate !== 'number' || item.weight <= 0 || item.rate <= 0);
    
    if (!purchasedFrom || hasInvalidItems || filledItems.length === 0) {
      alert("Please fill all required fields correctly and add at least one valid item.");
      return;
    }

    const processedItems: BillItem[] = filledItems.map(item => ({
      id: item.id,
      category: item.category,
      weight: item.weight as number,
      rate: item.rate as number,
      amount: (item.weight as number) * (item.rate as number)
    }));

    const newBill: Bill = {
      id: Date.now().toString(),
      billNumber,
      date,
      purchasedFrom,
      items: processedItems,
      amount,
      transportType,
      transportNumber,
      paymentMethod,
      paymentReference,
      amountDeposited: typeof amountDeposited === 'number' ? amountDeposited : 0,
      pendingAmount
    };

    addBill(newBill);
    alert('Bill saved successfully!');
    
    // Auto-reset form
    setPurchasedFrom('');
    setItems([{ id: Date.now().toString(), category: CATEGORIES[0], weight: '', rate: '' }]);
    setTransportType('');
    setTransportNumber('');
    setPaymentMethod('');
    setPaymentReference('');
    setAmountDeposited('');
    
    // Generate new date (billNumber updates via useEffect)
    const now = new Date();
    setDate(now.toLocaleString());
  };

  return (
    <div>
      <h1 className="mb-4">Create New Bill</h1>
      <form onSubmit={handleSubmit} className="card">
        {/* Section 1: Basic Info */}
        <div className="card-header">
          <h3>📌 Basic Info</h3>
        </div>
        <div className="card-body grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bill Number</label>
            <input type="text" value={billNumber} disabled />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date & Time</label>
            <input type="text" value={date} disabled />
          </div>
        </div>

        {/* Section 2: Party Details */}
        <div className="card-header">
          <h3>📌 Party Details</h3>
        </div>
        <div className="card-body">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Purchased From <span style={{color:'red'}}>*</span></label>
            <input type="text" value={purchasedFrom} onChange={e => setPurchasedFrom(e.target.value)} required placeholder="Enter supplier name" />
          </div>
        </div>

        {/* Section 3 & 4: Prawns Category & Products */}
        <div className="card-header flex-between">
          <h3>🦐 Prawns Details</h3>
          <button 
            type="button" 
            className="btn btn-secondary flex-row" 
            style={{ padding: '0.4rem 0.6rem' }}
            onClick={() => setItems([...items, { id: Date.now().toString() + Math.random(), category: CATEGORIES[0], weight: '', rate: '' }])}
            title="Add Item"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="card-body">
          {items.map((item, index) => (
            <div key={item.id} className="mb-4" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
              <div className="flex-between">
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Item {index + 1}</h4>
                {items.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => setItems(items.filter(i => i.id !== item.id))}
                    className="btn btn-secondary flex-row"
                    style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                    title="Remove Item"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
              <div className="grid-3">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                  <select 
                    value={item.category} 
                    onChange={e => {
                      const newItems = [...items];
                      newItems[index].category = e.target.value;
                      setItems(newItems);
                    }} 
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Weight (kg)</label>
                  <input 
                    type="number" min="0" step="0.01" 
                    value={item.weight} 
                    onChange={e => {
                      const val = parseFloat(e.target.value) || '';
                      const newItems = [...items];
                      newItems[index].weight = val;
                      setItems(newItems);
                    }} 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rate per kg (₹)</label>
                  <input 
                    type="number" min="0" step="0.01" 
                    value={item.rate} 
                    onChange={e => {
                      const val = parseFloat(e.target.value) || '';
                      const newItems = [...items];
                      newItems[index].rate = val;
                      setItems(newItems);
                    }} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>
          ))}
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Total Amount: </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Export Section */}
        <div className="card-header">
          <h3>🚚 Export Options</h3>
        </div>
        <div className="card-body">
          <div className="grid-2 mb-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Export Type</label>
              <select value={transportType} onChange={e => setTransportType(e.target.value as any)}>
                <option value="">Select Export Option</option>
                <option value="Train">Train</option>
                <option value="Truck">Truck</option>
              </select>
            </div>
            {transportType && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{transportType} Number</label>
                <input type="text" value={transportNumber} onChange={e => setTransportNumber(e.target.value)} placeholder={`Enter ${transportType} Number`} required />
              </div>
            )}
          </div>
          </div>

        {/* Payment Section */}
        <div className="card-header">
          <h3>💰 Payment Details</h3>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Payment Method</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label className="flex-row">
                <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => {setPaymentMethod('Cash'); setPaymentReference('');}} /> Cash
              </label>
              <label className="flex-row">
                <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === 'Online'} onChange={() => {setPaymentMethod('Online'); setPaymentReference('');}} /> Online
              </label>
              <label className="flex-row">
                <input type="radio" name="paymentMethod" value="Cheque" checked={paymentMethod === 'Cheque'} onChange={() => {setPaymentMethod('Cheque'); setPaymentReference('');}} /> Cheque
              </label>
            </div>
          </div>

          {(paymentMethod === 'Online' || paymentMethod === 'Cheque') && (
            <div className="mb-4">
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                 {paymentMethod === 'Online' ? 'Transaction ID / UPI ID' : 'Cheque Number'} <span style={{color:'red'}}>*</span>
               </label>
               <input type="text" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} required placeholder={paymentMethod === 'Online' ? 'Enter Transaction ID' : 'Enter Cheque Number'} />
            </div>
          )}

          <div className="grid-2 mb-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Amount Deposited (₹)</label>
              <input type="number" min="0" step="0.01" value={amountDeposited} onChange={e => setAmountDeposited(parseFloat(e.target.value) || '')} placeholder="0.00" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
               <div style={{ padding: '0.6rem 1rem', backgroundColor: pendingAmount > 0 ? '#fee2e2' : '#dcfce7', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
                 <span style={{ fontWeight: 500 }}>Pending Amount: </span>
                 <span style={{ fontWeight: 700, color: pendingAmount > 0 ? 'var(--error)' : 'var(--success)' }}>₹{pendingAmount.toLocaleString()}</span>
               </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Bill</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewBill;
