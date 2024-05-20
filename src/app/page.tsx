'use client'
import { Tile } from "@/app/components/Tile/Tile"
import { SubmitButton } from "@/app/components/Buttons/Submit/SubmitButton"
import {useEffect, useState} from "react"
import { AnswerTile } from "@/app/components/Tile/AnswerTile"
import {ClearButton} from "@/app/components/Buttons/Clear/ClearButton"
import {getGroup} from "@/api/get-group"
import Loading from "@/app/loading";
import Image from "next/image";

interface Item {
    category: string
    label: string
}

const ANSWER_COLOR = ['bg-answer-green', 'bg-answer-orange', 'bg-answer-blue', 'bg-answer-red']

export default function Home() {

    const day = '18-05-2024'
    useEffect(() => {
        if(day){
            getGroup(day)
                .then((res: any) => {
                    console.log(res)
                    setGroup(res)
                })
                .catch(
                    error => {
                        console.error("Error fetching group information:", error)
                    })
                .finally(() => {
                        setLoading(false)
                    }
                )
        }
    }, [day])

    const [loading, setLoading] = useState<boolean>(true)
    const [group, setGroup] = useState<Item[]>([])
    const [selection, setSelection] = useState<Item[]>([])
    const [correctAnswers, setCorrectAnswers] = useState<Item[][]>([])
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

    useEffect(() => {
        if (chances <= 0){
            const remainingAnswers = extractRemainingItemsFromGroup()
            setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, ...remainingAnswers])
        }
    }, [chances])

    const extractRemainingItemsFromGroup = () => {
        const remainingItems: { [key: number]: Item[] } = {}

        group.forEach((item: any) => {
            const itemCategory = item.category
            if (!remainingItems[itemCategory]) {
                remainingItems[itemCategory] = []
            }
            remainingItems[itemCategory].push(item)
        })
        return Object.values(remainingItems)
    }

    const verifyItemsCategory = () => {
        if (selection.length < 4) return false
        const firstCategory = selection[0].category
        return selection.every(item => item.category === firstCategory)
    }

    const handleSubmit = () => {
        if (chances > 0 && verifyItemsCategory()) {
            // Remove selected items from group
            const updatedGroup = group.filter(
                groupItem => !selection.some(Item => Item.label === groupItem.label)
            )
            setGroup(updatedGroup)
            setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, selection])
            // Clear selection
            setSelection([])
        } else {
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
            <div className="absolute top-4 flex">
                <Image
                    src={'/clapperboard.svg'}
                    alt={''} width={50}
                    height={50} />
            </div>
            {
                loading ? (
                    <>
                        <Loading/>
                    </>
                ) : (
                    <div className="absolute top-[100px] w-[390px] h-[400px]">
                        {
                            chances <= 0 ? (
                                renderAnswerTiles()
                            ) : (
                                <>
                                    {renderAnswerTiles()}
                                    <div className="grid grid-cols-4 gap-4">
                                        {group.map(({category, label}, index) => (
                                            <Tile
                                                key={`${category}-${index}`}
                                                label={label}
                                                category={category}
                                                selected={selection.some(Item => Item.label === label)}
                                                onClick={() => handleTileClick(category, label)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )
                        }

                        <div className="flex">
                            {
                                chances > 0 ? (
                                    <p>{`Chances left: ${chances}`}</p>
                                ) : (
                                    <p className=" w-full flex justify-center text-red-600">Game over</p>
                                )
                            }
                            <div className="absolute right-0">
                                <ClearButton onClick={() => setSelection([])}/>
                            </div>
                        </div>
                        <div className="w-full flex justify-center mt-1">
                            <SubmitButton onClick={handleSubmit} disabled={chances <= 0}/>
                        </div>
                    </div>
                )
            }
        </main>
    )
}
