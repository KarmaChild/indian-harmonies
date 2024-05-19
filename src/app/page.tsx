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

const ANSWER_COLOR = ['bg-answer-green', 'bg-answer-orange', 'bg-answer-blue', 'bg-answer-red']

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
    const _group3 = {
        "Rajinikanth Movies": ["Baasha", "Muthu", "Padayappa", "Enthiran"],
        "Kamal Haasan Movies": ["Vikram", "Virumandi", "Vishwaroopam", "Hey Ram"],
        "Telugu Blockbusters": ["Baahubali", "RRR", "Pokiri", "Magadheera"],
        "Malayalam Classics": ["Vandanam", "Kireedam", "Maheshinte Prathikaram", "Big B"],
    }

    const _group4 = {
        "Kannada Hits": ["Kirik Party", "Ulidavaru Kandanthe", "Mungaru Male", "Upendra"],
        "Tamil Classics": ["Nayakan", "Mouna Ragam", "Alaipayuthey", "Anbe Sivam"],
        "Telugu Cult Favorites": ["Arjun Reddy", "Pellichoopulu", "Jalsa", "Godavari"],
        "Malayalam Gems": ["Bangalore Days", "Premam", "Angamaly Diaries", "Kumbalangi Nights"],
    }

    const _group5 = {
        "Malayalam Superhits": ["Kumbalangi Nights", "Maheshinte Prathikaaram", "Jallikkattu", "Angamaly Diaries"],
        "Telugu Cult Movies": ["Pelli Choopulu", "C/o Kancharapalem", "Ee Nagaraniki Emaindi", "Fida"],
        "Tamil Classics": ["Virumaandi", "Kannathil Muthamittal", "Anniyan", "Paruthiveeran"],
        "Bollywood Classics": ["Dilwale Dulhania Le Jayenge", "3 Idiots", "Lagaan", "Hera Pheri"]
    }


        const transformAndShuffleGroup = (group: Group) => {
        const transformedGroup = Object.entries(group).flatMap(([category, labels]) =>
            labels.map(label => ({ category, label }))
        )
        return shuffleArray(transformedGroup);
    }

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    const [group, setGroup] = useState(transformAndShuffleGroup(_group5))
    const [selection, setSelection] = useState<SelectionItem[]>([])
    const [log, setLog] = useState('')
    const [correctAnswers, setCorrectAnswers] = useState<SelectionItem[][]>([])
    const [chances, setChances] = useState(4)

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

    const verifySelectionItemsCategory = () => {
        if (selection.length < 4) return false
        const firstCategory = selection[0].category
        return selection.every(item => item.category === firstCategory)
    }

    const handleSubmit = () => {
        if (chances > 0 && verifySelectionItemsCategory()) {
            const category = selection[0].category;
            const labels = selection.map(item => item.label).join(", ");
            setLog(`${category} - ${labels}`)
            // Remove selected items from group
            const updatedGroup = group.filter(
                groupItem => !selection.some(selectionItem => selectionItem.label === groupItem.label)
            )
            setGroup(updatedGroup)
            setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, selection])
            // Clear selection
            setSelection([])
        } else {
            setLog("Selected items are from different categories.")
            setChances(chances - 1)
        }
    }

    const renderAnswerTiles = () => {
        return (
            correctAnswers.length > 0 ? (
                <div>
                    {
                        correctAnswers.map((answerGroup, index) => (
                            <AnswerTile
                                key={index}
                                category={answerGroup[0].category}
                                items={answerGroup.map(item => item.label)}
                                color={ANSWER_COLOR[index % ANSWER_COLOR.length]}
                            />
                        ))}
                </div>
            ) : (
                <></>
            )

        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="absolute top-[100px] w-[390px] h-[400px]">
                {renderAnswerTiles()}
                <div className="grid grid-cols-4 gap-4">
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
                {
                    chances > 0 ? (
                        <p>{`Chances left: ${chances}`}</p>
                    ) : (
                        <p className=" w-full flex justify-center text-red-600">Game over</p>
                    )
                }
                <div className="w-full flex justify-center mt-1">
                    <SubmitButton onClick={handleSubmit} disabled={chances <= 0}/>
                </div>
            </div>
        </main>
    )
}
