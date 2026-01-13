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
        <header className={`
            sticky
            w-full
            backdrop-blur-20
            bg-linear-to-b from-black/95 to-black/80
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            p-8
            top-0 z-100
            border-b border border-solid border-[rgba(255, 255, 255, 0.1)]
            transition-transform duration-300
            ${isVisible ? 'translate-y-0' : '-translate-y-full'}
            `}>
            <div className=" flex flex-wrap max-w-360 mx-0 my-auto px-0 py-8 justify-between items-center gap-8 ">
                <div className="">
                    <h1 className="text-4xl bg-[#add8e6] bg-clip-text text-transparent mb-2 font-bold" >🚀 Crypto Tracker</h1>
                    <p className="text-[#a0a0b0] text-base">Real-time cryptocurrency prices and market data</p>
                </div>
                <div className="flex-1 max-w-125 flex justify-end">
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
        </header>
    )
}
