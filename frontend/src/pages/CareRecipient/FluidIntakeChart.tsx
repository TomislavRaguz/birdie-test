import { Typography, useTheme } from '@mui/material';
import { format, startOfDay, endOfDay, isValid } from 'date-fns'
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, Legend } from "recharts";
import { ErrorView, ResponsiveContainerWithLoader } from '../../components'
import { DATE_FORMAT } from '../../lib';
import { useEventAggregatesQuery } from "../../redux/slices/api/endpoints/event";

export function FluidIntakeChart(props: {
  careRecipientId: string
  startDate?: Date | null
  endDate?: Date | null
}) {
  const { careRecipientId, startDate, endDate } = props;
  
  const theme = useTheme();
  
  const aggregateQueryState = useEventAggregatesQuery({
    careRecipientId,
    ...(!!startDate && isValid(startDate) && { timeRangeStart: startOfDay(startDate).toISOString() }),
    ...(!!endDate && isValid(endDate) && { timeRangeEnd: endOfDay(endDate).toISOString() }),
  })
  
  if(aggregateQueryState.error) return <ErrorView  queryState={aggregateQueryState} />

  let chartData: Array<FluidIntakeDatapoint> = []
  if(aggregateQueryState.data) {
    chartData = aggregateQueryState.data.byDay.map(dayData => ({ date: new Date(dayData.date), ...dayData.fluidIntake }))
  }

  let domainStartDate = startDate ? startOfDay(startDate) : null;
  if(!domainStartDate && chartData.length) {
    domainStartDate = new Date(chartData[0].date);
  }
  let domainEndDate = endDate ? endOfDay(endDate) : null;
  if(!domainEndDate && chartData.length) {
    domainEndDate = new Date(chartData[chartData.length - 1].date);
  }

  return (
    <>
      <Typography variant="h5">Hydration</Typography>
      <ResponsiveContainerWithLoader height={400} isUpdating={aggregateQueryState.isFetching || aggregateQueryState.isLoading}>
       
        <AreaChart data={chartData}
          margin={{ 
            right: parseInt(theme.spacing(2)),
            left: parseInt(theme.spacing(2)),
            top: parseInt(theme.spacing(4)),
            bottom: parseInt(theme.spacing(4))
          }}>
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="caffeinated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d9b38c" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#d9b38c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            type="number"
            interval="preserveStartEnd"
            domain={[ domainStartDate ? domainStartDate.valueOf() : -Infinity, domainEndDate ? domainEndDate.valueOf() : Infinity ]} 
            tickFormatter={date => {
              if(date === Infinity || date === -Infinity) return ""
              return format(date, DATE_FORMAT)
            }}
          />
          <YAxis 
            tickFormatter={number => (number/1000).toFixed(0)+'L'}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip 
            labelFormatter={val => format(val, DATE_FORMAT)}
            formatter={(value: number, name: string) => [(value/1000).toFixed(2)+ ' L', name]}
          />
          <Legend />
          <Area type="monotone" dataKey="totalFluidIntake" stroke="#8884d8" fillOpacity={1} fill="url(#total)" name="Total fluid intake"/>
          <Area type="monotone" dataKey="caffeinatedFluidIntake" stroke="brown" fillOpacity={1} fill="url(#caffeinated)" name="Caffeinated fluid intake"/>
        </AreaChart>
      </ResponsiveContainerWithLoader>
    </>
  )
}

type FluidIntakeDatapoint = {
  date: Date,
  totalFluidIntake: number
  caffeinatedFluidIntake: number
}

 /*
 Area chart is more fit for this use case
 <LineChart
  data={chartData}
  margin={{
    right: parseInt(theme.spacing(2)),
    left: parseInt(theme.spacing(2)),
    top: parseInt(theme.spacing(4)),
    bottom: parseInt(theme.spacing(4))
  }}
>
  <CartesianGrid stroke="#f5f5f5" />
  
  <YAxis type="number" yAxisId="main" />
  <Tooltip
    labelFormatter={val => format(val, 'dd.MM.yyyy')}
  />
  
  <XAxis
    dataKey="date"
    type="number"
    interval="preserveStartEnd"
    domain={[ domainStartDate ? domainStartDate.valueOf() : -Infinity, domainEndDate ? domainEndDate.valueOf() : Infinity ]} 
    tickFormatter={date => {
      if(date === Infinity || date === -Infinity) return ""
      return format(date, "dd.MM.yyyy")
    }}
  />
  
  <Line type="monotone" dataKey="totalFluidIntake" yAxisId="main"  stroke="blue" name="fluid intake" />
  <Line type="monotone" dataKey="caffeinatedFluidIntake" yAxisId="main" stroke="brown" name="caffeinated fluids" />
</LineChart>
*/