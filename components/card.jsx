import Image from "next/image"
import { useEffect, useState } from "react"
import Question from "./question"

export default function Card({ cardNum, curCardNum, direction, card, back }) {
    //It gets really glitchy if the card is flipped during the transition so when transitioning, need to flip instantly first
    let [flipTransition, setFlipTransition] = useState(true)
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
            setFlipTransition(true)
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
            setFlipTransition(false)
            setFlipped(false)
            if (direction == "right") {
                setStatus("after")
            } else if (direction == "left") {
                setStatus("before")
            }
        }
    }, [curCardNum])

    const flip = (e) => {
        if (e.target.nodeName !== "SELECT" && e.target.nodeName !== "INPUT") {
            setFlipped(!flipped)
        }
    }

    return (
        <div
            data-status={status}
            onClick={(e) => flip(e)}
            className="bg group absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] cursor-pointer rounded
            drop-shadow-2xl [perspective:1000px] data-[status=active]:z-10"
        >
            <div
                data-flipped={flipped}
                data-transition={flipTransition}
                className="relative h-full w-full ease-[cubic-bezier(.05,.43,.25,.95)] [transform-style:preserve-3d] data-[transition=true]:duration-500 data-[flipped=true]:[transform:rotateY(180deg)]"
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
                    {/* <CardBack card={card} /> */}
                    <Question />
                </div>
            </div>
        </div>
    )
}

function CardBack({ card }) {
    return (
        <div className="leading-[4rem]">
            <span className="ml-1 mt-5 text-8xl text-text underline">
                {card.word}
            </span>
            <br />
            <span className="mt-5 ml-1 text-xl text-text">is a {"   "}</span>
            <span className="mt-5 text-5xl text-text underline">
                {card.POS}
            </span>
            <br />
            <span className="mt-5 ml-1 text-xl text-text">in the {"   "}</span>
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
                    <span className="mt-5 ml-1 text-xl text-text">
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
            <span className="mt-5 ml-1 text-xl text-text">
                {card.POS == "noun" ? "and has" : "that has"} {"   "}
            </span>
            <span className="mt-5 text-5xl text-text underline	">
                no cognate
            </span>
            <br />
            <span className="mt-5 ml-1 text-xl text-text">
                and means {"   "}
            </span>
            <span className="mt-5 text-5xl text-text underline	">
                {card.def}
            </span>
        </div>
    )
}
