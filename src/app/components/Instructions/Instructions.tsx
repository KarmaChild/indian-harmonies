import ReactModal from 'react-modal'
import React from "react"
import {PlayButton} from "@/app/components/Buttons/Play/PlayButton"
import Image from "next/image"

interface InstructionsProps {
    isOpen: boolean
    onClose: () => void
}

export const Instructions:React.FC<InstructionsProps> = ({isOpen, onClose}) => {
    return (
        <ReactModal
            isOpen={isOpen}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(5px)',
                },
                content: {
                    backgroundColor: '#f2f2f2',
                    width: '345px',
                    height: '540px',
                    margin: 'auto',
                    inset: '0',
                    borderRadius: '5px',
                }
            }}
        >
            <div className="relative">
                <Image
                    className="absolute top-0 right-0 cursor-pointer"
                    src={'/x.svg'}
                    alt={'X'}
                    width={25}
                    height={25}
                    onClick={onClose}
                />
                <p className="absolute top-[0px] font-bold text-20 text-black">
                    How to Play
                </p>
                <p className="absolute top-[33px] font-regular text-12 text-black">
                    Find four squares with a common theme. All are related to movies!
                </p>
                <img
                    className="absolute top-[85px] w-full justify-center"
                    src={'/example.png'}
                    alt={'example'}
                    width={280}
                    height={280}
                />
                <p className="absolute top-[410px] font-regular text-12 text-black">
                    Each board has just one correct solution. Keep an eye out for squares that could fit more than one category.
                </p>
                <div className="absolute top-[470px] flex w-full justify-center">
                    <PlayButton onClick={onClose}/>
                </div>
            </div>
        </ReactModal>
    )
}
