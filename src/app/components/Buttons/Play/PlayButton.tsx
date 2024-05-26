'use client'

import React from "react";

interface SubmitButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const PlayButton:React.FC<SubmitButtonProps> = ({onClick, disabled}) => {
    return (
        <button className="w-[90px] h-[35px] bg-ios-blue rounded-[20px] hover-bg-ios-blue"
                onClick={onClick}
                disabled={disabled}
        >
            Play
        </button>
    )
}
