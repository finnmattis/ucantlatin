import {
    faArrowLeft,
    faArrowRight,
    faCompass,
    faPen,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    collection,
    collectionGroup,
    getDocs,
    query,
    where,
} from "firebase/firestore"
import Link from "next/link"
import { useState } from "react"
import Page404 from "../../../../components/404"
import Card from "../../../../components/card"
import ProgressBar from "../../../../components/progressbar"
import { firestore } from "../../../../lib/firebase"

export async function getServerSideProps(context) {
    const { id } = context.params
    const setQuery = query(
        collectionGroup(firestore, "sets"),
        where("id", "==", id)
    )

    const setSnap = (await getDocs(setQuery)).docs[0]
    if (!setSnap) {
        return {
            props: {
                id: null,
                set: [],
                exists: false,
            },
        }
    }
    const wordsRef = collection(setSnap.ref, "words")
    let set = (await getDocs(wordsRef)).docs.map((doc) => doc.data())
    set.sort((a, b) => a.index - b.index)

    if (set.length === 0) {
        set = []
    }
    return {
        props: {
            id: id,
            set: set,
            exists: true,
        },
    }
}

export default function terms({ id, set, exists }) {
    const [currentCard, setCurrentCard] = useState(set[0])
    const [direction, setDirection] = useState("")
    const [curCardNum, setCurCardNum] = useState(1)
    const [cardIndex, setCardIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    let clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(curCardNum < 2 ? curCardNum + 1 : 1)

        let newIndex = 0
        if (direction == "right") {
            newIndex = (cardIndex + 1) % set.length
        } else {
            newIndex = cardIndex - 1 < 0 ? set.length - 1 : 0
        }
        let percent = (newIndex / set.length) * 100
        setProgress(percent === Infinity ? 0 : percent)
        setCardIndex(newIndex)
        setCurrentCard(set[newIndex])
    }
    console.log(set)

    if (!exists) {
        return <Page404 name="Oops! This set doesn't exist!" />
    } else if (set.length == 0) {
        return <Page404 name="Oops! This set is empty!" />
    } else {
        return (
            <div
                className="
            flex h-[90vh] flex-col items-center bg-primary"
            >
                <Link href="/terms/browse">
                    <button className="absolute left-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 sm:hidden">
                        <FontAwesomeIcon icon={faCompass} />
                    </button>
                </Link>
                <Link href={`/terms/create/${id}`}>
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
}
