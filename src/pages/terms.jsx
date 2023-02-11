import {
    faArrowLeft,
    faArrowRight,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"

export default function terms() {
    let [direction, setDirection] = useState("")
    let [CurCardNum, setCurCardNum] = useState(1)
    let [currentCard, setCurrentCard] = useState(0)
    let [progress, setProgress] = useState(0)

    //temp
    let length = 10

    let clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(CurCardNum < 2 ? CurCardNum + 1 : 1)

        let new_card = 0
        if (direction == "right") {
            new_card = currentCard < length ? currentCard + 1 : 0
        } else {
            new_card = currentCard > 1 ? currentCard - 1 : length
        }
        let percent = (new_card / length) * 100
        setProgress(percent === Infinity ? 0 : percent)
        setCurrentCard(new_card)
    }

    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <ProgressBar progress={progress} />
            <Card cardNum={2} CurCardNum={CurCardNum} direction={direction} />
            <Card cardNum={1} CurCardNum={CurCardNum} direction={direction} />
            <div className="mt-[78vh] flex w-[30vw] min-w-[400px] justify-around">
                <button
                    onClick={() => clickHandler("left")}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                    onClick={() => clickHandler("right")}
                    className="h-20 w-20 rounded-full border-2 border-text text-3xl text-text"
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

function Card({ cardNum, CurCardNum: curCardNum, direction }) {
    let [status, setStatus] = useState("active")
    let partOfSpeech = useRef("")
    let family = useRef("")
    let gender = useRef("")
    let cognate = useRef("")
    let definition = useRef("")

    useEffect(() => {
        if (curCardNum == cardNum) {
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
            className="absolute mt-10 flex h-[70vh] w-[30vw] min-w-[400px] flex-col items-center rounded bg-secondary 
            drop-shadow-2xl duration-500
            ease-[cubic-bezier(.05,.43,.25,.95)] data-[status=after]:translate-x-1/2
            data-[status=before]:-translate-x-1/2 data-[status=fromRight]:-translate-x-1/2 data-[status=fromLeft]:translate-x-1/2
            data-[status=after]:scale-0 data-[status=before]:scale-0 data-[status=fromRight]:scale-0
            data-[status=fromLeft]:scale-0 data-[status=fromRight]:transition-none data-[status=fromLeft]:transition-none
            "
        >
            <p className="mt-5 text-5xl text-text">amo</p>
            <div className="mt-10 flex w-full justify-evenly">
                <select
                    ref={partOfSpeech}
                    className=" aspect-[10/3] w-[30%]  cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                >
                    <option value="n">Noun</option>
                    <option value="v">Verb</option>
                    <option value="adj">Adjective</option>
                    <option value="adv">Adverb</option>
                    <option value="conj">Conjunction</option>
                </select>
                <select
                    ref={family}
                    className="aspect-[10/3] w-[30%] cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                >
                    <option value="1">Family 1</option>
                    <option value="2">Family 2</option>
                    <option value="3">Family 3</option>
                    <option value="4">Family 4</option>
                    <option value="5">Family 5</option>
                </select>
                <select
                    ref={gender}
                    className="aspect-[10/3] w-[30%] cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                >
                    <option value="">N/A</option>
                    <option value="m">Masculine</option>
                    <option value="f">Feminine</option>
                    <option value="n">Neuter</option>
                </select>
            </div>
            <input
                ref={cognate}
                className="mt-20 aspect-[10/1] w-[80%] rounded bg-primary text-text outline-highlight focus:outline"
                type="text"
                placeholder="Cognate"
            />
            <input
                ref={definition}
                className="mt-20 aspect-[10/1] w-[80%] rounded bg-primary text-text outline-highlight focus:outline"
                type="text"
                placeholder="Definition"
            />
            <div className="group relative mt-20 aspect-[10/2] h-[10%] rounded">
                <div className="animate-tilt absolute -inset-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                <button className="relative h-full w-full rounded bg-primary text-lg text-text ">
                    SUMBIT
                </button>
            </div>
            <button className=" absolute bottom-0 right-0 m-1 flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary bg-black/0 text-5xl text-primary">
                <FontAwesomeIcon icon={faQuestion} />
            </button>
        </div>
    )
}
