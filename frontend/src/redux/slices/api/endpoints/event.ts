import { QEncoder } from '../../../../lib/QEncoder';
import { BirdieEvent } from './EventType'
import { apiSlice } from '../index'

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    events: build.query<Array<BirdieEvent>, { 
      careRecipientId: string
      eventType?: Array<string>
      skip?: number
      limit?: number
      timeRangeStart?: string
      timeRangeEnd?: string
     }>({
      ///v1/events?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&limit=10&eventType=task_completed&eventType=task_schedule_created
      query: params => {
        const q = new QEncoder({ careRecipientId: params.careRecipientId })
        if(params.limit) q.append('limit', params.limit)
        if(params.skip) q.append('skip', params.skip)
        if(params.timeRangeStart) q.append('timeRangeStart', params.timeRangeStart)
        if(params.timeRangeEnd) q.append('timeRangeEnd', params.timeRangeEnd)
        if(params.eventType) q.append('eventType', params.eventType)
        return `/v1/events/${q}`
      },
      providesTags: results => results ? results.map(result => ({ type: "BirdieEvent", id: result.id })) : []
    }),
    eventAggregates: build.query<EventAggregateValues, {
      careRecipientId: string
      timeRangeStart?: string
      timeRangeEnd?: string
    }>({
      ///v1/events/aggregate?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d
      query: params => {
        const q = new QEncoder({ careRecipientId: params.careRecipientId })
        if(params.timeRangeStart) q.append('timeRangeStart', params.timeRangeStart)
        if(params.timeRangeEnd) q.append('timeRangeEnd', params.timeRangeEnd)
        return `/v1/events/aggregate/${q}`
      }
    })
  }),
  overrideExisting: true
})

export const { useEventsQuery, useEventAggregatesQuery } = extendedApi

type EventAggregateValues = {
  byDay: Array<{
    date: string
    fluidIntake: {
        totalFluidIntake: number
        regularFluidIntake: number
        caffeinatedFluidIntake: number
    };
    mood: {
        totalMoodReadings: number
        sad?: number
        okay?: number
        happy?: number
    };
    foodIntake: Array<{
        type: string
        note: string
        timestamp: string
    }>
  }>
}