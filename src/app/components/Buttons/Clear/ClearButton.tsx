import Image from "next/image";
import React, {useState} from "react";

interface ClearButton {
    onClick: () => void
}

export const ClearButton:React.FC<ClearButton> = ({onClick}) => {
    const [isOnHover, setIsOnHover] = useState(false);

    return (
        <button className="flex"
                onClick={onClick}
                onMouseEnter={() => setIsOnHover(true)}
                onMouseLeave={() => setIsOnHover(false)}
        >
            {
                !isOnHover ? (
                    <div className="flex">
                        <p className="">Clear</p>
                        <Image
                            className="mt-1 ml-1"
                            src={'/clear.svg'}
                            width={17}
                            height={17}
                            alt={''}/>
                    </div>
                ) : (
                    <div className="flex">
                        <p className="text-grey">Clear</p>
                        <Image
                            className="mt-1 ml-1"
                            src={'/clear-hover.svg'}
                            width={17}
                            height={17}
                            alt={''}/>
                    </div>
                )
            }
        </button>
    )
}
