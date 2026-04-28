import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBilling } from '../context/BillingContext';
import { Anchor, ArrowLeft, Printer } from 'lucide-react';

const PrintView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { bills } = useBilling();
  const navigate = useNavigate();

  const bill = bills.find(b => b.id === id);

  if (!bill) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Bill not found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard/records')}>Back to Records</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const totalWeight = bill.items && bill.items.length > 0 
    ? bill.items.reduce((sum, item) => sum + item.weight, 0)
    : (bill.weight || 0);

  return (
    <div>
      <div className="flex-between mb-4 no-print">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/records')}>
          <ArrowLeft size={18} /> Back
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white' }}>
        <div className="card-body" style={{ padding: '3rem' }}>
          
          {/* Header */}
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="flex-row">
              <Anchor size={40} color="var(--primary)" />
              <div>
                <h1 style={{ color: 'var(--primary-dark)', margin: 0 }}>Sagar Fishers</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Premium Prawns & Seafood</p>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                  Jathapeth, Akola, Maharashtra - 444001<br/>
                  Mob: 9823677883
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 style={{ color: 'var(--text-secondary)', margin: 0 }}>INVOICE</h2>
              <p style={{ margin: 0, fontWeight: 500 }}>{bill.billNumber}</p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{bill.date}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="mb-4">
            <div>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Purchased From:</p>
              <h3 style={{ margin: '0.25rem 0' }}>{bill.purchasedFrom}</h3>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--primary-light)' }}>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Description / Category</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Weight (kg)</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items && bill.items.length > 0 ? (
                bill.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>{item.category}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{item.weight}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{item.rate.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>{item.amount.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>{bill.category || 'N/A'}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{bill.weight || 0}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{bill.rate ? bill.rate.toLocaleString() : '0'}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>{bill.amount.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer Info */}
          <div className="grid-2">
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Export Details:</p>
              <p style={{ fontWeight: 500, margin: '0.25rem 0' }}>
                {bill.transportType ? `${bill.transportType} - ${bill.transportNumber}` : 'N/A'}
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Payment Method:</p>
              <p style={{ fontWeight: 500 }}>
                {bill.paymentMethod || 'N/A'}
                {bill.paymentMethod === 'Cheque' && bill.paymentReference && ` (Chq No: ${bill.paymentReference})`}
                {bill.paymentMethod === 'Online' && bill.paymentReference && ` (Txn ID: ${bill.paymentReference})`}
              </p>
            </div>
            
            <div>
              <div className="flex-between mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>Total Weight:</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{totalWeight.toLocaleString()} kg</span>
              </div>
              <div className="flex-between mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>₹{bill.amount.toLocaleString()}</span>
              </div>
              <div className="flex-between mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>Amount Deposited:</span>
                <span>₹{bill.amountDeposited.toLocaleString()}</span>
              </div>
              <div className="flex-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600 }}>Pending Balance:</span>
                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: bill.pendingAmount > 0 ? 'var(--error)' : 'var(--success)' }}>
                  ₹{bill.pendingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p>Thank you for your business with Sagar Fishers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
