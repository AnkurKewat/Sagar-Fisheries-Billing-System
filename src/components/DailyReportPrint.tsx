import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBilling } from '../context/BillingContext';
import { Anchor, ArrowLeft, Printer } from 'lucide-react';
import { getBillDateKey, formatBillDate } from './Reports';

const DailyReportPrint: React.FC = () => {
  const { date } = useParams<{ date: string }>(); // Date parameter is YYYY-MM-DD
  const { bills } = useBilling();
  const navigate = useNavigate();

  // Filter bills generated on the specific date key
  const dailyBills = bills.filter(bill => getBillDateKey(bill.date) === date);

  if (dailyBills.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No bills found for date {date ? formatBillDate(date) : ''}</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard/reports')}>
          Back to Reports
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Compile overall statistics for this date
  const totalBills = dailyBills.length;
  
  const totalWeight = dailyBills.reduce((sum, bill) => {
    const w = bill.items && bill.items.length > 0
      ? bill.items.reduce((itemSum, item) => itemSum + item.weight, 0)
      : (bill.weight || 0);
    return sum + w;
  }, 0);

  const totalAmount = dailyBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalDeposited = dailyBills.reduce((sum, bill) => sum + bill.amountDeposited, 0);
  const totalPending = dailyBills.reduce((sum, bill) => sum + bill.pendingAmount, 0);

  // Compile Category Breakdown
  const categorySummary: { [key: string]: { weight: number; amount: number } } = {};
  dailyBills.forEach(bill => {
    if (bill.items && bill.items.length > 0) {
      bill.items.forEach(item => {
        if (!categorySummary[item.category]) {
          categorySummary[item.category] = { weight: 0, amount: 0 };
        }
        categorySummary[item.category].weight += item.weight;
        categorySummary[item.category].amount += item.amount;
      });
    } else {
      const cat = bill.category || 'N/A';
      if (!categorySummary[cat]) {
        categorySummary[cat] = { weight: 0, amount: 0 };
      }
      categorySummary[cat].weight += bill.weight || 0;
      categorySummary[cat].amount += bill.amount;
    }
  });

  // Compile Payment Methods Summary
  const paymentSummary = { Cash: 0, Online: 0, Cheque: 0, Unspecified: 0 };
  dailyBills.forEach(bill => {
    const method = bill.paymentMethod;
    if (method === 'Cash') paymentSummary.Cash += bill.amountDeposited;
    else if (method === 'Online') paymentSummary.Online += bill.amountDeposited;
    else if (method === 'Cheque') paymentSummary.Cheque += bill.amountDeposited;
    else paymentSummary.Unspecified += bill.amountDeposited;
  });

  return (
    <div>
      {/* Print Controls (hidden on print) */}
      <div className="flex-between mb-4 no-print">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/reports')}>
          <ArrowLeft size={18} /> Back to Reports
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* Main Printable Document Card */}
      <div className="card" style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white' }}>
        <div className="card-body" style={{ padding: '3rem' }}>
          
          {/* Company & Report Header */}
          <div className="flex-between" style={{ borderBottom: '2px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="flex-row">
              <Anchor size={40} color="var(--primary)" />
              <div>
                <h1 style={{ color: 'var(--primary-dark)', margin: 0 }}>Sagar Fishers</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>Premium Prawns & Seafood</p>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                  Jathapeth, Akola, Maharashtra - 444001<br/>
                  Mob: 9823677883
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 style={{ color: 'var(--text-secondary)', margin: 0 }}>DAILY SALES REPORT</h2>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--primary-dark)' }}>
                {date ? formatBillDate(date) : ''}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Generated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Core Daily KPI Metrics Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Invoices</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>{totalBills}</h3>
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Weight</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>
                {totalWeight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
              </h3>
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: '#e0f2fe' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-dark)', fontWeight: 600 }}>Total Revenue</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--primary-dark)' }}>₹{totalAmount.toLocaleString()}</h3>
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: '#dcfce7' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 600 }}>Total Collected</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--success)' }}>₹{totalDeposited.toLocaleString()}</h3>
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: '#fee2e2' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--error)', fontWeight: 600 }}>Total Pending</span>
              <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--error)' }}>₹{totalPending.toLocaleString()}</h3>
            </div>
          </div>

          {/* Breakdown Section: Category & Payment summaries */}
          <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 2.5fr', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* Category summary table */}
            <div>
              <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>
                🦐 Category-Wise Sales Summary
              </h4>
              <table style={{ width: '100%', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-light)' }}>
                    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>Category</th>
                    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontSize: '0.8rem' }}>Weight (kg)</th>
                    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontSize: '0.8rem' }}>Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categorySummary).map(([cat, data]) => (
                    <tr key={cat}>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>{cat}</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                        {data.weight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>
                        {data.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div>
              <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>
                💰 Collection by Payment Mode
              </h4>
              <table style={{ width: '100%', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-light)' }}>
                    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>Payment Mode</th>
                    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontSize: '0.8rem' }}>Deposited (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>💵 Cash</td>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>
                      ₹{paymentSummary.Cash.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>📱 Online (UPI/Txn)</td>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>
                      ₹{paymentSummary.Online.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>🏦 Cheque</td>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>
                      ₹{paymentSummary.Cheque.toLocaleString()}
                    </td>
                  </tr>
                  {paymentSummary.Unspecified > 0 && (
                    <tr>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Unspecified</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>
                        ₹{paymentSummary.Unspecified.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: '#f8fafc', fontWeight: 600 }}>
                    <td style={{ padding: '0.5rem 0.75rem' }}>Total Deposited</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--success)' }}>
                      ₹{totalDeposited.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice details list */}
          <div>
            <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>
              📑 Detailed Invoices (All Invoices Summary)
            </h4>
            <table style={{ width: '100%', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--primary-light)' }}>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bill Number</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Purchased From</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Details / Items</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Weight (kg)</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Total (₹)</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Deposited (₹)</th>
                  <th style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Pending (₹)</th>
                </tr>
              </thead>
              <tbody>
                {dailyBills.map(bill => {
                  const billWeight = bill.items && bill.items.length > 0
                    ? bill.items.reduce((s, i) => s + i.weight, 0)
                    : (bill.weight || 0);
                    
                  let itemSummaryStr = '';
                  if (bill.items && bill.items.length > 0) {
                    itemSummaryStr = bill.items.map(i => `${i.category} (${i.weight}kg)`).join(', ');
                  } else {
                    itemSummaryStr = bill.category || 'N/A';
                  }

                  return (
                    <tr key={bill.id}>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--primary)' }}>
                        {bill.billNumber}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>{bill.purchasedFrom}</td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={itemSummaryStr}>
                        {itemSummaryStr}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                        {billWeight.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 600 }}>
                        {bill.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                        {bill.amountDeposited.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 600, color: bill.pendingAmount > 0 ? 'var(--error)' : 'var(--success)' }}>
                        {bill.pendingAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p>Sagar Fishers – End of Daily Sales & Billing Report for {date ? formatBillDate(date) : ''}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyReportPrint;
