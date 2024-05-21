'use client'
import { Tile } from "@/app/components/Tile/Tile"
import { SubmitButton } from "@/app/components/Buttons/Submit/SubmitButton"
import React, { useEffect, useState } from "react"
import { AnswerTile } from "@/app/components/Tile/AnswerTile"
import { ClearButton } from "@/app/components/Buttons/Clear/ClearButton"
import { getGroup } from "@/api/get-group"
import Loading from "@/app/loading";
import Image from "next/image";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

interface Item {
    category: string
    label: string
}

const ANSWER_COLOR = ['bg-answer-green', 'bg-answer-orange', 'bg-answer-blue', 'bg-answer-red']

export default function Home() {

    const day = '4'
    useEffect(() => {
        if (day) {
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

    const { width, height } = useWindowSize()
    const [loading, setLoading] = useState<boolean>(true)
    const [group, setGroup] = useState<Item[]>([])
    const [selection, setSelection] = useState<Item[]>([])
    const [correctAnswers, setCorrectAnswers] = useState<Item[][]>([])
    const [chances, setChances] = useState(4)
    const [guesses, setGuesses] = useState<Item[][]>([])
    const [alertWrongTiles, setAlertWrongTiles] = useState<string[]>([])

    const handleTileClick = (category: string, label: string) => {
        setSelection(prevSelection => {
            const exists = prevSelection.find(item => item.label === label)
            if (exists) {
                return prevSelection.filter(item => item.label !== label)
            } else if (prevSelection.length < 4) {
                return [...prevSelection, { category, label }]
            }
            return prevSelection
        });
        setAlertWrongTiles([])
    }

    useEffect(() => {
        if (chances <= 0) {
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

    const itemsAreCorrect = () => {
        if (selection.length < 4) return false
        const firstCategory = selection[0].category
        return selection.every(item => item.category === firstCategory)
    }

    const handleSubmit = () => {
        if (chances > 0) {
            if (itemsAreCorrect()) {
                const updatedGroup = group.filter(
                    groupItem => !selection.some(item => item.label === groupItem.label)
                )
                setGroup(updatedGroup)
                setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, selection])
                setGuesses(prevGuesses => [...prevGuesses, selection])
                setSelection([])
                setAlertWrongTiles([])
            } else if (guesses.some(guess => JSON.stringify(guess) === JSON.stringify(selection))) {
                setAlertWrongTiles(selection.map(item => item.label))
            } else {
                setGuesses(prevGuesses => [...prevGuesses, selection])
                setChances(chances - 1)
                setAlertWrongTiles(selection.map(item => item.label))
            }
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

    const renderConfetti = () => {
        return (
            <Confetti
                width={width}
                height={height}
            />
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
                        <Loading />
                    </>
                ) : (
                    <div className="absolute top-[100px] w-[390px] h-[400px] mr-1">
                        {
                            chances <= 0 ? (
                                renderAnswerTiles()
                            ) : (
                                <>
                                    {renderAnswerTiles()}
                                    <div className="grid grid-cols-4 gap-4">
                                        {group.map(({ category, label }, index) => (
                                            <Tile
                                                key={`${category}-${index}`}
                                                label={label}
                                                category={category}
                                                selected={selection.some(item => item.label === label)}
                                                onClick={() => handleTileClick(category, label)}
                                                alertWrong={alertWrongTiles.includes(label)}  // Set alertWrong based on the state
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
                                    <p className="w-full flex justify-center text-red-600">Game over</p>
                                )
                            }
                            <div className="absolute right-0">
                                <ClearButton onClick={() => setSelection([])} />
                            </div>
                        </div>
                        <div className="w-full flex justify-center mt-1">
                            <SubmitButton onClick={handleSubmit} disabled={chances <= 0} />
                        </div>
                    </div>
                )
            }
            {
                chances > 0 && correctAnswers.length == 4 && (
                    renderConfetti()
                )
            }
        </main>
    )
}
