import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  FileText, 
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Activity,
  MapPin,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AIAdmin from '../AIBOT/AIAdmin.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { saveAs } from 'file-saver';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminDashboard = () => {
  const [activeDrawer, setActiveDrawer] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hardcoded employee data
  const employees = [
    { id: 1, name: 'John Doe', type: 'hybrid', tasks: ['UI Design', 'Client Meeting'], location: [51.505, -0.09] },
    { id: 2, name: 'Jane Smith', type: 'onsite', tasks: ['Backend Development', 'Code Review'], location: [51.51, -0.1] },
    { id: 3, name: 'Robert Johnson', type: 'hybrid', tasks: ['Database Optimization', 'Team Training'], location: [51.515, -0.08] },
    { id: 4, name: 'Emily Davis', type: 'remote', tasks: ['Content Writing', 'SEO Optimization'], location: [51.52, -0.07] },
    { id: 5, name: 'Michael Wilson', type: 'onsite', tasks: ['Frontend Development', 'Bug Fixing'], location: [51.525, -0.06] },
    { id: 6, name: 'Sarah Brown', type: 'hybrid', tasks: ['Project Management', 'Client Communication'], location: [51.53, -0.05] },
    { id: 7, name: 'David Miller', type: 'onsite', tasks: ['QA Testing', 'Documentation'], location: [51.535, -0.04] },
    { id: 8, name: 'Lisa Johnson', type: 'hybrid', tasks: ['UX Research', 'Prototyping'], location: [51.54, -0.03] },
    { id: 9, name: 'James Taylor', type: 'remote', tasks: ['DevOps', 'Server Maintenance'], location: [51.545, -0.02] },
    { id: 10, name: 'Jennifer Anderson', type: 'onsite', tasks: ['Data Analysis', 'Reporting'], location: [51.55, -0.01] }
  ];

  // Calculate employee type distribution
  const employeeTypeData = employees.reduce((acc, employee) => {
    acc[employee.type] = (acc[employee.type] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for Pie chart
  const employeeTypePieData = Object.keys(employeeTypeData).map((type, index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: employeeTypeData[type],
    color: ['#4786FA', '#D1DFFA', '#E3EAFE'][index % 3]
  }));

  // Calculate task distribution
  const allTasks = employees.flatMap(emp => emp.tasks);
  const taskCounts = allTasks.reduce((acc, task) => {
    acc[task] = (acc[task] || 0) + 1;
    return acc;
  }, {});

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', users: 120, organizations: 15, revenue: 25000 },
    { month: 'Feb', users: 190, organizations: 22, revenue: 35000 },
    { month: 'Mar', users: 300, organizations: 28, revenue: 42000 },
    { month: 'Apr', users: 280, organizations: 35, revenue: 48000 },
    { month: 'May', users: 450, organizations: 42, revenue: 55000 },
    { month: 'Jun', users: 520, organizations: 48, revenue: 62000 },
  ];

  const pieData = [
    { name: 'Technology', value: 35, color: '#4786FA' },
    { name: 'Healthcare', value: 25, color: '#D1DFFA' },
    { name: 'Finance', value: 20, color: '#E3EAFE' },
    { name: 'Education', value: 15, color: '#F4F7FF' },
    { name: 'Other', value: 5, color: '#E2E9F9' },
  ];

  // Drawer configuration
  const drawerItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      component: DashboardContent
    },
    {
      id: 'organizations',
      name: 'Organizations',
      icon: Building2,
      component: OrganizationsContent
    },
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      component: UsersContent
    },
    {
      id: 'employees',
      name: 'Employees',
      icon: UserCheck,
      component: EmployeesContent
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      component: AnalyticsContent
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: FileText,
      component: ReportsContent
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: Calendar,
      component: CalendarContent
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      component: SettingsContent
    }
  ];

  // Function to generate PDF report
  const generateEmployeeReport = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    page.drawText('Employee Report', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Add date
    const now = new Date();
    page.drawText(`Generated on: ${now.toLocaleDateString()}`, {
      x: 50,
      y: height - 80,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    // Add employee data
    let yPosition = height - 120;
    employees.forEach((employee, index) => {
      if (yPosition <= 100) {
        page.drawText('-- Continued on next page --', {
          x: 50,
          y: 50,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        // Add a new page
        const newPage = pdfDoc.addPage([600, 800]);
        yPosition = newPage.getHeight() - 50;
      }
      
      page.drawText(`${index + 1}. ${employee.name}`, {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`   Type: ${employee.type}`, {
        x: 70,
        y: yPosition - 20,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`   Tasks: ${employee.tasks.join(', ')}`, {
        x: 70,
        y: yPosition - 40,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 70;
    });
    
    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create a blob and download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'employee-report.pdf');
  };

  // Dashboard main content
  function DashboardContent() {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Users" 
            value="1,234" 
            change="+12%" 
            icon={Users}
            color="bg-[#4786FA]"
          />
          <StatsCard 
            title="Organizations" 
            value="48" 
            change="+8%" 
            icon={Building2}
            color="bg-[#D1DFFA]"
          />
          <StatsCard 
            title="Active Sessions" 
            value="892" 
            change="+15%" 
            icon={Activity}
            color="bg-[#E3EAFE]"
          />
          <StatsCard 
            title="Revenue" 
            value="$62,000" 
            change="+23%" 
            icon={TrendingUp}
            color="bg-[#4786FA]"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
          >
            <h3 className="text-lg font-bold text-[#4786FA] mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E9F9" />
                <XAxis dataKey="month" stroke="#4786FA" />
                <YAxis stroke="#4786FA" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E9F9',
                    borderRadius: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#4786FA" 
                  strokeWidth={3}
                  dot={{ fill: '#4786FA', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Employee Type Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
          >
            <h3 className="text-lg font-bold text-[#4786FA] mb-4">Employee Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeTypePieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {employeeTypePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
        >
          <h3 className="text-lg font-bold text-[#4786FA] mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E9F9" />
              <XAxis dataKey="month" stroke="#4786FA" />
              <YAxis stroke="#4786FA" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E9F9',
                  borderRadius: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4786FA" 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4786FA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4786FA" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    );
  }

  // Employees Content with Map
  function EmployeesContent() {
    const hybridEmployees = employees.filter(emp => emp.type === 'hybrid');
    
    return (
      <div className="space-y-6">
        {/* Employee Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]">
            <h3 className="text-lg font-bold text-[#4786FA] mb-2">Total Employees</h3>
            <p className="text-3xl font-bold">{employees.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]">
            <h3 className="text-lg font-bold text-[#4786FA] mb-2">Hybrid Workers</h3>
            <p className="text-3xl font-bold">{hybridEmployees.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]">
            <h3 className="text-lg font-bold text-[#4786FA] mb-2">Onsite Workers</h3>
            <p className="text-3xl font-bold">{employees.filter(emp => emp.type === 'onsite').length}</p>
          </div>
        </div>

        {/* Employee Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
        >
          <h3 className="text-lg font-bold text-[#4786FA] mb-4">Hybrid Employee Locations</h3>
          <div className="h-96 rounded-xl overflow-hidden">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {hybridEmployees.map(employee => (
                <Marker key={employee.id} position={employee.location}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold">{employee.name}</h4>
                      <p>Type: {employee.type}</p>
                      <p>Tasks: {employee.tasks.join(', ')}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Employee List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
        >
          <h3 className="text-lg font-bold text-[#4786FA] mb-4">All Employees</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.type === 'hybrid' 
                          ? 'bg-blue-100 text-blue-800' 
                          : employee.type === 'onsite' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{employee.tasks.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  }

  // Other content components (placeholders for now)
  function OrganizationsContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Organizations Management</h2>
        <p className="text-gray-600">Organizations content will go here...</p>
      </div>
    );
  }

  function UsersContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Users Management</h2>
        <p className="text-gray-600">Users content will go here...</p>
      </div>
    );
  }

  function AnalyticsContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Advanced Analytics</h2>
        <p className="text-gray-600">Analytics content will go here...</p>
      </div>
    );
  }

  function ReportsContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Reports</h2>
        <p className="text-gray-600">Reports content will go here...</p>
      </div>
    );
  }

  function CalendarContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Calendar</h2>
        <p className="text-gray-600">Calendar content will go here...</p>
      </div>
    );
  }

  function SettingsContent() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#4786FA] mb-4">Settings</h2>
        <p className="text-gray-600">Settings content will go here...</p>
      </div>
    );
  }

  // Stats Card Component
  function StatsCard({ title, value, change, icon: Icon, color }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E9F9]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-[#4786FA]">{value}</p>
            <p className="text-sm text-green-600 mt-1">{change}</p>
          </div>
          <div className={`${color} p-3 rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>
    );
  }

  const ActiveComponent = drawerItems.find(item => item.id === activeDrawer)?.component;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE] flex">
        {/* Sidebar - 30% width */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`${sidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 bg-[#4786FA] shadow-2xl flex flex-col`}
        >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#D1DFFA]/20">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-[#4786FA] font-bold text-xl">C</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Crewzy Admin</h1>
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-2">
          {drawerItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDrawer === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDrawer(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-[#4786FA] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {!sidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 border-t border-[#D1DFFA]/20"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm opacity-80">admin@crewzy.com</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content Area - 70% width */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-[#E2E9F9] p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#4786FA]">
                {drawerItems.find(item => item.id === activeDrawer)?.name}
              </h1>
              <p className="text-gray-600 mt-1">Welcome back to your dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={generateEmployeeReport}
                className="flex items-center gap-2 bg-[#4786FA] text-white px-4 py-2 rounded-xl shadow-lg"
              >
                <Download size={18} />
                <span>Download Report</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative bg-[#4786FA] text-white p-3 rounded-xl shadow-lg"
              >
                <Bell size={20} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDrawer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <AIAdmin />
      </div>
    </div>
  );
};

export default AdminDashboard;