import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = "https://api.coingecko.com/api/v3";

const baseQueryWithRetry = fetchBaseQuery({
    baseUrl: BASE_URL,
});

// Wrapper to add retry logic
const baseQuery = async (args, api, extraOptions) => {
    let result = await baseQueryWithRetry(args, api, extraOptions);

    // Retry on failure (up to 3 times)
    if (result.error) {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries && result.error) {
            retryCount++;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            result = await baseQueryWithRetry(args, api, extraOptions);

            // If successful, break the loop
            if (!result.error) break;
        }
    }

    return result;
};

export const coinGeckoApi = createApi({
    reducerPath: 'coinGeckoApi',
    baseQuery,
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
            query: ({ id, days, from, to, interval }) => {
                // Use range endpoint if from/to are provided, otherwise use days endpoint
                if (from !== undefined && to !== undefined) {
                    const params = new URLSearchParams({
                        vs_currency: 'usd',
                        from: from.toString(),
                        to: to.toString(),
                    });
                    if (interval) {
                        params.append('interval', interval);
                    }
                    return `/coins/${id}/market_chart/range?${params.toString()}`;
                }
                return `/coins/${id}/market_chart?vs_currency=usd&days=${days || 7}`;
            },
            providesTags: (result, error, { id }) => [{ type: 'Chart', id }],
        }),
    }),
});

export const {
    useGetCryptosQuery,
    useGetCoinDataQuery,
    useGetChartDataQuery,
} = coinGeckoApi;
