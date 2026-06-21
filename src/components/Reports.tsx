import React, { useState, useMemo } from 'react';
import { useBilling } from '../context/BillingContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, IndianRupee, FileText, Printer, ArrowRight } from 'lucide-react';

// Helper function to standardise date strings to YYYY-MM-DD
export const getBillDateKey = (dateStr: string): string => {
  if (!dateStr) return '';
  const datePart = dateStr.split(',')[0].trim(); // e.g. "21/06/2026" or "2026-06-21"
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }
  
  const d = new Date(datePart);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  // Custom manual regex parsing if Date constructor fails
  const parts = datePart.split(/[-/.]/);
  if (parts.length === 3) {
    let part0 = parseInt(parts[0], 10);
    let part1 = parseInt(parts[1], 10);
    let part2 = parseInt(parts[2], 10);
    
    // Check if part0 is YYYY
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    
    // Assume DD/MM/YYYY or MM/DD/YYYY. Let's resolve:
    let day = part0;
    let month = part1;
    let year = part2;
    if (year < 100) year += 2000;
    
    if (month > 12) {
      // Must be MM/DD/YYYY formatted
      day = part1;
      month = part0;
    }
    
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  
  return datePart;
};

// Helper function to format YYYY-MM-DD to "DD MMM YYYY"
export const formatBillDate = (dateKey: string): string => {
  const parts = dateKey.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (m >= 0 && m < 12) {
      return `${d} ${months[m]} ${y}`;
    }
  }
  return dateKey;
};

interface DailyGroup {
  dateKey: string;
  formattedDate: string;
  billCount: number;
  totalWeight: number;
  totalAmount: number;
  totalDeposited: number;
  totalPending: number;
}

const Reports: React.FC = () => {
  const { bills } = useBilling();
  const navigate = useNavigate();
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Group bills by standard date key YYYY-MM-DD
  const dailyGroups = useMemo(() => {
    const groups: { [key: string]: DailyGroup } = {};
    
    bills.forEach(bill => {
      const dateKey = getBillDateKey(bill.date);
      if (!dateKey) return;
      
      const billWeight = bill.items && bill.items.length > 0
        ? bill.items.reduce((sum, item) => sum + item.weight, 0)
        : (bill.weight || 0);
        
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateKey,
          formattedDate: formatBillDate(dateKey),
          billCount: 0,
          totalWeight: 0,
          totalAmount: 0,
          totalDeposited: 0,
          totalPending: 0
        };
      }
      
      groups[dateKey].billCount += 1;
      groups[dateKey].totalWeight += billWeight;
      groups[dateKey].totalAmount += bill.amount;
      groups[dateKey].totalDeposited += bill.amountDeposited;
      groups[dateKey].totalPending += bill.pendingAmount;
    });
    
    // Sort groups descending by date
    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [bills]);

  // Filter daily groups based on start and end dates
  const filteredGroups = useMemo(() => {
    return dailyGroups.filter(group => {
      if (startDate && group.dateKey < startDate) return false;
      if (endDate && group.dateKey > endDate) return false;
      return true;
    });
  }, [dailyGroups, startDate, endDate]);

  // Aggregate stats for the selected date range
  const summaryStats = useMemo(() => {
    return filteredGroups.reduce((acc, curr) => {
      acc.totalSales += curr.totalAmount;
      acc.totalWeight += curr.totalWeight;
      acc.totalBills += curr.billCount;
      acc.totalPending += curr.totalPending;
      return acc;
    }, {
      totalSales: 0,
      totalWeight: 0,
      totalBills: 0,
      totalPending: 0
    });
  }, [filteredGroups]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h1>Day to Day Sales Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Analyze daily business metrics and export daily summaries as PDF.</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card mb-4">
        <div className="card-body flex-row" style={{ alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              From Date
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ paddingLeft: '35px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', color: 'var(--text-secondary)' }}>
            <ArrowRight size={18} />
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              To Date
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ paddingLeft: '35px' }}
              />
            </div>
          </div>

          {(startDate || endDate) && (
            <button className="btn btn-secondary" onClick={clearFilters} style={{ height: '40px' }}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid-3 mb-4">
        <div className="card">
          <div className="card-body flex-row">
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '50%' }}>
              <FileText color="var(--primary)" size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Invoices</p>
              <h2 style={{ fontSize: '1.75rem' }}>{summaryStats.totalBills}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex-row">
            <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
              <IndianRupee color="var(--success)" size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Sales Revenue</p>
              <h2 style={{ fontSize: '1.75rem' }}>₹{summaryStats.totalSales.toLocaleString()}</h2>
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
              <h2 style={{ fontSize: '1.75rem' }}>₹{summaryStats.totalPending.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="card">
        <div className="card-header">
          <h3>📅 Day-to-Day Sales Records</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoices Generated</th>
                <th>Total Weight Sold (kg)</th>
                <th>Total Billing Amount (₹)</th>
                <th>Pending Balance (₹)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <tr key={group.dateKey}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{group.formattedDate}</td>
                    <td>{group.billCount}</td>
                    <td style={{ fontWeight: 500 }}>{group.totalWeight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{group.totalAmount.toLocaleString()}</td>
                    <td style={{ color: group.totalPending > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                      ₹{group.totalPending.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} 
                        onClick={() => navigate(`/dashboard/daily-report/${group.dateKey}`)}
                      >
                        <Printer size={14} /> Daily Report (PDF)
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                    No daily records found matching your selected date range.
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

export default Reports;
