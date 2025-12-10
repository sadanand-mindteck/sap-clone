import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';
import { formatCurrency } from '../../lib/utils.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Separator } from '../../components/ui/separator.jsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { Activity, DollarSign, Package, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-erp-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-erp-500 mt-1">{subtext}</p>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await apiClient.get('/dashboard/stats')).data
  });

  const { data: salesTrend } = useQuery({
    queryKey: ['sales-trend'],
    queryFn: async () => (await apiClient.get('/dashboard/sales-trend')).data
  });

  const { data: categoryData } = useQuery({
    queryKey: ['category-dist'],
    queryFn: async () => (await apiClient.get('/dashboard/category-dist')).data
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-erp-900">Dashboard</h2>
          <p className="text-xs text-erp-500">Overview of system performance and key metrics.</p>
        </div>
        <div className="flex items-center space-x-2">
           <Badge variant="outline" className="bg-white">Last updated: Just now</Badge>
        </div>
      </div>
      
      <Separator />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Inventory Value" 
              value={stats ? formatCurrency(stats.totalInventoryValue) : '...'}
              subtext="+2.1% from last month"
              icon={DollarSign}
            />
            <StatCard 
              title="Active Items" 
              value={stats?.activeItemCount}
              subtext="Products in catalog"
              icon={Package}
            />
            <StatCard 
              title="Pending Orders" 
              value={stats?.pendingOrders}
              subtext="Requires immediate attention"
              icon={Activity}
            />
            <StatCard 
              title="Low Stock Alerts" 
              value={stats?.lowStockCount}
              subtext="Items below reorder point"
              icon={AlertCircle}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales & Revenue</CardTitle>
                <CardDescription>Monthly revenue overview for the current fiscal year.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrend}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0f62fe" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#0f62fe" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Side Chart */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>
                  Stock levels by category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#4b5563" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        width={80}
                      />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                      <Bar dataKey="value" fill="#243b53" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
             <Card>
                <CardHeader>
                   <CardTitle>Recent Activity</CardTitle>
                   <CardDescription>Latest system transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      {[1,2,3].map(i => (
                         <div key={i} className="flex items-center text-xs">
                            <span className="relative flex h-2 w-2 mr-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <div className="flex-1 space-y-1">
                               <p className="font-medium">Order #ORD-{2020+i} processed</p>
                               <p className="text-erp-500">Warehouse A • 2 mins ago</p>
                            </div>
                            <div className="font-semibold">+$1,250.00</div>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                   <CardTitle>System Health</CardTitle>
                   <CardDescription>Server performance metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                         <div className="flex items-center justify-between">
                            <span className="font-medium">Database Load</span>
                            <span className="text-erp-500">24%</span>
                         </div>
                         <div className="h-1.5 w-full bg-erp-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[24%]"></div>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center justify-between">
                            <span className="font-medium">API Latency</span>
                            <span className="text-erp-500">45ms</span>
                         </div>
                         <div className="h-1.5 w-full bg-erp-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[15%]"></div>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center justify-between">
                            <span className="font-medium">Storage Usage</span>
                            <span className="text-erp-500">88%</span>
                         </div>
                         <div className="h-1.5 w-full bg-erp-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[88%]"></div>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-erp-200 rounded-md">
            <p className="text-erp-400 text-sm">Advanced analytics module coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};