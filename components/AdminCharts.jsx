"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCharts({ data, total }) {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full shadow-2xl">
      <CardHeader><CardTitle className="text-white">Task Distribution</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm">Total System Tasks</p>
          <h4 className="text-3xl font-bold text-white">{total}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
