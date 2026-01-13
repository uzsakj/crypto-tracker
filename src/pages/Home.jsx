import { useEffect, useState, useCallback } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";
export const Home = () => {
    const [cryptoList, setCryptoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("market_cap_rank");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const interval = setInterval(fetchCryptoData, 3000);

        return () => clearInterval(interval);
    }, []);



    const fetchCryptoData = async () => {
        try {
            const data = await fetchCryptos();
            setCryptoList(data);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSort = useCallback(() => {
        let filtered = cryptoList.filter(
            (crypto) =>
                crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "price":
                    return a.current_price - b.current_price;
                case "price_desc":
                    return b.current_price - a.current_price;
                case "change":
                    return a.price_change_percentage_24h - b.price_change_percentage_24h;
                case "market_cap":
                    return a.market_cap - b.market_cap;
                default:
                    return a.market_cap_rank - b.market_cap_rank;
            }
        });

        setFilteredList(filtered);
    }, [cryptoList, searchQuery, sortBy]);


    useEffect(() => {
        filterAndSort();
    }, [filterAndSort]);
    return (
        <div className=" place-items-center m-0 min-h-full min-w-[320px] bg-[#010203] p-0">
            <header className="
            sticky
            w-3/4
            backdrop-blur-20
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            p-8
            top-0 z-100
            border-b border border-solid border-[rgba(255, 255, 255, 0.1)]
            ">
                <div className=" flex flex-wrap max-w-360 mx-0 my-auto px-0 py-8 justify-between items-center gap-8 ">
                    <div className="">
                        <h1 className="text-4xl bg-[#add8e6] bg-clip-text text-transparent mb-2 font-bold" >🚀 Crypto Tracker</h1>
                        <p className="text-[#a0a0b0] text-base">Real-time cryptocurrency prices and market data</p>
                    </div>
                    <div className="flex-1 max-w-125">
                        <input
                            type="text"
                            placeholder="Search cryptos..."
                            className="
                            placeholder:text-[#6b6b7a]
                            focus:outline-none
                            focus:border-[#add8e6]
                            focus:ring-4
                            focus:ring-[#add8e6]/20
                            focus:bg-white/10
                            "
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                </div>
            </header>
            <div className="
                max-w-350
                w-full
                flex
                mx-auto
                my-auto
                px-8
                justify-between
                items-center
                flex-wrap
                gap-4
                md:flex-row
                md:items-center
                max-md:flex-col
                max-md:items-stretch
            ">
                <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
                    <label className="text-[#e0e0e0] font-medium">Sort by:</label>
                    <select
                        className="
                        px-5 py-3
                        rounded-lg
                        border border-white/10
                        bg-white/5
                        text-white
                        text-[0.95rem]
                        cursor-pointer
                        backdrop-blur-md
                        transition-all duration-300 ease-in-out
                        appearance-none
                        hover:bg-white/10
                        focus:outline-none
                        focus:border-[#add8e6]
                        focus:ring-4
                        focus:ring-[#add8e6]/20
                        "
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="market_cap_rank">Rank</option>
                        <option value="name">Name</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="price_desc">Price (High to Low)</option>
                        <option value="change">24h Change</option>
                        <option value="market_cap">Market Cap</option>
                    </select>
                </div>
                <div className="flex gap-3 gap-x-6 border-2 border-solid border-[rgba((255, 255, 255, 0.1)] border-8 bg-[rgba(255, 255, 255, 0.05)] text-[#0e0e0e] font-medium cursor-pointer backdrop-blur-md transition-all duration-300 ease-in-out">
                    <button
                        className={`
                        px-3 py-6 rounded-lg
                        border
                        font-semibold
                        cursor-pointer
                        backdrop-blur-md
                        transition-all duration-300 ease-in-out
                        hover:border-white/20
                        ${viewMode === "grid"
                                ? "bg-[#add8e6] text-[#010203] border-transparent shadow-lg shadow-[#add8e6]/30"
                                : "border-white/10 bg-white/5 text-[#e0e0e0] hover:bg-white/10"
                            }
                    `}
                        onClick={() => setViewMode("grid")}
                    >
                        Grid
                    </button>
                    <button
                        className={`
                        px-6 py-3
                        rounded-lg
                        border
                        font-semibold
                        cursor-pointer
                        backdrop-blur-md
                        transition-all duration-300 ease-in-out
                        hover:border-white/20
                        ${viewMode === "list"
                                ? "bg-[#add8e6] text-[#010203] border-transparent shadow-lg shadow-[#add8e6]/30"
                                : "border-white/10 bg-white/5 text-[#e0e0e0] hover:bg-white/10"
                            }
                    `}
                        onClick={() => setViewMode("list")}
                    >
                        List
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center px-16 py-8 text-[#e0e0e0] gap-4">
                    <div className="w-12.5 h-12.5 border-4 border-solid border-[rgba(173, 216, 230, 0.2)] border-t-[#add8e6] rounded-full animate-spin " />
                    <p className="text-[1.1rem] font-medium">Loading crypto data...</p>
                </div>
            ) : (
                <div className={`max-w-350 mx-auto p-8 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}`}>
                    {filteredList.map((crypto) => (
                        <CryptoCard crypto={crypto} key={crypto.id} />
                    ))}
                </div>
            )}

            <footer className="bg-[rgba(20,20,40,0.4)] backdrop-blur-xl p-8 text-center mt-12 border-t border-white/10">
                <p className="text-[#9ca3af] font-medium">
                    Data provided by CoinGecko API • Updated every 30 seconds
                </p>
            </footer>
        </div>
    );
};