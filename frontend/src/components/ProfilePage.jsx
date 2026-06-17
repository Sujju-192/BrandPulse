import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  Users as UsersIcon,
  DollarSign,
  Calendar,
  Award,
  Star,
  FileText,
  MessageSquare,
  Globe,
  Download,
  Edit,
  Eye,
  CheckCircle,
  PieChart
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    campaignAlerts: true,
    weeklyReports: true,
    darkMode: true
  });

  // User data
  const userData = {
    name: 'Alex Chen',
    email: 'alex@brandpulse.ai',
    role: 'Marketing Director',
    company: 'TechFlow Inc.',
    joinDate: '2023-08-15',
    subscription: 'Pro Plan',
    nextBilling: '2024-02-15',
    usage: {
      ideasCreated: 24,
      campaignsActive: 8,
      campaignsCompleted: 12,
      aiGenerations: 156,
      influencersContacted: 45
    },
    stats: {
      successRate: 92,
      avgEngagement: 4.8,
      roi: 340,
      timeSaved: 120
    }
  };

  // Campaign Performance Data
  const campaignData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Campaign Performance',
        data: [65, 78, 90, 81, 86, 92, 88, 94, 89, 95, 98, 99],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Platform Usage Data
  const platformData = {
    labels: ['Instagram', 'LinkedIn', 'YouTube', 'Twitter/X', 'TikTok', 'Facebook'],
    datasets: [
      {
        label: 'Platform Usage',
        data: [35, 25, 20, 10, 5, 5],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ]
      }
    ]
  };

  // Goal Distribution Data
  const goalsData = {
    labels: ['Awareness', 'Leads', 'Sales', 'Engagement', 'Traffic'],
    datasets: [
      {
        label: 'Goal Distribution',
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(147, 51, 234, 0.6)',
          'rgba(6, 182, 212, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Recent Activity
  const recentActivity = [
    { action: 'Created new campaign "Winter Launch"', time: '2 hours ago', icon: <FileText className="w-4 h-4" /> },
    { action: 'Generated AI content for TechFlow', time: 'Yesterday', icon: <MessageSquare className="w-4 h-4" /> },
    { action: 'Contacted 5 influencers', time: '2 days ago', icon: <UsersIcon className="w-4 h-4" /> },
    { action: 'Upgraded to Pro Plan', time: '1 week ago', icon: <Award className="w-4 h-4" /> },
    { action: 'Completed campaign "Q4 Push"', time: '2 weeks ago', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  // AI Usage History
  const aiUsageHistory = [
    { date: 'Today', generations: 12, tokens: 2400 },
    { date: 'Yesterday', generations: 8, tokens: 1600 },
    { date: 'This Week', generations: 45, tokens: 9000 },
    { date: 'This Month', generations: 156, tokens: 31200 }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-gray-400">{userData.role} • {userData.company}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl font-medium transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-800">
          {['overview', 'analytics', 'settings', 'billing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.usage.ideasCreated}</div>
                  <div className="text-sm text-gray-400">Ideas Created</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.usage.campaignsActive}</div>
                  <div className="text-sm text-gray-400">Active Campaigns</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.usage.campaignsCompleted}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600/20 to-rose-600/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.usage.aiGenerations}</div>
                  <div className="text-sm text-gray-400">AI Generations</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600/20 to-amber-600/20 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData.usage.influencersContacted}</div>
                  <div className="text-sm text-gray-400">Influencers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Campaign Performance Chart */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Campaign Performance</h3>
                  <p className="text-sm text-gray-400">Success rate over time</p>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% this month
                </div>
              </div>
              <div className="h-64">
                <Line data={campaignData} options={chartOptions} />
              </div>
            </div>

            {/* Platform Usage Chart */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Platform Distribution</h3>
                  <p className="text-sm text-gray-400">Where your campaigns run</p>
                </div>
                <div className="text-sm text-gray-400">
                  Total: 6 platforms
                </div>
              </div>
              <div className="h-64">
                <Pie data={platformData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* User Info & Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-6">Account Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Subscription</span>
                  <span className="font-medium text-purple-400">{userData.subscription}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-medium">{userData.joinDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Next Billing</span>
                  <span className="font-medium">{userData.nextBilling}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Account Status</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">Active</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <button className="text-sm text-gray-400 hover:text-white">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-800/30 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Performance Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl font-bold mb-2">{userData.stats.successRate}%</div>
              <div className="text-sm text-gray-400 mb-3">Campaign Success Rate</div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${userData.stats.successRate}%` }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl font-bold mb-2">{userData.stats.avgEngagement}%</div>
              <div className="text-sm text-gray-400 mb-3">Avg. Engagement</div>
              <div className="flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.3% from last month
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl font-bold mb-2">{userData.stats.roi}%</div>
              <div className="text-sm text-gray-400 mb-3">Average ROI</div>
              <div className="flex items-center text-green-400 text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                High return rate
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-6 border border-gray-800">
              <div className="text-3xl font-bold mb-2">{userData.stats.timeSaved} hrs</div>
              <div className="text-sm text-gray-400 mb-3">Time Saved with AI</div>
              <div className="flex items-center text-purple-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                Equivalent to 15 days
              </div>
            </div>
          </div>

          {/* Goal Distribution Chart */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Campaign Goals Distribution</h3>
                <p className="text-sm text-gray-400">Breakdown of campaign objectives</p>
              </div>
              <div className="text-sm text-gray-400">
                Total: 5 goal types
              </div>
            </div>
            <div className="h-64">
              <Bar data={goalsData} options={chartOptions} />
            </div>
          </div>

          {/* AI Usage Stats */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-6">AI Usage History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 text-gray-400 font-medium">Period</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Generations</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Tokens Used</th>
                    <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aiUsageHistory.map((usage, index) => (
                    <tr key={index} className="border-b border-gray-800/50 last:border-0">
                      <td className="py-3 font-medium">{usage.date}</td>
                      <td className="py-3">{usage.generations}</td>
                      <td className="py-3">{usage.tokens.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                          Normal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Notification Settings */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold">Notification Settings</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(userSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-sm text-gray-400">Receive {key} notifications</div>
                    </div>
                    <button
                      onClick={() => setUserSettings(prev => ({ ...prev, [key]: !value }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        value ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold">Account Security</h3>
              </div>
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Add extra security to your account</div>
                  </div>
                  <span className="text-gray-400">Not enabled</span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-gray-400">Update your account password</div>
                  </div>
                  <span className="text-purple-400">Update</span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center justify-between transition-colors">
                  <div>
                    <div className="font-medium">Connected Devices</div>
                    <div className="text-sm text-gray-400">Manage active sessions</div>
                  </div>
                  <span className="text-gray-400">3 active</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Plan */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{userData.subscription}</h3>
                  <p className="text-gray-400">Your current subscription plan</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 rounded-full">Active</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Monthly Price</span>
                  <span className="font-bold text-lg">$49/month</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Next Billing Date</span>
                  <span className="font-medium">{userData.nextBilling}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">AI Generations</span>
                  <span className="font-medium">Unlimited</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400">Storage</span>
                  <span className="font-medium">100GB</span>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition-all">
                Upgrade to Enterprise
              </button>
            </div>

            {/* Billing History */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold">Billing History</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { date: 'Jan 15, 2024', amount: '$49.00', status: 'Paid' },
                  { date: 'Dec 15, 2023', amount: '$49.00', status: 'Paid' },
                  { date: 'Nov 15, 2023', amount: '$49.00', status: 'Paid' },
                  { date: 'Oct 15, 2023', amount: '$49.00', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl">
                    <div>
                      <div className="font-medium">{invoice.date}</div>
                      <div className="text-sm text-gray-400">Monthly Subscription</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{invoice.amount}</span>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                        {invoice.status}
                      </span>
                      <button className="text-gray-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}