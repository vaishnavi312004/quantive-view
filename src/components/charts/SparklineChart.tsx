import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: { x: number; y: number }[];
  color?: string;
}

const SparklineChart = ({ data, color = 'hsl(var(--primary))' }: Props) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default SparklineChart;
