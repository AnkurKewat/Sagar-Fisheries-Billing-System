import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { Printer, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Records: React.FC = () => {
  const { bills } = useBilling();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.purchasedFrom.toLowerCase().includes(searchTerm.toLowerCase());
    
    // dateFilter matches the date if set
    const matchesDate = dateFilter ? bill.date.includes(dateFilter) : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Billing Records</h1>
      </div>

      <div className="card mb-4">
        <div className="card-body flex-row">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by Bill No, Buyer, or Supplier..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
            <input 
              type="date" 
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ paddingLeft: '35px', width: '200px' }}
            />
          </div>
          {(searchTerm || dateFilter) && (
            <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setDateFilter(''); }}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Purchased From</th>
                <th>Category</th>
                <th>Total Wt (kg)</th>
                <th>Total Amt (₹)</th>
                <th>Payment</th>
                <th>Pending (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map(bill => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{bill.billNumber}</td>
                    <td>{bill.date.split(',')[0]}</td>
                    <td>{bill.purchasedFrom}</td>
                    <td>
                      {bill.items && bill.items.length > 0 
                        ? (bill.items.length === 1 ? bill.items[0].category : 'Multiple Items') 
                        : (bill.category || 'N/A')}
                    </td>
                    <td>
                      {bill.items && bill.items.length > 0 
                        ? bill.items.reduce((sum, item) => sum + item.weight, 0)
                        : (bill.weight || 0)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{bill.amount.toLocaleString()}</td>
                    <td>{bill.paymentMethod || 'N/A'}</td>
                    <td style={{ color: bill.pendingAmount > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 500 }}>
                      {bill.pendingAmount.toLocaleString()}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => navigate(`/dashboard/print/${bill.id}`)}>
                        <Printer size={16} /> Print
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Records;
