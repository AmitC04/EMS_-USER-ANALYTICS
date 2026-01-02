'use client';

import { Card, CardContent } from './ui/card';
import { 
  Users, 
  UserCheck, 
  Activity, 
  DollarSign, 
  ShoppingCart, 
  RefreshCw,
  Shield,
  UserCog,
  Clock
} from 'lucide-react';

const kpiWidgets = [
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
    title: 'Revenue Today',
    value: '$8,432',
    subtext: 'Total sales',
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Orders Today',
    value: '284',
    subtext: 'Completed orders',
    icon: ShoppingCart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    title: 'Refunds Today',
    value: '12',
    subtext: '$342 refunded',
    icon: RefreshCw,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

const recentActivity = [
  { action: 'New user registration', user: 'john.doe@example.com', time: '2 minutes ago' },
  { action: 'Order #1234 completed', user: 'jane.smith@example.com', time: '5 minutes ago' },
  { action: 'Certification review submitted', user: 'admin@example.com', time: '12 minutes ago' },
  { action: 'Password reset requested', user: 'user@example.com', time: '18 minutes ago' },
  { action: 'New certification created', user: 'admin@example.com', time: '25 minutes ago' },
];

const profileUpdates = [
  { user: 'sarah.johnson@example.com', field: 'Email address', time: '15 minutes ago' },
  { user: 'mike.chen@example.com', field: 'Phone number', time: '32 minutes ago' },
  { user: 'emily.davis@example.com', field: 'Billing address', time: '1 hour ago' },
  { user: 'david.wilson@example.com', field: 'Profile picture', time: '2 hours ago' },
  { user: 'lisa.brown@example.com', field: 'Notification settings', time: '3 hours ago' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Widgets */}
      <div className="grid grid-cols-3 gap-6">
        {kpiWidgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{widget.title}</p>
                    <p className="text-3xl font-semibold mb-1">{widget.value}</p>
                    <p className="text-xs text-gray-500">{widget.subtext}</p>
                  </div>
                  <div className={`${widget.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${widget.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security & Profile Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Password Changes */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Password Changes Today</h3>
                <p className="text-3xl font-semibold">18</p>
                <p className="text-xs text-gray-500 mt-1">Security updates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Updates */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-cyan-50 p-3 rounded-lg">
                <UserCog className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Profile Updates Today</h3>
                <p className="text-3xl font-semibold">47</p>
                <p className="text-xs text-gray-500 mt-1">User data changes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Sensitive Change */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Last Sensitive Change</h3>
                <p className="text-lg font-semibold">15 minutes ago</p>
                <p className="text-xs text-gray-500 mt-1">Email update by sarah.j...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Profile Updates */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Who Updated Profile Data */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Profile Updates</h3>
            <div className="space-y-4">
              {profileUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{update.user}</p>
                    <p className="text-xs text-gray-500">Updated: {update.field}</p>
                  </div>
                  <p className="text-xs text-gray-400">{update.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}