import { Autocomplete, Container, TextField,  Typography } from "@mui/material";
import { Box } from "@mui/system";
import { parseISO, subDays } from "date-fns";
import { useCallback, useState } from "react";
import { useRouteMatch, } from "react-router";
import debounce from 'lodash.debounce'

import { DateRangePicker, DateRange } from "../../components";
import { FluidIntakeChart } from "./FluidIntakeChart";
import { FoodIntakeChart } from "./FoodIntakeChart";
import { MoodChart } from "./MoodChart";

const TABLE_TYPES = ["Mood", "Hydration", "Meals", "All"] as const;
const DATABASE_SNAPSHOT_AGE = '2019-05-12T22:06:34+01:00'

export function CareRecipientPage() {
  const databaseSnapshotAge = parseISO(DATABASE_SNAPSHOT_AGE) //in a realistic situation we would just call Date constructor without parameters here
  const [dateRange, setDateRange] = useState({ 
    startDate: subDays(databaseSnapshotAge, 7),
    endDate: databaseSnapshotAge
  } as null | DateRange)
  const [tableTypeKey, setTableTypeKey] = useState("All" as typeof TABLE_TYPES[number])
  
  //mood, fluidIntake, dailyMeals
  const startDate = dateRange ? dateRange.startDate : null;
  const endDate = dateRange ? dateRange.endDate : null;
  const match = useRouteMatch<{ recipientId: string }>()

  const setTimeRange = useCallback(debounce(
    (dateRange: DateRange | null) => { setDateRange(dateRange) }
  ), [setDateRange])
  
  return (
    <Container>
      <Typography sx={{ marginY: 2 }} component="h1" variant="h5">CareRecipient #{match.params.recipientId}</Typography>

      <DateRangePicker
        value={dateRange}
        maxDate={databaseSnapshotAge}
        onChange={setTimeRange}
      />
      
      <Box sx={{ my: 2 }}>
        <Autocomplete
          fullWidth
          id="table-type-selector"
          value={tableTypeKey}
          onChange={(e, tableTypeKey) => {
            if(!tableTypeKey) return
            setTableTypeKey(tableTypeKey)
          }}
          options={TABLE_TYPES}
          renderInput={(params) => <TextField {...params} fullWidth label="Table" />}
        />
      </Box>

      {(tableTypeKey === "Mood" || tableTypeKey === "All") && (
        <MoodChart 
          careRecipientId={match.params.recipientId}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {(tableTypeKey === "Hydration" || tableTypeKey === "All") && (
        <FluidIntakeChart
          careRecipientId={match.params.recipientId}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {(tableTypeKey === "Meals" || tableTypeKey === "All") && (
        <FoodIntakeChart
          careRecipientId={match.params.recipientId}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      
      
    </Container>
  )
}

 /*
 <pre>{JSON.stringify(fullEvents, null, 2)}</pre>
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
          {xAxis}
          
          <Line type="monotone" dataKey="value" yAxisId="main"  stroke={tableConfig.lineProps.strokeColor || "blue"} name={tableConfig.lineProps.name} />
          {/*<Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
        </LineChart>*/


/*
function FluidIntakeTable(props: {
  daysEvents: Array<{ day: Date, events: Array<BirdieEvent> }>,
  xAxis: JSX.Element
  isLoading: boolean
}) {

  const chartData = props.daysEvents.map(dayEvents => ({ 
    date: dayEvents.day, 
    fluidIntake: dayEvents.events.reduce((fluidIntake, event) => {
      if(event.event_type === "fluid_intake_observation") fluidIntake += event.consumed_volume_ml
      return fluidIntake
    }, 0)
  }))

  return (
    <ResponsiveContainerWithLoader height={400} isUpdating={props.isLoading}>
    <LineChart
      data={chartData}
      margin={{
        right: 8,//parseInt(theme.spacing(2)),
        left: 8,//parseInt(theme.spacing(2)),
        top: 16,//parseInt(theme.spacing(4)),
        bottom: 16//parseInt(theme.spacing(4))
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
        //domain={[startDate ? startDate?.valueOf() : 'dataMin', endDate ? endDate?.valueOf() : 'dataMax']} //'dataMin', 'dataMax', dataMin =>, 'auto'
        domain={[ domainStartDate ? domainStartDate.valueOf() : -Infinity, domainEndDate ? domainEndDate.valueOf() : Infinity ]} 
        tickFormatter={date => {
          if(date === Infinity || date === -Infinity) return ""
          return format(date, "dd.MM.yyyy")
        }}
      />
      
      <Line type="monotone" dataKey="fluidIntake" yAxisId="main"  stroke="blue" name="fluid intake" />
    </LineChart>
    </ResponsiveContainerWithLoader>
  )
}
*/
