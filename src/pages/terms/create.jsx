import {
    faArrowLeft,
    faArrowRight,
    faCheck,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import Card from "../../../components/card"
import { firestore } from "../../../lib/firebase"

export async function getServerSideProps() {
    const wordsQuery = query(collection(firestore, "set1"))
    let set = (await getDocs(wordsQuery)).docs.map((doc) => doc.data())
    if (set.length === 0) {
        set = []
    }
    return {
        props: {
            set: set,
        },
    }
}

export default function create({ set }) {
    const [initialSet, setInitialSet] = useState()
    useEffect(() => {
        //need to create a deep copy for every object in the array
        const setCopy = set.map((a) => ({ ...a }))
        setInitialSet(setCopy)
    }, [set])

    const [currentCard, setCurrentCard] = useState(set[0])
    const [direction, setDirection] = useState("")
    const [curCardNum, setCurCardNum] = useState(1)
    const [cardIndex, setCardIndex] = useState(0)

    const clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(curCardNum < 2 ? curCardNum + 1 : 1)

        let newIndex = 0
        if (direction === "right") {
            newIndex = cardIndex + 1
        } else {
            newIndex = cardIndex - 1
        }
        setCardIndex(newIndex)
        setCurrentCard(set[newIndex])
    }

    const onComplete = async () => {
        for (let i = 0; i < set.length; i++) {
            const card = set[i]
            //could have skipped over a card and filled in a card after it
            if (!card) {
                continue
            }

            //default values for select inputs
            card.POS = card.POS || "n"
            card.family = card.family || "1"
            card.gender = card.gender || "N/A"
            //if not provided by user, default to N/A
            card.cognate = card.cognate || "N/A"
            card.def = card.def || "N/A"

            const cardRef = doc(firestore, "set1", card.word)

            if (i >= initialSet.length) {
                await setDoc(cardRef, card)
            } else if (initialSet[i].word === card.word) {
                let initialWord = initialSet[i].word
                if (
                    initialWord.POS !== card.POS ||
                    initialWord.family !== card.family ||
                    initialWord.gender !== card.gender ||
                    initialWord.cognate !== card.cognate ||
                    initialWord.def !== card.def
                ) {
                    await updateDoc(cardRef, card)
                }
            } else {
                //delete the old card and create a new one
                await deleteDoc(doc(firestore, "set1", initialSet[i].word))
                await setDoc(cardRef, card)
            }
        }
    }

    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <button
                onClick={onComplete}
                className="absolute right-0 top-[10vh] m-2 h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 sm:hidden"
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] -rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <Card
                type="create"
                cardNum={2}
                curCardNum={curCardNum}
                direction={direction}
                card={currentCard}
                setCardSet={(key, val) => {
                    if (!set[cardIndex]) {
                        set[cardIndex] = {}
                    }
                    set[cardIndex][key] = val
                }}
                index={cardIndex}
            />
            <Card
                type="create"
                cardNum={1}
                curCardNum={curCardNum}
                direction={direction}
                card={currentCard}
                setCardSet={(key, val) => {
                    if (!set[cardIndex]) {
                        set[cardIndex] = {}
                    }
                    set[cardIndex][key] = val
                }}
                index={cardIndex}
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
