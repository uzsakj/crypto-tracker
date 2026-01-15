import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "https://api.coingecko.com/api/v3";

export const coinGeckoApi = createApi({
    reducerPath: 'coinGeckoApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Cryptos', 'Coin', 'Chart'],
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: () => '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
            providesTags: ['Cryptos'],
        }),
        getCoinData: builder.query({
            query: (id) => `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
            providesTags: (result, error, id) => [{ type: 'Coin', id }],
        }),
        getChartData: builder.query({
            query: ({ id, days = 7 }) => `/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
            providesTags: (result, error, { id }) => [{ type: 'Chart', id }],
        }),
    }),
});

export const {
    useGetCryptosQuery,
    useGetCoinDataQuery,
    useGetChartDataQuery,
} = coinGeckoApi;
