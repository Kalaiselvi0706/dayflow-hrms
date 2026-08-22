import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService, ExecutiveMetrics } from '../services/analyticsService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const AnalyticsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'ytd'>('30d');
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getExecutiveMetrics();
      setMetrics(data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const chartData = metrics?.timelineData || [
    { day: 'Mon', actual: 96, expected: 95, label: 'Oct 2' },
    { day: 'Tue', actual: 98, expected: 95, label: 'Oct 3' },
    { day: 'Wed', actual: 94, expected: 95, label: 'Oct 4' },
    { day: 'Thu', actual: 99, expected: 95, label: 'Oct 5' },
    { day: 'Fri', actual: 92, expected: 95, label: 'Oct 6' },
  ];

  if (loading || !metrics) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="chart" count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4cd7f6]">
              Executive Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Live Data Sync
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Workforce Health & Predictive Analytics
          </h2>
          <p className="text-sm text-[#908fa0] max-w-xl">
            Statistical regression models analyzing attendance trends, retention probability, and department load distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-[#282a30] text-xs font-semibold text-[#c0c1ff] border border-[#464554]/50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#8083ff]"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Q3 2024</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button
            onClick={() => navigate('/admin/ai')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold shadow-md shadow-[#8083ff]/30 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            Ask AI Copilot
          </button>
        </div>
      </div>

      {/* 4 Bento Executive KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-semibold uppercase">Retention Rate</span>
            <span className="material-symbols-outlined text-emerald-400">trending_up</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.retentionRate}%</div>
          <p className="text-xs text-emerald-400 font-medium">+1.4% vs industry baseline</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-semibold uppercase">Attendance Efficiency</span>
            <span className="material-symbols-outlined text-[#4cd7f6]">speed</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.attendanceEfficiency}%</div>
          <p className="text-xs text-[#908fa0]">Nominal threshold: 92%</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-semibold uppercase">Burnout Risk Index</span>
            <span className="material-symbols-outlined text-cyan-300">psychology</span>
          </div>
          <div className="text-3xl font-bold text-cyan-300">{metrics.burnoutRiskIndex}%</div>
          <p className="text-xs text-emerald-400 font-medium">Low risk category</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-semibold uppercase">Overtime Logged</span>
            <span className="material-symbols-outlined text-[#d0bcff]">more_time</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.overtimeLogged} hrs</div>
          <p className="text-xs text-[#908fa0]">Down 18% from last month</p>
        </div>
      </div>

      {/* Attendance Trends vs Baseline Spline Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Attendance Velocity vs Baseline</h3>
            <p className="text-xs text-[#908fa0]">10-Day rolling window with expected baseline model</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-3 h-1 bg-[#8083ff] rounded-full"></span>
              Actual Presence (%)
            </span>
            <span className="flex items-center gap-1.5 text-[#908fa0]">
              <span className="w-3 h-1 bg-[#464554] rounded-full"></span>
              Expected Baseline (95%)
            </span>
          </div>
        </div>

        {/* SVG Interactive Spline Chart */}
        <div className="w-full h-64 sm:h-72 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#282a30" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#282a30" strokeDasharray="4 4" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#282a30" strokeDasharray="4 4" />

            {/* Baseline 95% line */}
            <line x1="0" y1="100" x2="800" y2="100" stroke="#464554" strokeWidth="2" strokeDasharray="6 6" />

            {/* Area gradient under actual curve */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8083ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8083ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Polygon Area */}
            <polygon
              points="0,240 0,90 88,60 177,130 266,40 355,160 444,70 533,50 622,110 711,30 800,120 800,240"
              fill="url(#chartGrad)"
            />

            {/* Spline Path */}
            <path
              d="M 0,90 Q 44,75 88,60 T 177,130 T 266,40 T 355,160 T 444,70 T 533,50 T 622,110 T 711,30 T 800,120"
              fill="none"
              stroke="#8083ff"
              strokeWidth="3"
            />

            {/* Points */}
            {[
              { x: 0, y: 90, val: 96 },
              { x: 88, y: 60, val: 98 },
              { x: 177, y: 130, val: 94 },
              { x: 266, y: 40, val: 99 },
              { x: 355, y: 160, val: 92 },
              { x: 444, y: 70, val: 97 },
              { x: 533, y: 50, val: 98 },
              { x: 622, y: 110, val: 95 },
              { x: 711, y: 30, val: 99 },
              { x: 800, y: 120, val: 94 },
            ].map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={activeChartPoint === i ? 7 : 4}
                fill="#ffffff"
                stroke="#8083ff"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:scale-150"
                onMouseEnter={() => setActiveChartPoint(i)}
                onMouseLeave={() => setActiveChartPoint(null)}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {activeChartPoint !== null && (
            <div
              className="absolute -top-4 bg-[#111319] border border-[#8083ff] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none"
              style={{ left: `${(activeChartPoint / (chartData.length - 1)) * 90}%` }}
            >
              {chartData[activeChartPoint].label}: {chartData[activeChartPoint].actual}% Presence
            </div>
          )}
        </div>
      </div>

      {/* Secondary Row: Department Radar + Burnout Action Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar / Department Balance */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Department Balance Index</h3>
            <span className="text-xs text-[#908fa0]">Multi-axis evaluation</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { dept: 'Engineering', score: '94%', load: 'High (Optimal)', color: 'bg-[#8083ff]' },
              { dept: 'Design', score: '98%', load: 'Balanced', color: 'bg-[#4cd7f6]' },
              { dept: 'Marketing', score: '91%', load: 'Moderate', color: 'bg-[#a078ff]' },
              { dept: 'Sales', score: '92%', load: 'Peak Velocity', color: 'bg-emerald-400' },
              { dept: 'Product', score: '96%', load: 'Balanced', color: 'bg-cyan-300' },
            ].map((d, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/50 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.color}`}></span>
                  <span className="font-semibold text-white">{d.dept}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#908fa0]">{d.load}</span>
                  <span className="font-bold text-[#c0c1ff]">{d.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Recommendations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-[#d0bcff]">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <h3 className="text-base font-bold text-white">Nexora AI Strategic Actions</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#111319]/60 border border-[#8083ff]/30 space-y-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                Recommendation 1
              </span>
              <h4 className="text-xs font-bold text-white">Engineering Sprint Health Nominal</h4>
              <p className="text-xs text-[#908fa0]">
                Zero burnout risk detected. Retention prediction remains at 99.2% through Q4.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#111319]/60 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                Recommendation 2
              </span>
              <h4 className="text-xs font-bold text-white">Austin Office Traffic Grace Buffer</h4>
              <p className="text-xs text-[#908fa0]">
                Auto-adjust core hours to 9:15 AM on Mondays to eliminate false late marks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
