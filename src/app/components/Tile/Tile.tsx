'use client'
import React from "react"

interface Tile {
    category: string
    label: string
    selected: boolean
    onClick: () => void
    alertWrong: boolean
}


export const Tile:React.FC<Tile> = ({ label, selected, onClick, alertWrong}) => {
    const isLongLabel = label.length > 10

    return (
        <button className={`
        ${selected ? 'bg-gray-400' : 'bg-white hover-bg-grey'} 
        w-[90px] h-[90px] flex items-center justify-center rounded
        ${alertWrong && 'border-2 border-red-600'}
        transition duration-200 ease-in-out
        `}
                onClick={onClick}
        >
            <p className={`font-medium text-center ${isLongLabel ? 'text-xs' : 'text-sm'} text-black`}>
                {label}
            </p>
        </button>
    )
}
