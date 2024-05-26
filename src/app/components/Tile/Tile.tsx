import React from "react"

interface TileProps {
    category: string
    label: string
    selected: boolean
    onClick: () => void
    alertWrong: boolean
}

export const Tile: React.FC<TileProps> = ({ label, selected, onClick, alertWrong }) => {
    const isLongLabel =  label.length > 10

    const breakLongWord = (text: string, maxLength: number) =>
        text.replace(new RegExp(`(\\S{${maxLength}})`, 'g'), '$1\u200B')

    const processedLabel = breakLongWord(label, 10)

    return (
        <button
            className={`
                ${selected ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} 
                w-[80px] h-[80px] sm:w-[90px] sm:h-[90px]
                flex items-center justify-center rounded
                ${alertWrong ? 'border-2 border-red-600' : ''}
                transition duration-200 ease-in-out
            `}
            onClick={onClick}
        >
            <p className={`font-medium text-center ${isLongLabel ? 'text-11' : 'text-14'} text-black break-words`}>
                {processedLabel}
            </p>
        </button>
    )
}
