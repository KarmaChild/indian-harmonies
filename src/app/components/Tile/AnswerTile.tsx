import React from "react";

interface AnswerTileProps {
    category: string
    items: string[]
}

export const AnswerTile:React.FC<AnswerTileProps> = ({category, items}) => {
    return (
        <div className="bg-ios-blue w-[390px] h-[90px] rounded">
            <p>{category}</p>
            <p>{items}</p>
        </div>
    )
}
