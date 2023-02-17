import {
    faArrowLeft,
    faArrowRight,
    faCompass,
    faPen,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { collection, getDocs, query } from "firebase/firestore"
import Link from "next/link"
import React, { useState } from "react"
import Card from "../../../components/card"
import ProgressBar from "../../../components/progressbar"
import { firestore } from "../../../lib/firebase"

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
    let [curCardNum, setCurCardNum] = useState(1)
    let [cardIndex, setCardIndex] = useState(0)
    let [progress, setProgress] = useState(0)

    let clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(curCardNum < 2 ? curCardNum + 1 : 1)

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
        <div
            className="
        flex h-[90vh] flex-col items-center bg-primary"
        >
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
                curCardNum={curCardNum}
                direction={direction}
                card={currentCard}
            />
            <Card
                cardNum={1}
                curCardNum={curCardNum}
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
