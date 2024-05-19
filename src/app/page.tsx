'use client'
import { Tile } from "@/app/components/Tile/Tile"
import { SubmitButton } from "@/app/components/Submit/SubmitButton"
import { useState } from "react"
import { AnswerTile } from "@/app/components/Tile/AnswerTile"

interface SelectionItem {
    category: string
    label: string
}

interface Group {
    [key: string]: string[];
}


export default function Home() {
    const _group1 = {
        "Vijay Movies": ["Kaavalan", "Mersal", "Leo", "Ghili"],
        "Movies with Anirudh soundtrack": ["Kathi", "3", "Vikram", "Jawan"],
        "Multipart Movies": ["K.G.F", "Bahubali", "ABCD", "Dhrishyam"],
        "Movies without a Heroine": ["Kaithi", "Aavesham", "Manjummel Boys", "Bramayugam"]
    }

    const _group2 = {
        "Female lead movies": ["English Vinglish", "Netrikann", "36 Vayathinil", "Captain Marvel"],
        "Horror Movies": ["Chandramukhi", "Muni", "Romancham", "Saw"],
        "Stranded Movies": ["Life of Pi", "Peranmay", "Old", "Manjummel Boys"],
        "Movies where the heroine dies": ["Raja Rani", "The Amazing Spider-man", "Ghajini", "Vaaranam Aayiram"]
    }

    //transform in the server maybe
    const transformAndShuffleGroup = (group: Group) => {
        const transformedGroup = Object.entries(group).flatMap(([category, labels]) =>
            labels.map(label => ({ category, label }))
        )
        return shuffleArray(transformedGroup);
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    const [group, setGroup] = useState(transformAndShuffleGroup(_group2))
    const [selection, setSelection] = useState<SelectionItem[]>([])
    const [log, setLog] = useState('')

    const handleTileClick = (category: string, label: string) => {
        setSelection(prevSelection => {
            const exists = prevSelection.find(item => item.label === label)
            if (exists) {
                return prevSelection.filter(item => item.label !== label)
            } else if (prevSelection.length < 4) {
                return [...prevSelection, { category, label }]
            }
            return prevSelection
        })
    }

    console.log(selection)

    const verifySelectionItemsCategory = () => {
        if (selection.length < 4) return false
        const firstCategory = selection[0].category
        return selection.every(item => item.category === firstCategory)
    }

    const handleSubmit = () => {
        if (verifySelectionItemsCategory()) {
            const category = selection[0].category;
            const labels = selection.map(item => item.label).join(", ");
            setLog(`${category} - ${labels}`)
            // Remove selected items from group
            const updatedGroup = group.filter(
                groupItem => !selection.some(selectionItem => selectionItem.label === groupItem.label)
            )
            setGroup(updatedGroup)

            // Clear selection
            setSelection([])
        } else {
            setLog("Selected items are from different categories.")
            // Add your logic for incorrect selection here
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="absolute top-[100px] w-[390px] h-[400px]">
                <div className="grid grid-cols-4 gap-4">
                    {/*<AnswerTile category={'vijay movies '} items={[]}/>*/}
                    {group.map(({category, label}, index) => (
                        <Tile
                            key={`${category}-${index}`}
                            label={label}
                            category={category}
                            selected={selection.some(selectionItem => selectionItem.label === label)}
                            onClick={() => handleTileClick(category, label)}
                        />
                    ))}
                </div>
                <p className="w-full">{log}</p>
                <div className="w-full flex justify-center mt-4">
                    <SubmitButton onClick={handleSubmit}/>
                </div>
            </div>
        </main>
    )
}
