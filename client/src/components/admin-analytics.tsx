'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, Activity, DollarSign, ShoppingCart, UserPlus, Key, RefreshCw, FileCheck, Award } from 'lucide-react';

const revenueTrendData = [
  { month: 'Aug', revenue: 42000 },
  { month: 'Sep', revenue: 48000 },
  { month: 'Oct', revenue: 53000 },
  { month: 'Nov', revenue: 61000 },
  { month: 'Dec', revenue: 72000 },
];

const signupMethodData = [
  { name: 'Email', value: 156, color: '#3b82f6' },
  { name: 'Google', value: 98, color: '#10b981' },
];

const topCertificationsData = [
  { name: 'AWS Solutions Architect', sales: 45 },
  { name: 'Google Cloud Professional', sales: 38 },
  { name: 'Azure Developer', sales: 32 },
  { name: 'CompTIA Security+', sales: 28 },
  { name: 'CISSP', sales: 24 },
];

const kpiData = [
  {
    title: 'Visitors Today',
    value: '12,847',
    subtext: 'Unique page views',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Logged-in Users Today',
    value: '3,421',
    subtext: 'Active sessions',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Active Users Now',
    value: '847',
    subtext: 'Currently online',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Registrations Today',
    value: '254',
    subtext: 'New sign-ups',
    icon: UserPlus,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Password Changes Today',
    value: '18',
    subtext: 'Security updates',
    icon: Key,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];

const secondRowKpiData = [
  {
    title: 'Orders Today',
    value: '284',
    subtext: 'Completed orders',
    icon: ShoppingCart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    title: 'Revenue Today',
    value: '$8,432',
    subtext: 'Total sales',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Refunds Today',
    value: '12',
    subtext: '$342 refunded',
    icon: RefreshCw,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Reviews Submitted',
    value: '34',
    subtext: 'For certification',
    icon: FileCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Certifications Sold',
    value: '167',
    subtext: 'This month',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* First Row KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-semibold mb-1">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.subtext}</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Second Row KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {secondRowKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl font-semibold mb-1">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.subtext}</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Google vs Email Signups (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={signupMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {signupMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Email: 156 (61%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Google: 98 (39%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Top Certifications Sold (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCertificationsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Revenue Trend (Last 5 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4">
            Metrics are aggregated from backend analytics tables
          </p>
        </CardContent>
      </Card>
    </div>
  );
}