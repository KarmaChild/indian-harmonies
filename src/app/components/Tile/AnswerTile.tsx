import React from "react";

interface AnswerTileProps {
    category: string
    items: string[]
    color: string
}

export const AnswerTile:React.FC<AnswerTileProps> = ({category, items, color}) => {
    return (
        <div className={`${color} relative w-[395px] h-[90px] rounded mb-4`}>
            <p className="absolute w-full flex justify-center top-[18px] text-black font-bold text-20">
                {category}
            </p>
            <p className="absolute w-full flex justify-center top-[50px] text-black font-medium text-12">
                {items.join(', ')}
            </p>
        </div>
    )
}
