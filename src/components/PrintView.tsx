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

  // Format date as DD/MM/YYYY
  const formatDisplayDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const totalWeight = bill.items && bill.items.length > 0
    ? bill.items.reduce((sum, item) => sum + item.weight, 0)
    : (bill.weight || 0);

  // Explicit 4-sided borders so column lines always render
  const cellBorder = '1px solid #bae6fd';
  const tdStyle: React.CSSProperties = {
    padding: '0.35rem 0.6rem',
    border: cellBorder,
    fontSize: '0.875rem',
  };

  const thStyle: React.CSSProperties = {
    padding: '0.4rem 0.6rem',
    border: cellBorder,
    fontSize: '0.8rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)',
  };

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

      <div className="card print-invoice" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white' }}>
        <div className="card-body print-invoice-body" style={{ padding: '1.5rem' }}>

          <div className="flex-between" style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="flex-row" style={{ gap: '0.6rem' }}>
              <Anchor size={32} color="var(--primary)" />
              <div>
                <h1 style={{ color: 'var(--primary-dark)', margin: 0, fontSize: '1.3rem' }}>Sagar Fisheries</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>Premium Prawns &amp; Seafood</p>
              </div>
            </div>
            <div className="text-right">
              <h2 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>INVOICE</h2>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{bill.billNumber}</p>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{formatDisplayDate(bill.date)}</p>
            </div>
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.75rem' }}>Purchased From:</p>
            <h3 style={{ margin: '0.1rem 0 0 0', fontSize: '1rem' }}>{bill.purchasedFrom}</h3>
          </div>

          <table style={{ width: '100%', marginBottom: '0.75rem', borderCollapse: 'collapse', border: cellBorder }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: 'center', width: '60px' }}>No.</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Description / Category</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Weight (kg)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Rate (Rs/kg)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items && bill.items.length > 0 ? (
                bill.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ ...tdStyle }}>{item.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{item.weight}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{item.rate.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>{item.amount.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>1</td>
                  <td style={{ ...tdStyle }}>{bill.category || 'N/A'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{bill.weight || 0}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{bill.rate ? bill.rate.toLocaleString() : '0'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>{bill.amount.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f0f9ff', fontWeight: 700 }}>
                <td style={{ ...tdStyle, textAlign: 'center', fontSize: '0.82rem' }} colSpan={2}>TOTAL</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{totalWeight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style={{ ...tdStyle }}></td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>Rs {bill.amount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1fr', gap: '1rem', alignItems: 'start', marginTop: '0.5rem' }}>

            <div style={{ fontSize: '0.82rem' }}>
              <p style={{ margin: '0 0 0.15rem 0', color: 'var(--text-secondary)' }}>Export Details:</p>
              <p style={{ fontWeight: 500, margin: '0 0 0.5rem 0' }}>
                {bill.transportType ? bill.transportType + ' - ' + bill.transportNumber : 'N/A'}
              </p>
              <p style={{ margin: '0 0 0.15rem 0', color: 'var(--text-secondary)' }}>Payment Method:</p>
              <p style={{ fontWeight: 500, margin: 0 }}>
                {bill.paymentMethod || 'N/A'}
                {bill.paymentMethod === 'Cheque' && bill.paymentReference && ' (Chq: ' + bill.paymentReference + ')'}
                {bill.paymentMethod === 'Online' && bill.paymentReference && ' (Txn: ' + bill.paymentReference + ')'}
              </p>
            </div>

            <div style={{ fontSize: '0.82rem', borderLeft: '1px solid var(--border)', paddingLeft: '0.75rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Weight:</span>
                <span style={{ fontWeight: 600 }}>{totalWeight.toLocaleString()} kg</span>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                <span style={{ fontWeight: 600 }}>Rs {bill.amount.toLocaleString()}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Deposited:</span>
                <span>Rs {bill.amountDeposited.toLocaleString()}</span>
              </div>
              <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Pending:</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: bill.pendingAmount > 0 ? 'var(--error)' : 'var(--success)' }}>
                  Rs {bill.pendingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.3rem 0', fontWeight: 500, fontSize: '0.78rem', color: 'var(--text-primary)' }}>For Sagar Fisheries</p>
              <div style={{
                width: '70px',
                height: '70px',
                border: '2px dashed var(--border)',
                borderRadius: '50%',
                marginBottom: '0.3rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.65rem',
                backgroundColor: 'var(--primary-light)',
              }}>
                Stamp
              </div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Authorized Signatory</p>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
            <p style={{ margin: 0 }}>Thank you for your business with Sagar Fisheries.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrintView;
