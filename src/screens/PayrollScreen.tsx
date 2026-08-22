import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { useAuth } from '../context/AuthContext';
import { Payroll } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';

export const PayrollScreen: React.FC = () => {
  const { currentEmployee } = useAuth();
  const [stubs, setStubs] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = async () => {
    if (!currentEmployee) return;
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrollByEmployee(currentEmployee.id);
      setStubs(data);
    } catch (err) {
      setError('Failed to fetch payroll stubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [currentEmployee]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="table" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={fetchPayroll} />
      </div>
    );
  }

  if (!stubs.length) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <EmptyState
          icon="payments"
          title="No payroll data available"
          description="Your monthly pay slips have not been processed by HR department yet."
        />
      </div>
    );
  }

  const latestStub = stubs[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Earnings Overview Card */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#464554]/25 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#908fa0]">Net Salary (Take-home)</span>
            <div className="text-3xl font-extrabold text-white font-mono">
              ${latestStub.netPay.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-400 font-medium">Disbursed on {latestStub.paymentDate || 'Processing'}</p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#464554]/25 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#908fa0]">Base Salary</span>
            <div className="text-2xl font-bold text-white font-mono">
              ${latestStub.baseSalary.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#908fa0]">Excluding allowances</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#908fa0]">Allowances & Bonuses</span>
            <div className="text-2xl font-bold text-white font-mono">
              +${latestStub.allowances.toLocaleString('en-US')}
            </div>
            <p className="text-xs text-[#908fa0]">Deductions: -${latestStub.deductions.toLocaleString('en-US')}</p>
          </div>
        </div>
      </div>

      {/* Pay Slips Ledger */}
      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Earnings History & Ledger</h3>
          <span className="text-xs text-[#908fa0]">Synced with corporate ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#464554]/30 text-xs font-semibold text-[#908fa0] uppercase tracking-wider">
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Base Rate</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#e2e2eb] divide-y divide-[#464554]/15">
              {stubs.map((stub) => (
                <tr key={stub.id} className="hover:bg-[#111319]/20 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{stub.month}</td>
                  <td className="py-4 px-4 font-mono">${stub.baseSalary.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400">+${stub.allowances.toLocaleString('en-US')}</td>
                  <td className="py-4 px-4 font-mono text-rose-400">-${stub.deductions.toLocaleString('en-US')}</td>
                  <td className="py-4 px-4 font-bold font-mono text-white">${stub.netPay.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={stub.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="secondary" icon="download" className="py-1.5 px-3">
                      PDF Paystub
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
