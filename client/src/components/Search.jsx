import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [isMobile] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    }, [location])

    const redirectToSearchPage = () => {
        navigate("/search")
    }

    const handleOnChange = (e) => {
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

    return (
        <div className="relative w-full group">
            <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-green-500 transition-all duration-200">
                {/* Search Icon or Back Button */}
                <div className="flex-shrink-0 pl-4">
                    {(isMobile && isSearchPage) ? (
                        <Link
                            to="/"
                            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-green-600 transition-colors"
                        >
                            <FaArrowLeft size={18} />
                        </Link>
                    ) : (
                        <div className="flex items-center justify-center w-8 h-8 text-gray-400 group-focus-within:text-green-600 transition-colors">
                            <IoSearch size={20} />
                        </div>
                    )}
                </div>

                {/* Search Input Area */}
                <div className="flex-1 min-w-0">
                    {!isSearchPage ? (
                        // Not in search page - Show animated placeholder
                        <button
                            onClick={redirectToSearchPage}
                            className="w-full h-12 px-4 text-left text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                        >
                            <TypeAnimation
                                sequence={[
                                    'Search for calculators, electronics...',
                                    2000,
                                    'Search for bags, fashion items...',
                                    2000,
                                    'Search for mobile accessories...',
                                    2000,
                                    'Search for college essentials...',
                                    2000,
                                    'Search for gadgets and more...',
                                    2000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className="text-sm"
                            />
                        </button>
                    ) : (
                        // In search page - Show actual input
                        <input
                            type="text"
                            placeholder="Search for calculators, electronics, and more..."
                            autoFocus
                            defaultValue={searchText}
                            className="w-full h-12 px-4 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-sm"
                            onChange={handleOnChange}
                        />
                    )}
                </div>

                {/* Voice Search Button (Optional) */}
                {!isSearchPage && (
                    <div className="flex-shrink-0 pr-4">
                        <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-green-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Search Suggestions (Optional - can be expanded later) */}
            {isSearchPage && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-focus-within:block">
                    <div className="p-3">
                        <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
                        <div className="space-y-1">
                            {['Calculator', 'Mobile Case', 'Laptop Bag', 'Wireless Earbuds'].map((item, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                                    onClick={() => navigate(`/search?q=${item}`)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search
