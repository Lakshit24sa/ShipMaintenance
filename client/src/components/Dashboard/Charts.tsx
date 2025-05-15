import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis,PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MaintenanceStatusData {
  name: string;
  value: number;
  color: string;
}

interface ShipStatusData {
  name: string;
  value: number;
  color: string;
}


interface ChartsProps {
  maintenanceStatusData: MaintenanceStatusData[];
  shipStatusData: ShipStatusData[];
}

const MaintenanceStatusChart: React.FC<{ data: MaintenanceStatusData[] }> = ({ data }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">
          Maintenance Jobs by Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis allowDecimals={false} stroke="#888888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              />
              <Legend />
              <Bar dataKey="value" name="Jobs Count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ShipStatusChart: React.FC<{ data: ShipStatusData[] }> = ({ data }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">
          Ship Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Ships']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const Charts: React.FC<ChartsProps> = ({ maintenanceStatusData, shipStatusData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MaintenanceStatusChart data={maintenanceStatusData} />
      <ShipStatusChart data={shipStatusData} />
    </div>
  );
};

export default Charts;
