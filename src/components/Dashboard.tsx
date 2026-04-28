import React from 'react';
import { useBilling } from '../context/BillingContext';
import { IndianRupee, FileText, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { bills } = useBilling();

  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPending = bills.reduce((sum, bill) => sum + bill.pendingAmount, 0);

  return (
    <div>
      <h1 className="mb-4">Dashboard Overview</h1>
      
      <div className="grid-3 mb-4">
        <div className="card">
          <div className="card-body flex-row">
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '50%' }}>
              <FileText color="var(--primary)" size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Bills</p>
              <h2 style={{ fontSize: '1.75rem' }}>{totalBills}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex-row">
            <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
              <IndianRupee color="var(--success)" size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Revenue</p>
              <h2 style={{ fontSize: '1.75rem' }}>₹{totalAmount.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex-row">
            <div style={{ backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '50%' }}>
              <IndianRupee color="var(--error)" size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Pending Amount</p>
              <h2 style={{ fontSize: '1.75rem' }}>₹{totalPending.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-body grid-2">
          <Link to="/dashboard/new-bill" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '2rem', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }} className="hover-bg-primary-light">
              <FileText size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--primary)' }}>Create New Bill</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Generate a new prawn invoice</p>
            </div>
          </Link>
          <Link to="/dashboard/records" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '2rem', border: '1px dashed var(--secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }}>
              <Anchor size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--secondary)' }}>View Records</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Search and print past invoices</p>
            </div>
          </Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-primary-light:hover { background-color: var(--primary-light); }
      `}} />
    </div>
  );
};

export default Dashboard;
