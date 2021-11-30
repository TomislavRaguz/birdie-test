import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Button, ButtonGroup, Grid } from '@mui/material';
import { isAfter, isBefore, sub, subDays } from 'date-fns';

export interface DateRange {
  startDate?: Date | null, 
  endDate?: Date | null
}

const DATABASE_SNAPSHOT_AGE = '2019-05-12T22:06:34+01:00'

export function DateRangePicker(props: { 
  value: DateRange | null, 
  onChange: (value: DateRange | null) => void,
  maxDate?: Date
  minDate?: Date
}) {
  
  const setRangeBeforeToday = (duration?: Duration) => () => {
    if(duration) {
      const endDate = new Date(DATABASE_SNAPSHOT_AGE)
      const startDate = sub(endDate, duration)
      props.onChange({ startDate, endDate })
    } else {
      props.onChange(null)
    }
  }

  function isValidRangeDate (date: Date | null | undefined) {
    if(!date) return true
    if(props.maxDate && isAfter(date, props.maxDate)) return true
    if(props.minDate && isBefore(date, props.minDate)) return true
    return false
  }
  
  function isValidRangeEndDate (date: Date | null | undefined) {
    if(isValidRangeDate(date)) return true;
    if(value && value.startDate && isBefore(date as Date, value.startDate)) return true
    return false
  }

  function setRange(nextValue: DateRange) {
    if(!nextValue.startDate && !nextValue.endDate) {
      props.onChange(null)
    } else {
      props.onChange(nextValue)
    } 
  }

  const { value } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            label="Start date"
            shouldDisableDate={isValidRangeDate}
            value={value ? value.startDate : null}
            onChange={(newStartDate) => {
              let endDate = value ? value.endDate : null;
              if(!newStartDate) {
                setRange({ startDate: null, endDate })
                return;
              } 
              if(endDate && isAfter(newStartDate, endDate)) {
                endDate = null;
              }
              setRange({
                startDate: newStartDate,
                endDate
              })
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            label="End date"
            value={value ? value.endDate : null}
            shouldDisableDate={isValidRangeEndDate}
            onChange={(newEndDate) => {
              let startDate = value ? value.startDate : null;
              if(!newEndDate) {
                setRange({ startDate, endDate: null })
                return;
              }
              if(startDate && isBefore(newEndDate, startDate)) {
                startDate = subDays(newEndDate, 1)
              }
              setRange({
                startDate,
                endDate: newEndDate,
              })
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item md={4}>
          <ButtonGroup sx={{ height: 56 }} variant="outlined" aria-label="outlined button group">
            <Button onClick={setRangeBeforeToday({ weeks: 1 })}>1W</Button>
            <Button onClick={setRangeBeforeToday({ months: 1 })}>1M</Button>
            <Button onClick={setRangeBeforeToday({ months: 3 })}>3M</Button>
            <Button onClick={setRangeBeforeToday({ years: 1 })}>1Y</Button>
            <Button onClick={setRangeBeforeToday()}>ALL</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </LocalizationProvider>
  )
}