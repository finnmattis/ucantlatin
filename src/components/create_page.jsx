import {
    faArrowLeft,
    faArrowRight,
    faCheck,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    collection,
    collectionGroup,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { UserContext } from "../lib/context"
import { firestore } from "../lib/firebase"
import Card from "./card"
import Input from "./input"

export default function createPage({ id, set }) {
    const { user } = useContext(UserContext)
    const router = useRouter()

    const toDelete = useRef([])
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

    const [name, setName] = useState("")

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

    const onDelete = () => {
        if (set[cardIndex]) {
            //idea is to delete the card from both the set and the initial set to store in toDelete array which then gets deleted on save
            //this way, deleted cards will not interfere in set array (which UI uses) or mess up the index parity between set or initial set
            toDelete.current.push(set[cardIndex])
            set.splice(cardIndex, 1)
            initialSet.splice(cardIndex, 1)

            //don't use clickHandler b.c. don't want to change index
            setDirection("right")
            setCurCardNum(curCardNum < 2 ? curCardNum + 1 : 1)
            setCurrentCard(set[cardIndex])
        } else {
            toast.error("No card to delete")
        }
    }

    const onComplete = async () => {
        if (set.length === 0) {
            toast.error("Set must have at least one card!")
            return
        } else if (!name) {
            toast.error("Set must have a name!")
            return
        }
        const loadingToast = toast.loading("Saving...")
        //fetch collection from firestore if id and exists otherwise create new one
        let setRef = null
        if (id) {
            const setQuery = query(
                collectionGroup(firestore, "sets"),
                where("id", "==", id)
            )

            const setSnap = (await getDocs(setQuery)).docs[0]
            if (!setSnap.exists()) {
                setRef = doc(collection(firestore, "users", user.uid, "sets"))
            } else {
                setRef = setSnap.ref
            }
        } else {
            setRef = doc(collection(firestore, "users", user.uid, "sets"))
            id = setRef.id
        }

        await setDoc(setRef, {
            name: name,
            length: set.length,
            author: user.uid,
            id: setRef.id,
        })

        //Delete cards that were deleted by user
        for (let i = 0; i < toDelete.current.length; i++) {
            const card = toDelete.current[i]
            deleteDoc(doc(setRef, "words", card.word))
        }

        for (let i = 0; i < set.length; i++) {
            const card = set[i]
            //could have skipped over a card and filled in a card after it
            if (!card) {
                continue
            }

            if (!card.word) {
                //Delete card with no word
                deleteDoc(doc(setRef, "words", initialSet[i].word))
                continue
            }

            //default values for select inputs
            card.POS = card.POS || "n"
            card.family = card.family || "1"
            card.gender = card.gender || "N/A"
            //if not provided by user, default to N/A
            card.cognate = card.cognate || "N/A"
            card.def = card.def || "N/A"
            //Add index field
            card.index = i

            const cardRef = doc(setRef, "words", card.word)

            if (i >= initialSet.length) {
                //New card
                setDoc(cardRef, card)
            } else if (initialSet[i].word === card.word) {
                //Update card
                let initialWord = initialSet[i].word
                if (
                    initialWord.POS !== card.POS ||
                    initialWord.family !== card.family ||
                    initialWord.gender !== card.gender ||
                    initialWord.cognate !== card.cognate ||
                    initialWord.def !== card.def
                ) {
                    updateDoc(cardRef, card)
                }
            } else {
                //Update card but word has changed
                //delete the old card and create a new one
                deleteDoc(doc(setRef, "words", initialSet[i].word))
                setDoc(cardRef, card)
            }
        }
        toast.dismiss(loadingToast)
        toast.success("Done!")
        router.push(`/terms/flashcards/${id}`)
    }

    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <div className="absolute right-0 m-2 flex  h-52 w-96 flex-col items-center rounded bg-secondary">
                <Input
                    name="Name"
                    value={name}
                    func={(e) => setName(e.target.value)}
                />
                <button
                    onClick={onComplete}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 sm:hidden"
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </div>
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
                onDelete={onDelete}
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
                onDelete={onDelete}
                index={cardIndex}
            />
            <div className="mt-[78vh] flex w-[30vw] min-w-[400px] justify-around">
                <button
                    disabled={cardIndex === 0}
                    onClick={() => clickHandler("left")}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text transition hover:scale-105 disabled:opacity-50"
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
