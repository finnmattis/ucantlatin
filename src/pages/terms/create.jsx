import { collection, getDocs, query } from "firebase/firestore"
import { useState } from "react"
import Card from "../../../components/card"
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

export default function create({ sets }) {
    let [currentCard, setCurrentCard] = useState(sets[0])
    let [direction, setDirection] = useState("")
    let [curCardNum, setCurCardNum] = useState(1)
    let [cardIndex, setCardIndex] = useState(0)
    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
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
        </div>
    )
}
