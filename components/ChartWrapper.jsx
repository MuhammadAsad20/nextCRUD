"use client";
import dynamic from 'next/dynamic';

const AdminCharts = dynamic(() => import("./AdminCharts"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
      Loading Analytics...
    </div>
  )
});

export default function ChartWrapper({ data, total }) {
  return <AdminCharts data={data} total={total} />;
}
