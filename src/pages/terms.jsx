import {
    faArrowLeft,
    faArrowRight,
    faCompass,
    faPen,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { collection, getDocs, query } from "firebase/firestore"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { firestore } from "../../lib/firebase"

export async function getServerSideProps() {
    const wordsQuery = query(collection(firestore, "set1"))
    const sets = (await getDocs(wordsQuery)).docs.map((doc) => doc.data())
    return {
        props: {
            sets: sets,
        },
    }
}

export default function terms({ sets }) {
    let [currentCard, setCurrentCard] = useState(sets[0])
    let [direction, setDirection] = useState("")
    let [CurCardNum, setCurCardNum] = useState(1)
    let [cardIndex, setCardIndex] = useState(0)
    let [progress, setProgress] = useState(0)

    let clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(CurCardNum < 2 ? CurCardNum + 1 : 1)

        let newIndex = 0
        if (direction == "right") {
            newIndex = (cardIndex + 1) % sets.length
        } else {
            newIndex = cardIndex - 1 < 0 ? sets.length - 1 : 0
        }
        let percent = (newIndex / sets.length) * 100
        setProgress(percent === Infinity ? 0 : percent)
        setCardIndex(newIndex)
        setCurrentCard(sets[newIndex])
    }

    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <Link href="terms/browse">
                <button className="absolute left-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 sm:hidden">
                    <FontAwesomeIcon icon={faCompass} />
                </button>
            </Link>
            <Link href="terms/create">
                <button className="absolute right-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 sm:hidden">
                    <FontAwesomeIcon icon={faPen} />
                </button>
            </Link>
            <ProgressBar progress={progress} />
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] -rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <Card
                cardNum={2}
                CurCardNum={CurCardNum}
                direction={direction}
                card={currentCard}
            />
            <Card
                cardNum={1}
                CurCardNum={CurCardNum}
                direction={direction}
                card={currentCard}
            />
            <div className="mt-[76vh] flex w-[30vw] min-w-[400px] justify-around">
                <button
                    onClick={() => clickHandler("left")}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                    onClick={() => clickHandler("right")}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105"
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    )
}

function ProgressBar({ progress }) {
    return (
        <div className="mt-2 h-1 w-[60%] min-w-[450px]  bg-secondary">
            <div
                className="h-full bg-highlight"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}

function Card({ cardNum, CurCardNum: curCardNum, direction, card }) {
    let [flipped, setFlipped] = useState(false)
    let [status, setStatus] = useState("")
    //Need custom state for word because it needs to only be updated when the card becomes active - when the card is flying away, it should not change
    let [word, setWord] = useState("")

    //This is so that the second card does not begin as active when the page loads
    useEffect(() => {
        if (cardNum == 2) {
            setStatus("inactive")
        }
    }, [])

    useEffect(() => {
        if (curCardNum == cardNum) {
            setWord(card.word)
            if (direction == "right") {
                setStatus("fromRight")
                setTimeout(() => {
                    setStatus("active")
                }, 100)
            } else if (direction == "left") {
                setStatus("fromLeft")
                setTimeout(() => {
                    setStatus("active")
                }, 100)
            }
        } else {
            if (direction == "right") {
                setStatus("after")
            } else if (direction == "left") {
                setStatus("before")
            }
        }
    }, [curCardNum])

    return (
        <div
            data-status={status}
            onClick={() => setFlipped(!flipped)}
            className="bg group absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] cursor-pointer rounded
            drop-shadow-2xl [perspective:1000px] data-[status=active]:z-10"
        >
            <div
                data-flipped={flipped}
                className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] data-[flipped=true]:[transform:rotateY(180deg)]"
            >
                <div
                    data-status={status}
                    className="absolute flex h-full w-full items-center justify-center 
            rounded bg-secondary duration-700 ease-[cubic-bezier(.05,.43,.25,.95)] [backface-visibility:hidden] data-[status=inactive]:hidden data-[status=after]:translate-x-full
            data-[status=before]:-translate-x-full data-[status=fromRight]:-translate-x-full data-[status=fromLeft]:translate-x-full data-[status=before]:-rotate-6
            data-[status=fromLeft]:rotate-6 data-[status=after]:rotate-6 data-[status=fromRight]:-rotate-6
            data-[status=after]:scale-0
            data-[status=before]:scale-0
            data-[status=fromRight]:scale-0 data-[status=fromLeft]:scale-0
            data-[status=fromRight]:transition-none
            data-[status=fromLeft]:transition-none"
                >
                    <div className="absolute top-0 left-0 z-20 m-2 h-40 w-40 [backface-visibility:hidden] [transform:rotate(180deg)]">
                        <Image
                            src="/corner.svg"
                            fill="contain"
                            alt="corner flourish"
                        />
                    </div>
                    <p className="mt-5 text-5xl text-text">{word}</p>
                </div>
                <div
                    data-status={status}
                    className="absolute h-full w-full rounded 
            bg-secondary duration-700 ease-[cubic-bezier(.05,.43,.25,.95)] [backface-visibility:hidden] [transform:rotateY(180deg)] data-[status=inactive]:hidden data-[status=after]:translate-x-full
            data-[status=before]:-translate-x-full data-[status=fromRight]:-translate-x-full data-[status=fromLeft]:translate-x-full data-[status=before]:-rotate-6
            data-[status=fromLeft]:rotate-6 data-[status=after]:rotate-6 data-[status=fromRight]:-rotate-6
            data-[status=after]:scale-0
            data-[status=before]:scale-0
            data-[status=fromRight]:scale-0 data-[status=fromLeft]:scale-0
            data-[status=fromRight]:transition-none
            data-[status=fromLeft]:transition-none"
                >
                    <div className="absolute bottom-0 right-0 z-20 m-2 h-40 w-40 [backface-visibility:hidden]">
                        <Image
                            src="/corner.svg"
                            fill="contain"
                            alt="corner flourish"
                        />
                    </div>
                    <div className="leading-[4rem]">
                        <span className="ml-5 mt-5 text-8xl text-text underline">
                            {card.word}
                        </span>
                        <br />
                        <span className="ml-10 mt-5 text-3xl text-text">
                            is a {"   "}
                        </span>
                        <span className="mt-5 text-5xl text-text underline">
                            {card.POS}
                        </span>
                        <br />
                        <span className="ml-10 mt-5 text-3xl text-text">
                            in the {"   "}
                        </span>
                        <span className="mt-5 text-5xl text-text underline	">
                            {card.family == "1"
                                ? "1st"
                                : card.family == "2"
                                ? "2nd"
                                : card.family == "3"
                                ? "3rd"
                                : $`{card.family}th`}{" "}
                            {card.POS == "noun" ? "declension" : "conjugation"}
                        </span>
                        <br />
                        {card.POS == "noun" && (
                            <>
                                <span className="ml-10 mt-5 text-3xl text-text">
                                    that is {"   "}
                                </span>
                                <span className="mt-5 text-5xl text-text underline	">
                                    {card.gender == "M"
                                        ? "masculine"
                                        : card.gender == "F"
                                        ? "feminine"
                                        : "neuter"}
                                </span>
                                <br />
                            </>
                        )}
                        <span className="ml-10 mt-5 text-3xl text-text">
                            {card.POS == "noun" ? "and has" : "that has"}{" "}
                            {"   "}
                        </span>
                        <span className="mt-5 text-5xl text-text underline	">
                            NO COGNATE
                        </span>
                        <br />
                        <span className="ml-10 mt-5 text-3xl text-text">
                            and means {"   "}
                        </span>
                        <span className="mt-5 text-5xl text-text underline	">
                            {card.def}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
