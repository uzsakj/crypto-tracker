import { Link } from "react-router";
import { formatPrice, formatMarketCap } from "../utils/formatter";

export const CryptoCard = ({ crypto }) => {
    return (
        <Link to={`/coin/${crypto.id}`} style={{ textDecoration: "none" }}>
            <div className="
            relative
            before:block
            before:content-['']
            before:absolute
            before:top-0
            before:left-0
            before:right-0
            before:h-px
            before:opacity-0
            before:bg-[linear-gradient(90deg,transparent,rgba(173,216,230,0.5),transparent)]
            before:transition-opacity
            before:duration-300
            hover:before:opacity-100
            bg-[rgba(255, 255, 255, 0.03)]
            bg-[rgba(255,255,255,0.05)]
            backdrop-blur-[20px]
            rounded-[20px]
            p-6
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            border
            border-solid
            border-[rgba(255, 255, 255, 0.1)]
            transition all ease-in-out duration-300
            hover:-translate-y-2
            hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
            hover:border-[rgba(173,216,230,0.3)]
            hover:bg-[rgba(255,255,255,0.05)]
            cursor-pointer
            overflow-hidden
            no-underline">
                <div className="
                flex
                justify-between
                items-start
                mb-4">
                    <div className="
                    flex
                    items-center
                    gap-4">
                        <img src={crypto.image} alt={crypto.name} className="w-12.5 h-12.5 rounded-[50%] border-solid border-2 border-[rgba(255, 255, 255, 0.1)] " />
                        <div>
                            <h3 className=" text-xl text-[#e0e0e0] mb-1 font-medium">{crypto.name}</h3>
                            <p className="text-[#9ca3af] text-sm font-medium">{crypto.symbol.toUpperCase()}</p>
                            <span className="inline-block bg-[#add8e6] text-[#010203] p-1 rounded-[20px] text-xs font-bold mt-3 shadow-[0_4px_10px_rgba(173,216,230,0.3)]">#{crypto.market_cap_rank}</span>
                        </div>
                    </div>
                </div>

                <div className="my-7 mx-0">
                    <p className="text-3xl font-bold text-white mb-2">{formatPrice(crypto.current_price)}</p>
                    <p
                        className={`inline-block
                            text-[1.1rem]
                            font-semibold
                            px-4 py-2
                            rounded-lg
                            border
                            ${crypto.price_change_percentage_24h >= 0
                                ? "bg-[rgba(46,213,115,0.15)] text-[#2ed573] border-[rgba(46,213,115,0.3)]"
                                : "bg-[rgba(255,71,87,0.15)] text-[#ff4757] border-[rgba(255,71,87,0.3)]"
                            }
                        `}
                    >
                        {Math.round(crypto.price_change_percentage_24h).toFixed(2)}%
                    </p>

                </div>

                <div className="flex justify-between gap-4 pt-4 border-t-4 border-solid border border-[rgba(255, 255, 255, 0.1)]">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase">Market Cap</span>
                        <span className=" text-[#e0e0e0] font-bold">
                            ${formatMarketCap(crypto.market_cap)}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase">Volume</span>
                        <span className="text-[#e0e0e0] font-bold">
                            ${formatMarketCap(crypto.total_volume)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};