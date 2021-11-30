import { Paper, Typography, useTheme } from '@mui/material';
import { format, startOfDay, endOfDay, set, isValid, parseISO } from 'date-fns'
import { CartesianGrid, XAxis, YAxis, Tooltip, Scatter, ScatterChart, Legend } from "recharts";
import { ErrorView, ResponsiveContainerWithLoader } from '../../components'
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '../../lib';
import { useEventAggregatesQuery } from "../../redux/slices/api/endpoints/event";

export function FoodIntakeChart(props: {
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

  const meals: Array<FoodIntakeDatapoint> = []
  const snacks: Array<FoodIntakeDatapoint> = []
  if(aggregateQueryState.data) {
    aggregateQueryState.data.byDay.forEach(dayEvents => {
      const date = parseISO(dayEvents.date)
      dayEvents.foodIntake.forEach(foodIntakeEvent => {
        const milisecondOfDay = +parseISO(foodIntakeEvent.timestamp) - +set(parseISO(foodIntakeEvent.timestamp), { hours:0, seconds: 0 })
        const event = {
          date,
          milisecondOfDay,
          timestamp: foodIntakeEvent.timestamp,
          note: foodIntakeEvent.note
        }
        if(foodIntakeEvent.type === "snack") snacks.push(event)
        if(foodIntakeEvent.type === "meal") meals.push(event)
      })
    })
  }

  let domainStartDate = startDate ? startOfDay(startDate) : null;
  if(!domainStartDate && meals.length) {
    domainStartDate = new Date(meals[0].date);
  }
  let domainEndDate = endDate ? startOfDay(endDate) : null;
  if(!domainEndDate && meals.length) {
    domainEndDate = new Date(meals[meals.length - 1].date);
  }

  return (
    <>
      <Typography variant="h5">Meals and snacks</Typography>
      <ResponsiveContainerWithLoader height={400} isUpdating={aggregateQueryState.isFetching || aggregateQueryState.isLoading}>
        <ScatterChart
          margin={{ 
            right: parseInt(theme.spacing(2)),
            left: parseInt(theme.spacing(2)),
            top: parseInt(theme.spacing(4)),
            bottom: parseInt(theme.spacing(4))
          }}>
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
            dataKey="milisecondOfDay"
            type="number"
            tickFormatter={time => {
              if(time === Infinity || time === -Infinity) return ''
              return format(time, TIME_FORMAT)
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip 
            content={(props) => {
              const payload = (props.payload && props.payload[0] != null && props.payload[0].payload);
              return (
              <Paper sx={{ p: 1, maxWidth: 300 }}>
                <Typography>
                  {!!payload && format(new Date(payload.timestamp), DATE_TIME_FORMAT)}
                </Typography>
                <Typography variant="caption">
                  {!!payload && payload.note}
                </Typography>
              </Paper>
            )
            }}
          />
          <Legend />
          <Scatter name="snacks" data={snacks} fill="#8884d8" />
          <Scatter name="meals" data={meals} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainerWithLoader>
    </>
  )
}

type FoodIntakeDatapoint = {
  date: Date
  milisecondOfDay: number
  note: string
  timestamp: string
}