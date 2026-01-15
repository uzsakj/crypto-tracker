import { useState, useEffect, useRef } from 'react';

export const CryptoHeader = ({ searchQuery, setSearchQuery, children }) => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`
            sticky
            w-full
            backdrop-blur-20
            bg-linear-to-b from-[rgba(20,20,40,0.95)] to-[rgba(20,20,40,0.3)]
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            top-0 z-100
            border-b border border-solid border-[rgba(255, 255, 255, 0.1)]
            transition-transform duration-300
            ${isVisible ? 'translate-y-0' : '-translate-y-full'}
            `}>
            <div className=" flex flex-wrap max-w-360 mx-auto my-auto p-4 justify-between items-center gap-4 md:gap-8 ">
                <div className="">
                    <h1 className="text-2xl md:text-4xl bg-[#add8e6] bg-clip-text text-transparent mb-1 md:mb-2 font-bold" >Crypto Tracker</h1>
                    <p className="text-[#a0a0b0] text-sm md:text-base">Real-time cryptocurrency prices and market data</p>
                </div>
                <div className="flex-1 max-w-125 flex justify-center md:justify-end">
                    {searchQuery !== undefined ? (
                        <input
                            type="text"
                            placeholder="Search cryptos..."
                            className="
                            h-10
                            bg-[rgba(255,255,255,0.05)]
                            rounded-2xl
                            px-4
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
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    )
}
