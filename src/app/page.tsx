'use client'
import { Tile } from "@/app/components/Tile/Tile"
import { SubmitButton } from "@/app/components/Buttons/Submit/SubmitButton"
import React, { useEffect, useState } from "react"
import { AnswerTile } from "@/app/components/Tile/AnswerTile"
import { ClearButton } from "@/app/components/Buttons/Clear/ClearButton"
import { getGroup } from "@/api/get-group"
import Loading from "@/app/loading"
import Image from "next/image"
import { useWindowSize } from "react-use"
import Confetti from "react-confetti"
import toast, {Toaster} from "react-hot-toast"
import {ANSWER_COLOR} from "@/app/constants";
import {getFormattedDate} from "@/utils/DateTime";
import {addDateToLocalStorage, dateIsDone} from "@/utils/LocalStorage";
import {Instructions} from "@/app/components/Instructions/Instructions";

interface Item {
    category: string
    label: string
}

enum states {
    LOADING = 'loading',
    LOADED = 'loaded',
    COMPLETED = 'completed'
}

export default function Home() {
    const day = getFormattedDate()
    const { width, height } = useWindowSize()
    const [state,setState] =
        useState<states.LOADING | states.LOADED | states.COMPLETED | null>(states.LOADING)
    const [instructionsOpen, setInstructionsOpen] = useState(true)
    const [group, setGroup] = useState<Item[]>([])
    const [selection, setSelection] = useState<Item[]>([])
    const [correctAnswers, setCorrectAnswers] = useState<Item[][]>([])
    const [chances, setChances] = useState(4)
    const [guesses, setGuesses] = useState<Item[][]>([])
    const [alertWrongTiles, setAlertWrongTiles] = useState<string[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setState(dateIsDone(day) ? states.COMPLETED : states.LOADING)
        }
    }, [day])


    useEffect(() => {
        if (day) {
            getGroup(day)
                .then((res: any) => {
                    setGroup(res)
                })
                .catch(
                    error => {
                        console.error("Error fetching group information:", error)
                    })
                .finally(() => {
                        setState(states.LOADED)
                    }
                )
        }
    }, [day])

    useEffect(() => {
        if (chances <= 0) {
            const remainingAnswers = extractRemainingItemsFromGroup()
            setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, ...remainingAnswers])
            addDateToLocalStorage(day)
        }
    }, [chances])

    const handleCloseInstructions = () => {
        setInstructionsOpen(false)
    }

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
        setAlertWrongTiles([])
    }

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

    const arraysEqualIgnoringOrder = (a: Item[], b: Item[]): boolean => {
        if (a.length !== b.length) return false

        const labelsA = Array.from(a.map(item => item.label));
        const labelsB = Array.from(b.map(item => item.label));

        return labelsA.every(label => labelsB.includes(label))
    }

    const handleSubmit = () => {
        if (chances > 0) {
            if (selection.length < 4){
                renderToast("Select four items!")
            }
            else if (itemsAreCorrect()) {
                const updatedGroup = group.filter(
                    groupItem => !selection.some(item => item.label === groupItem.label)
                )
                setGroup(updatedGroup)
                setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, selection])
                setGuesses(prevGuesses => [...prevGuesses, selection])
                setSelection([])
                setAlertWrongTiles([])
            } else if (guesses.some(guess => arraysEqualIgnoringOrder(guess, selection))) {
                renderToast("Already Guessed!")
                setAlertWrongTiles(selection.map(item => item.label))
            } else {
                renderToast("Wrong items!", 'error')
                setGuesses(prevGuesses => [...prevGuesses, selection])
                setChances(chances - 1)
                setAlertWrongTiles(selection.map(item => item.label))
            }
        }
    }

    const handleClear = () => {
        setSelection([])
        setAlertWrongTiles([])
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

    const renderAnswerTilesWhenDayIsAlreadyDone = () => {
        const groupedItems: { [category: string]: Item[] } = {}
        group.forEach(item => {
            if (!groupedItems[item.category]) {
                groupedItems[item.category] = []
            }
            groupedItems[item.category].push(item)
        })

        const groupedItemsArray = Object.values(groupedItems)

        return (
            <div>
                {groupedItemsArray.map((answerGroup, index) => (
                    <AnswerTile
                        key={index}
                        category={answerGroup[0].category}
                        items={answerGroup.map(item => item.label)}
                        color={ANSWER_COLOR[index % ANSWER_COLOR.length]}
                    />
                ))}
            </div>
        )
    }

    const renderToast = (message: string, type?: string) => {
        if (type === "error") {
            toast.error(message, {
                duration: 1000,
                position: 'top-center',
            })
        } else {
            toast(message, {
                duration: 1000,
                position: 'top-center',
            })
        }
    }

    const winGame = () => {
        addDateToLocalStorage(day)
        return (
            <Confetti
                width={width}
                height={height}
            />
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Image
                className="absolute top-4 flex"
                src={'/clapperboard.svg'}
                alt={'clapperboard'}
                width={50}
                height={50}
            />
            <Image
                className="absolute top-7 right-[440px] flex"
                src={'/help.svg'}
                alt={'help'}
                width={25}
                height={25}
            />
            {
                state === states.LOADING && (
                    <>
                        <Loading />
                    </>
                )
            }
            {
                state === states.LOADED && (
                    <div className="absolute top-[100px] w-[390px] h-[400px] mr-1">
                        <Instructions isOpen={instructionsOpen} onClose={handleCloseInstructions}/>
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
                                                selected={selection.some(item => item.label === label)}
                                                onClick={() => handleTileClick(category, label)}
                                                alertWrong={alertWrongTiles.includes(label)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex">
                                        {
                                            chances > 0 ? (
                                                <p>{`Chances left: ${chances}`}</p>
                                            ) : (
                                                <p className="w-full flex justify-center text-red-600">Game over</p>
                                            )
                                        }
                                        <div className="absolute right-0">
                                            <ClearButton onClick={handleClear}/>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center mt-1">
                                        <SubmitButton onClick={handleSubmit} disabled={chances <= 0}/>
                                    </div>
                                </>
                            )
                        }
                    </div>
                )
            }
            {
                state === states.COMPLETED && (
                    renderAnswerTilesWhenDayIsAlreadyDone()
                )
            }
            {
                chances > 0 && correctAnswers.length == 4 && (
                    winGame()
                )
            }
            <Toaster/>
        </main>
    )
}
