import { useMemo, useState } from "react";
import { useGetCryptosQuery } from "../store/coinGeckoApi";
import { CryptoCard } from "../components/CryptoCard";
import { CryptoHeader } from "../components/CryptoHeader";
import { useDebounce } from "../hooks/useDebounce";
import { CryptoFooter } from "../components/CryptoFooter";
export const Home = () => {
    const { data: cryptoList = [], isLoading, error } = useGetCryptosQuery(undefined, {
        pollingInterval: 30000, // Poll every 30 seconds
    });
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("market_cap_rank");
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchQuery = useDebounce(searchInput, 500);

    const filteredList = useMemo(() => {
        let filtered = cryptoList.filter(
            (crypto) =>
                crypto.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
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
    }, [cryptoList, debouncedSearchQuery, sortBy]);
    return (
        <div className="flex flex-col m-0 min-h-screen min-w-[320px] bg-[#010203] p-0">
            <CryptoHeader searchQuery={searchInput} setSearchQuery={setSearchInput} />

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
                <div className="flex flex-row justify-center items-center gap-4 ">
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
                <div className="flex justify-center pt-3 gap-3 gap-x-6   bg-[rgba(255, 255, 255, 0.05)] text-[#0e0e0e] font-medium cursor-pointer backdrop-blur-md transition-all duration-300 ease-in-out">
                    <button
                        className={`
                        min-w-20
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
                        min-w-20
                        px-6 py-3 rounded-lg
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
                <div className="flex flex-col flex-1 items-center justify-center px-16 py-8 text-[#e0e0e0] gap-4">
                    <div className="w-12.5 h-12.5 border-4 border-solid border-[rgba(173, 216, 230, 0.2)] border-t-[#add8e6] rounded-full animate-spin " />
                    <p className="text-[1.1rem] font-medium">Loading crypto data...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col flex-1 items-center justify-center px-16 py-8 text-[#e0e0e0] gap-4">
                    <p className="text-[1.1rem] font-medium text-red-500">Error loading crypto data. Please try again later.</p>
                </div>
            ) : (
                <div className={`max-w-350 mx-auto p-8 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}`}>
                    {filteredList.map((crypto) => (
                        <CryptoCard crypto={crypto} key={crypto.id} />
                    ))}
                </div>
            )}
            <CryptoFooter />

        </div>
    );
};