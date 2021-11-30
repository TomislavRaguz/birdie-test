import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: headers => {
      headers.set("X-Requested-With", "XMLHttpRequest")
      headers.set("Content-Type", "application/json")
      return headers;
    },
  }),
  tagTypes: [
    'BirdieEvent'
  ],
  endpoints: builder => ({})
})
