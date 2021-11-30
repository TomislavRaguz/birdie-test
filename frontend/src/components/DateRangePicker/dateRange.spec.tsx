import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DateRangePicker } from '.'
import { addDays, parseISO, subDays } from 'date-fns'

describe('dateRangePicker', () => {
  it('renders without an error', () => {
    render(
      <DateRangePicker 
        value={{ startDate: new Date(), endDate: new Date() }}
        onChange={() => {}}
      />
    )
  })

  it('invokes the provided callback with the clicked date', async () => {
    const onChangeMock = jest.fn();

    render(
      <DateRangePicker 
        value={{ startDate:parseISO('2018-01-01T00:00:00.000Z'), endDate: parseISO('2018-01-03T00:00:00.000Z') }}
        onChange={onChangeMock}
      />
    )

    fireEvent.click(screen.getByLabelText("Choose date, selected date is Jan 1, 2018"))
    await waitFor(() => screen.getByRole('dialog'))
    fireEvent.click(screen.getByLabelText('Jan 2, 2018'));
    
    expect(onChangeMock).toHaveBeenCalledWith({
      startDate: parseISO('2018-01-02T00:00:00.000Z'),
      endDate: parseISO('2018-01-03T00:00:00.000Z')
    })

  })

  it('properly disables the dates when maxDate or minDate are provided', async () => {
    const referenceDate = parseISO('2018-01-15T00:00:00.000Z')

    render(
      <DateRangePicker 
        value={{ startDate: referenceDate, endDate: addDays(referenceDate, 3) }}
        onChange={() => {}}
        maxDate={addDays(referenceDate, 7)}
        minDate={subDays(referenceDate, 7)}
      />
    )

    fireEvent.click(screen.getByLabelText("Choose date, selected date is Jan 18, 2018"))
    await waitFor(() => screen.getByRole('dialog'));
    expect(screen.getByLabelText('Jan 29, 2018')).toBeDisabled()
    expect(screen.getByLabelText('Jan 2, 2018')).toBeDisabled()

  })
  
  it('calls the callback with a null endDate if the selected date is before the current endDate', async () => {
    const referenceDate = parseISO('2018-01-15T00:00:00.000Z')
    const onChangeMock = jest.fn();

    render(
      <DateRangePicker 
        value={{ startDate: referenceDate, endDate: addDays(referenceDate, 3) }}
        onChange={onChangeMock}
      />
    )

    fireEvent.click(screen.getByLabelText("Choose date, selected date is Jan 15, 2018"))
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByLabelText('Jan 20, 2018'));
    expect(onChangeMock).toHaveBeenCalledWith({
      startDate: parseISO('2018-01-20T00:00:00.000Z'),
      endDate: null
    })
    
  })
})