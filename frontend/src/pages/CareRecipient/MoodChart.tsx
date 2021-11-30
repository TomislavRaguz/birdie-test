import { Typography, useTheme } from '@mui/material';
import { format, startOfDay, endOfDay, isValid, parseISO } from 'date-fns'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Legend, Bar } from "recharts";
import { ErrorView, ResponsiveContainerWithLoader } from '../../components'
import { DATE_FORMAT } from '../../lib';
import { useEventAggregatesQuery } from "../../redux/slices/api/endpoints/event";

export function MoodChart(props: {
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

  if(aggregateQueryState.error) return <ErrorView queryState={aggregateQueryState} />

  let chartData: Array<MoodChartDatapoint> = []
  if(aggregateQueryState.data) {
    const moodData = aggregateQueryState.data.byDay.map(dayData => ({ date: parseISO(dayData.date), ...dayData.mood }))
    chartData = moodData;
  }

  let domainStartDate = startDate ? startOfDay(startDate) : null;
  if(!domainStartDate && chartData.length) {
    domainStartDate = chartData[0].date;
  }
  let domainEndDate = endDate ? startOfDay(endDate) : null;
  if(!domainEndDate && chartData.length) {
    domainEndDate = chartData[chartData.length - 1].date;
  }

  return (
    <>
      <Typography variant="h5">Mood</Typography>
      <ResponsiveContainerWithLoader height={400} isUpdating={aggregateQueryState.isFetching || aggregateQueryState.isLoading}>
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
          <YAxis type="number" yAxisId="main" tickFormatter={percentage => (percentage*100)+'%'}/>

          <Tooltip
            labelFormatter={val => format(val, 'dd.MM.yyyy')}
            formatter={(value: number, name: string) => [(value*100).toFixed(0)+'%', name]}
          />
          <Legend />
          
          <Line type="monotone" dataKey="sad" yAxisId="main"  stroke="blue" name="sad" connectNulls/>
          <Line type="monotone" dataKey="okay" yAxisId="main" stroke="orange" name="okay" connectNulls/>
          <Line type="monotone" dataKey="happy" yAxisId="main"  stroke="green" name="happy" connectNulls/>
        </LineChart>
      </ResponsiveContainerWithLoader>
    </>
  )
}

type MoodChartDatapoint = {
  date: Date
  sad?: number
  okay?: number
  happy?: number 
}

/*
chartData = moodData.map(dayData => {
  //sad [0, 33]
  //okay [33, 66]
  //happy [66, 100]
  const sad = dayData.sad || 0;
  const okay = dayData.okay + sad || 0 + sad;
  const happy = dayData.happy + okay || 0 + okay;
  return {
  date: dayData.date,
  sad: [0, sad],
  okay: [sad, okay],
  happy: [okay, happy]
  };
})
<AreaChart data={chartData}
  margin={{ 
    right: parseInt(theme.spacing(2)),
    left: parseInt(theme.spacing(2)),
    top: parseInt(theme.spacing(4)),
    bottom: parseInt(theme.spacing(4))
  }}>
  <defs>
  <linearGradient id="colorHappy" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="green" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="green" stopOpacity={0.4}/>
  </linearGradient>
  <linearGradient id="colorOkay" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="orange" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="orange" stopOpacity={0.3}/>
  </linearGradient>
  <linearGradient id="colorSad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="yellow" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="yellow" stopOpacity={0}/>
  </linearGradient>
  </defs>
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
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip 
    labelFormatter={val => format(val, 'dd.MM.yyyy')}
    formatter={(value: [number, number], name: string) => [((value[1]-value[0])*100).toFixed(0)+ '%', name]}
  />
  <Area type="monotone" dataKey="happy" stroke="#8884d8" fillOpacity={1} fill="url(#colorHappy)" />
  <Area type="monotone" dataKey="okay" stroke="#82ca9d" fillOpacity={1} fill="url(#colorOkay)" />
  <Area type="monotone" dataKey="sad" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSad)" />
</AreaChart>*/
/*
<BarChart data={chartData} margin={{ 
  right: parseInt(theme.spacing(2)),
  left: parseInt(theme.spacing(2)),
  top: parseInt(theme.spacing(4)),
  bottom: parseInt(theme.spacing(4))
}}>
  <CartesianGrid strokeDasharray="3 3" />
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
  <YAxis />
  <Tooltip 
    labelFormatter={val => format(val, 'dd.MM.yyyy')}
    //formatter={(value: [number, number], name: string) => [((value[1]-value[0])*100).toFixed(0)+ '%', name]}
  />
  <Legend />
  <Bar dataKey="sad" fill="#8884d8" />
  <Bar dataKey="okay" fill="#82ca9d" />
  <Bar dataKey="happy" fill="#8884d8" />
</BarChart>*/