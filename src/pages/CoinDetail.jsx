import { useNavigate, useParams } from "react-router";
import { useGetCoinDataQuery, useGetChartDataQuery } from "../store/coinGeckoApi";
import { useMemo, useState, useEffect } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import { CryptoHeader } from "../components/CryptoHeader";
import { CryptoFooter } from "../components/CryptoFooter";
import {
    CartesianGrid,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line,
    Tooltip,
} from "recharts";

const TIME_RANGES = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", days: 30 },
    { label: "6 Months", days: 180 },
    { label: "1 Year", days: 365 },
];

export const CoinDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState(TIME_RANGES[1]); // Default to 1 week
    const [isMobile, setIsMobile] = useState(false);
    const { data: coin, isLoading: isLoadingCoin, error: coinError } = useGetCoinDataQuery(id);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { data: chartDataRaw, isLoading: isLoadingChart, error: chartError } = useGetChartDataQuery({
        id,
        days: selectedRange.days,
    });

    const chartData = useMemo(() => {
        if (!chartDataRaw?.prices || chartDataRaw.prices.length === 0) return [];

        const prices = chartDataRaw.prices;

        // Format time labels based on range
        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            if (selectedRange.days === 1) {
                // For 1 day: show time (5-minutely data)
                return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            } else if (selectedRange.days === 7) {
                // For 1 week: show day and time (hourly data)
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                });
            } else if (selectedRange.days <= 180) {
                // For 1 month and 6 months: show date (hourly data)
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
            } else {
                // For 1 year: show date (daily data)
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            }
        };

        return prices.map((price) => ({
            time: formatTime(price[0]),
            price: price[1].toFixed(2),
        }));
    }, [chartDataRaw, selectedRange]);

    const isLoading = isLoadingCoin || isLoadingChart;

    if (isLoading) {
        return (
            <div className="min-h-full bg-[#010203] p-0">
                <div className="flex flex-col items-center justify-center px-16 py-8 text-[#e0e0e0] gap-4">
                    <div className="w-12.5 h-12.5 border-4 border-solid border-[rgba(173, 216, 230, 0.2)] border-t-[#add8e6] rounded-full animate-spin "></div>
                    <p className="text-[1.1rem] font-medium">Loading coin data...</p>
                </div>
            </div>
        );
    }

    if (coinError || chartError || !coin) {
        return (
            <div className="min-h-full bg-[#010203] p-0">
                <div className="text-center px-16 py-8 text-[#e0e0e0] text-xl ">
                    <p>Coin not found or error loading data</p>
                    <button onClick={() => navigate("/")} className="
                        inline-block
                        px-3 py-6
                        bg-[rgba(255, 255, 255, 0.05)]
                        border border-solid border-[rgba(255, 255, 255, 0.1)]
                        rounded-lg
                        border-white/10
                        bg-white/5
                        text-[#e0e0e0]
                        font-semibold
                        cursor-pointer
                        no-underline
                        transition ease-in-out duration-300
                        hover:border-[rgba(255, 255, 255, 0.2)]
                        hover:bg-white/10
                        hover:border-white/20
                        mt-4
                    ">Go Back</button>
                </div>
            </div>
        );
    }

    const priceChange = coin.market_data.price_change_percentage_24h || 0;
    const isPositive = priceChange >= 0;
    return (
        <div className="m-0 min-h-full min-w-[320px] bg-[#010203] p-0 w-full">
            <CryptoHeader>
                <button onClick={() => navigate("/")} className="
                    inline-block
                    px-2 py-2 md:px-3 md:py-6
                    bg-[rgba(255, 255, 255, 0.05)]
                    border border-solid border-[rgba(255, 255, 255, 0.1)]
                    rounded-lg
                    border-white/10
                    bg-white/5
                    text-[#e0e0e0]
                    text-sm md:text-base
                    font-semibold
                    cursor-pointer
                    no-underline
                    transition ease-in-out duration-300
                    hover:border-[rgba(255, 255, 255, 0.2)]
                    hover:bg-white/10
                     hover:border-white/20
                    ">
                    ← Back to List
                </button>
            </CryptoHeader>

            <div className="max-w-[1400px] w-full mx-auto my-auto px-4 py-8 md:px-8">
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <img className="w-12 h-12 md:w-16 md:h-16 rounded-full border-solid border-2 border-[rgba(173, 216, 230, 0.3)]" src={coin.image.large} alt={coin.name} />
                        <div>
                            <h1 className="text-2xl md:text-4xl text-[#e0e0e0] mb-2">{coin.name}</h1>
                            <p className="text-[#9ca3af] text-sm md:text-base font-semibold">{coin.symbol.toUpperCase()}</p>
                        </div>
                    </div>
                    <span className="
                    inline-block
                    bg-[#add8e6]
                    text-[#010203]
                    px-2
                    py-2 md:py-4
                    rounded-20
                    text-[0.8rem] md:text-[0.9rem]
                    dont-bold
                    shadow-[0_4px_10px_rgba(173,216,230,0.3)]]
                    ">Rank #{coin.market_data.market_cap_rank}</span>
                </div>

                <div className="
                bg-[rgba(255, 255, 255, 0.03)]
                backdrop-blur-20
                rounded-20
                p-4 md:p-8
                min-h-8
                border
                border-solid
                border-[rgba(255, 255, 255, 0.1)]
                ">
                    <div className="mb-6">
                        <h2 className="text-3xl md:text-5xl text-white mb-2">{formatPrice(coin.market_data.current_price.usd)}</h2>
                        <span
                            className={`
                                inline-block
                                px-6 py-3
                                rounded-lg
                                text-[1.1rem]
                                font-semibold
                                border
                                ${isPositive
                                    ? "bg-[rgba(46,213,115,0.15)] text-[#2ed573] border-[rgba(46,213,115,0.3)]"
                                    : "bg-[rgba(255,71,87,0.15)] text-[#ff4757] border-[rgba(255,71,87,0.3)]"
                                }
                                `}
                        >
                            {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
                        </span>

                    </div>

                    <div className="flex gap-8 flex-wrap">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#9ca3af] font-semibold">24h High</span>
                            <span className="text-lg text-[#e0e0e0] font-bold]">
                                {formatPrice(coin.market_data.high_24h.usd)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#9ca3af] font-semibold">24h Low</span>
                            <span className="text-lg text-[#e0e0e0] font-bold">
                                {formatPrice(coin.market_data.low_24h.usd)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-[][rgba(255, 255, 255, 0.03)] backdrop-blur-20 rounded-20 p-4 md:p-8 mb-8 border border-solid border-[rgba(255, 255, 255, 0.1)] ">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h3 className="text-[#e0e0e0] text-xl md:text-2xl">Price Chart</h3>
                        <div className="flex gap-1.5 md:gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {TIME_RANGES.map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => setSelectedRange(range)}
                                    className={`
                                        px-2 py-1 md:px-4 md:py-2
                                        rounded-lg
                                        border
                                        font-semibold
                                        text-[10px] md:text-sm
                                        whitespace-nowrap
                                        cursor-pointer
                                        backdrop-blur-md
                                        transition-all duration-300 ease-in-out
                                        hover:border-white/20
                                        shrink-0
                                        ${selectedRange.label === range.label
                                            ? "bg-[#add8e6] text-[#010203] border-transparent shadow-lg shadow-[#add8e6]/30"
                                            : "border-white/10 bg-white/5 text-[#e0e0e0] hover:bg-white/10"
                                        }
                                    `}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full h-[300px] md:h-[400px] overflow-x-auto">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: isMobile ? 5 : 10,
                                    left: isMobile ? -10 : 0,
                                    bottom: isMobile ? 60 : 20
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255, 255, 255, 0.1)"
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#9ca3af"
                                    angle={isMobile ? -45 : 0}
                                    textAnchor={isMobile ? "end" : "middle"}
                                    height={isMobile ? 80 : 60}
                                    interval={isMobile ? "preserveStartEnd" : "preserveStartEnd"}
                                    tick={{ fill: "#9ca3af", fontSize: isMobile ? 8 : 10 }}
                                    style={{ fontSize: isMobile ? "8px" : "10px" }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    domain={["auto", "auto"]}
                                    width={isMobile ? 50 : 60}
                                    tick={{ fill: "#9ca3af", fontSize: isMobile ? 8 : 10 }}
                                    style={{ fontSize: isMobile ? "8px" : "10px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(20, 20, 40, 0.95)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "8px",
                                        color: "#e0e0e0",
                                        fontSize: isMobile ? "12px" : "14px",
                                        padding: "8px",
                                    }}
                                    labelStyle={{
                                        fontSize: isMobile ? "10px" : "12px",
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#ADD8E6"
                                    strokeWidth={isMobile ? 1.5 : 2}
                                    dot={false}
                                    activeDot={{ r: isMobile ? 4 : 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
                >
                    <div className="
                        flex
                        flex-col
                        bg-[rgba(255, 255, 255, 0.03)]
                        backdrop-blur-20
                        rounded-16
                        p-4 md:p-6
                        gap-2
                        border
                        border-solid
                        border-[rgba(255, 255, 255, 0.1)]
                        ">
                        <span className="text-sm text-[#9ca3af] font-semibold uppercase">Market Cap</span>
                        <span className="text-2xl text-[#e0e0e0] font-bold">
                            ${formatMarketCap(coin.market_data.market_cap.usd)}
                        </span>
                    </div>

                    <div className="
                        flex
                        flex-col
                        bg-[rgba(255, 255, 255, 0.03)]
                        backdrop-blur-20
                        rounded-16
                        p-4 md:p-6
                        gap-2
                        border
                        border-solid
                        border-[rgba(255, 255, 255, 0.1)]
                        ">
                        <span className="text-sm text-[#9ca3af] font-semibold uppercase">Volume (24)</span>
                        <span className="text-2xl text-[#e0e0e0] font-bold">
                            ${formatMarketCap(coin.market_data.total_volume.usd)}
                        </span>
                    </div>

                    <div className="
                        flex
                        flex-col
                        bg-[rgba(255, 255, 255, 0.03)]
                        backdrop-blur-20
                        rounded-16
                        p-4 md:p-6
                        gap-2
                        border
                        border-solid
                        border-[rgba(255, 255, 255, 0.1)]
                    ">
                        <span className="text-sm text-[#9ca3af] font-semibold uppercase">Circulating Supply</span>
                        <span className="text-2xl text-[#e0e0e0] font-bold">
                            {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
                        </span>
                    </div>

                    <div className="
                        flex
                        flex-col
                        bg-[rgba(255, 255, 255, 0.03)]
                        backdrop-blur-20
                        rounded-16
                        p-4 md:p-6
                        gap-2
                        border
                        border-solid
                        border-[rgba(255, 255, 255, 0.1)]
                        ">
                        <span className="text-sm text-[#9ca3af] font-semibold uppercase">Total Supply</span>
                        <span className="text-2xl text-[#e0e0e0] font-bold">
                            {coin.market_data.total_supply?.toLocaleString() || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
            <CryptoFooter />
        </div>
    );
};