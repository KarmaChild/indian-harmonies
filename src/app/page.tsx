'use client'
import {Tile} from "@/app/components/Tile/Tile"
import {SubmitButton} from "@/app/components/Submit/SubmitButton"
import {useState} from "react"


export default function Home() {
    const group = {
            "Vijay Movies": ["Kaavalan", "Mersal", "Leo", "Ghili"],
            "Movies with Anirudh soundtrack": ["Kathi", "3", "Vikram", "Jawan"],
            "Multipart Movies": ["K.G.F", "Bahubali", "ABCD", "Dhrishyam"],
            "Movies without a Heroine": ["Kaithi", "Aavesham", "Manjummel Boys", "Bramayugam"]
    }

    const [selection, setSelection] = useState<string[]>([])

    const handleTileClick = (label: string) => {
        setSelection(prevSelection => {
            if (prevSelection.includes(label)) {
                return prevSelection.filter(item => item !== label)
            } else if (prevSelection.length < 4) {
                return [...prevSelection, label]
            }
            return prevSelection
        })
    }
    console.log(selection)
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="absolute top-[100px] w-[390px] h-[400]">
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(group).map(([category, items]) => (
                    items.map((item, index) => (
                        <Tile key={`${category}-${index}`}
                              label={item} category={category}
                              selected={selection.includes(item)}
                              onClick={() => handleTileClick(item)}
                        />
                    ))
                ))}
            </div>
            <div className="w-full flex justify-center mt-4">
                <SubmitButton/>
            </div>
        </div>
    </main>
)
}
