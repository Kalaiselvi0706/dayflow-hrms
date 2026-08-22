import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { Payroll } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { NotificationToast } from '../components/common/NotificationToast';

export const PayrollManagementScreen: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPayrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrolls();
      setPayrolls(data);
    } catch (err) {
      setError('Failed to fetch corporate payroll ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handlePayDisbursement = async (id: string) => {
    try {
      const updated = await payrollService.updatePayrollStatus(id, 'Paid');
      if (updated) {
        setPayrolls((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setToastMessage(`Disbursed payment net pay for ${updated.employeeName} successfully!`);
      }
    } catch (err) {
      setToastMessage('Failed to disburse payment.');
    }
  };

  const handleHoldPayment = async (id: string) => {
    try {
      const updated = await payrollService.updatePayrollStatus(id, 'On Hold');
      if (updated) {
        setPayrolls((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setToastMessage(`Placed payment hold for ${updated.employeeName}.`);
      }
    } catch (err) {
      setToastMessage('Failed to pause payment.');
    }
  };

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
        <ErrorState message={error} onRetry={fetchPayrolls} />
      </div>
    );
  }

  if (!payrolls.length) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <EmptyState
          icon="payments"
          title="No payroll entries yet"
          description="Create employee payroll cycles or sync with bank ledger integrations."
        />
      </div>
    );
  }

  const totalDisbursed = payrolls
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.netPay, 0);

  const pendingPayments = payrolls.filter((p) => p.status !== 'Paid').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <span className="text-xs font-semibold uppercase text-[#908fa0]">Total Disbursed (MTD)</span>
          <div className="text-2xl font-bold text-white font-mono">${totalDisbursed.toLocaleString('en-US')}</div>
          <p className="text-[11px] text-emerald-400">All banks reported success</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <span className="text-xs font-semibold uppercase text-[#908fa0]">Pending Approvals</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{pendingPayments} Entries</div>
          <p className="text-[11px] text-[#908fa0]">Awaiting batch release</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <span className="text-xs font-semibold uppercase text-[#908fa0]">Bank API Gateway</span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Okta Bank API Secured
          </div>
          <p className="text-[11px] text-[#908fa0]">Transfer delay: ~2 mins</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Staff Payroll Releases</h3>
          <span className="text-xs text-[#908fa0]">Review bonuses, overtime adjustments & disburse</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#464554]/30 text-xs font-semibold text-[#908fa0] uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Base Rate</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#e2e2eb] divide-y divide-[#464554]/15">
              {payrolls.map((stub) => (
                <tr key={stub.id} className="hover:bg-[#111319]/20 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-bold text-white">{stub.employeeName}</div>
                      <div className="text-[10px] text-[#908fa0]">{stub.empCode}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{stub.department}</td>
                  <td className="py-4 px-4 font-mono">${stub.baseSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400">+${stub.allowances}</td>
                  <td className="py-4 px-4 font-mono text-rose-400">-${stub.deductions}</td>
                  <td className="py-4 px-4 font-bold font-mono text-white">${stub.netPay.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={stub.status} />
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    {stub.status !== 'Paid' ? (
                      <>
                        <Button
                          variant="primary"
                          className="py-1.5 px-3"
                          onClick={() => handlePayDisbursement(stub.id)}
                        >
                          Disburse
                        </Button>
                        <Button
                          variant="danger"
                          className="py-1.5 px-3"
                          onClick={() => handleHoldPayment(stub.id)}
                        >
                          Hold
                        </Button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#908fa0] font-medium italic">
                        Settled ({stub.paymentDate})
                      </span>
                    )}
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
