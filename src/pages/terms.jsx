import {
    faArrowLeft,
    faArrowRight,
    faCompass,
    faPen,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { collection, getDocs, query } from "firebase/firestore"
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
                <button className="absolute left-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105">
                    <FontAwesomeIcon icon={faCompass} />
                </button>
            </Link>
            <Link href="terms/create">
                <button className="absolute right-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105">
                    <FontAwesomeIcon icon={faPen} />
                </button>
            </Link>
            <ProgressBar progress={progress} />
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
            <div className="mt-[78vh] flex w-[30vw] min-w-[400px] justify-around">
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
    let [status, setStatus] = useState("")
    let [word, setWord] = useState("")

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
            className=" absolute mt-10 flex h-[70vh] w-[30vw] min-w-[400px] items-center justify-center rounded bg-secondary 
            drop-shadow-2xl duration-700 ease-[cubic-bezier(.05,.43,.25,.95)] data-[status=after]:translate-x-1/2 data-[status=before]:-translate-x-1/2 data-[status=fromRight]:-translate-x-1/2 data-[status=fromLeft]:translate-x-1/2 data-[status=before]:-rotate-6 data-[status=fromLeft]:rotate-6 data-[status=after]:rotate-6
            data-[status=fromRight]:-rotate-6 data-[status=after]:scale-0 data-[status=before]:scale-0 data-[status=fromRight]:scale-0
            data-[status=fromLeft]:scale-0 data-[status=fromRight]:transition-none data-[status=fromLeft]:transition-none
            "
        >
            <p className="mt-5 text-5xl text-text">{word}</p>
        </div>
    )
}
