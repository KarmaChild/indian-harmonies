'use client'

import React from "react";
import Image from "next/image";

interface PlayAgainButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const PlayAgain:React.FC<PlayAgainButtonProps> = ({onClick, disabled}) => {
    return (
        <button className="w-[125px] h-[40px] bg-purple-800 rounded-[20px] hover:bg-purple-600 flex items-center justify-center"
                onClick={onClick}
                disabled={disabled}
        >
            Play Again
            <Image
                className={"ml-1"}
                src={'/playagain.svg'}
                width={17}
                height={17}
                alt={''}
            />
        </button>
    )
}
