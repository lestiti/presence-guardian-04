import { Users, QrCode, BarChart2 } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, trend }: { icon: any, title: string, value: string, trend: string }) => (
  <div className="card animate-fade-in">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h3 className="text-secondary-light font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-secondary">{value}</p>
      </div>
      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
    <p className="mt-4 text-sm text-secondary-light">{trend}</p>
  </div>
);

const Index = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="mt-2 text-secondary-light">Welcome to FPVM Checking System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value="2,420"
          trend="12% increase from last month"
        />
        <StatCard
          icon={QrCode}
          title="Today's Check-ins"
          value="186"
          trend="24 more than yesterday"
        />
        <StatCard
          icon={BarChart2}
          title="Active Synods"
          value="8"
          trend="2 new synods this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium text-secondary">John Doe checked in</p>
                  <p className="text-sm text-secondary-light">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-secondary mb-4">Synod Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-secondary-light">Chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;