import { useNavigate, useParams } from "react-router";
import { fetchChartData, fetchCoinData } from "../api/coinGecko";
import { useEffect, useState } from "react";
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

export const CoinDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCoinData();
        loadChartData();
    }, [id]);

    const loadCoinData = async () => {
        try {
            const data = await fetchCoinData(id);
            setCoin(data);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadChartData = async () => {
        try {
            const data = await fetchChartData(id);

            const formattedData = data.prices.map((price) => ({
                time: new Date(price[0]).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                price: price[1].toFixed(2),
            }));

            setChartData(formattedData);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        } finally {
            setIsLoading(false);
        }
    };

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

    if (!coin) {
        return (
            <div className="min-h-full bg-[#010203] p-0">
                <div className="text-center px-16 py-8 text-[#e0e0e0] text-xl ">
                    <p>Coin not found</p>
                    <button onClick={() => navigate("/")}>Go Back</button>
                </div>
            </div>
        );
    }

    const priceChange = coin.market_data.price_change_percentage_24h || 0;
    const isPositive = priceChange >= 0;
    return (
        <div className=" place-items-center m-0 min-h-full min-w-[320px] bg-[#010203] p-0">
            <CryptoHeader>
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
                    ">
                    ← Back to List
                </button>
            </CryptoHeader>

            <div className="max-w-350 w-full mx-auto my-auto p-8">
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-6">
                        <img className="w-16 h-16 rounded-full border-solid border-2 border-[rgba(173, 216, 230, 0.3)]" src={coin.image.large} alt={coin.name} />
                        <div>
                            <h1 className="text-4xl text-[#e0e0e0] mb-2">{coin.name}</h1>
                            <p className="text-[#9ca3af] text-base font-semibold">{coin.symbol.toUpperCase()}</p>
                        </div>
                    </div>
                    <span className="
                    inline-block
                    bg-[#add8e6]
                    text-[#010203]
                    px-2
                    py-4
                    rounded-20
                    text-[0.9rem]
                    dont-bold
                    shadow-[0_4px_10px_rgba(173,216,230,0.3)]]
                    ">Rank #{coin.market_data.market_cap_rank}</span>
                </div>

                <div className="
                bg-[rgba(255, 255, 255, 0.03)]
                backdrop-blur-20
                rounded-20
                p-8
                min-h-8
                border
                border-solid
                border-[rgba(255, 255, 255, 0.1)]
                ">
                    <div className="mb-6">
                        <h2 className="text-5xl text-white mb-2">{formatPrice(coin.market_data.current_price.usd)}</h2>
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

                <div className="bg-[][rgba(255, 255, 255, 0.03)] backdrop-blur-20 rounded-20 p-8 mb-8 border border-solid border-[rgba(255, 255, 255, 0.1)] ">
                    <h3 className="text-[#e0e0e0] mb-8 text-2xl">Price Chart (7 Days)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255, 255, 255, 0.1)"
                            />

                            <XAxis
                                dataKey="time"
                                stroke="#9ca3af"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: "12px" }}
                                domain={["auto", "auto"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(20, 20, 40, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#e0e0e0",
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#ADD8E6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div
                    className="grid gap-6 mb-8"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
                >
                    <div className="
                        flex
                        flex-col
                        bg-[rgba(255, 255, 255, 0.03)]
                        backdrop-blur-20
                        rounded-16
                        p-6
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
                        p-6
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
                        p-6
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
                        p-6
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