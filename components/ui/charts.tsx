"use client"

import { useEffect, useState } from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300'
]

interface ChartProps {
  data: any[]
  xField?: string
  yField?: string
}

export function LineChart({ 
  data, 
  xField = 'date', 
  yField = 'value' 
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yField}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function PieChart({ 
  data 
}: { 
  data: { name: string; value: number }[] 
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export function AreaChart({ 
  data, 
  xField = 'date', 
  yField = 'value' 
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey={yField}
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export function BarChart({ 
  data, 
  xField = 'name', 
  yField = 'value' 
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={yField}
          fill="#8884d8"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
