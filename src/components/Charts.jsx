import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";

export function TempHumidityChart({ data }) {
  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis yAxisId="left" domain={[0, 'dataMax + 10']} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 10']} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff6b6b" dot={false} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#4c9aff" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SoilLightChart({ data }) {
  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
