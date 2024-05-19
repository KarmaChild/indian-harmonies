'use client'

import React from "react";

interface SubmitButtonProps {
    onClick: () => void,
}

export const SubmitButton:React.FC<SubmitButtonProps> = ({onClick}) => {
    return (
        <button className="w-[115px] h-[40px] bg-ios-blue rounded-[20px] hover-bg-ios-blue"
                onClick={onClick}
        >
            Submit
        </button>
    )
}
