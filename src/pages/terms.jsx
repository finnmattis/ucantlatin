import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"

function Card({ cardNum, CurCardNum: curCardNum, direction }) {
    let [status, setStatus] = useState("active")

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
            className="absolute h-[65vh] w-[25vw] mt-10 bg-secondary rounded drop-shadow-lg ease-[cubic-bezier(.05,.43,.25,.95)] duration-500 
            data-[status=after]:translate-x-1/2 data-[status=after]:scale-0
            data-[status=before]:-translate-x-1/2 data-[status=before]:scale-0
            data-[status=fromRight]:transition-none data-[status=fromRight]:-translate-x-1/2 data-[status=fromRight]:scale-0
            data-[status=fromLeft]:transition-none data-[status=fromLeft]:translate-x-1/2 data-[status=fromLeft]:scale-0
            "
        >
            {cardNum}
        </div>
    )
}

export default function terms() {
    let [direction, setDirection] = useState("")
    let [CurCardNum, setCurCardNum] = useState(1)

    let clickHandler = (direction) => {
        //Won't take effect until the next render
        setDirection(direction)
        setCurCardNum(CurCardNum < 2 ? CurCardNum + 1 : 1)
    }

    return (
        <div className="h-[90vh] bg-gradient-to-b from-primary to-gray-900 flex flex-col items-center">
            <Card cardNum={2} CurCardNum={CurCardNum} direction={direction} />
            <Card cardNum={1} CurCardNum={CurCardNum} direction={direction} />
            <div className="w-[25vw] mt-[75vh] flex justify-around">
                <button
                    onClick={() => clickHandler("left")}
                    className="h-20 w-20 border-2 border-text text-3xl rounded-full text-text"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                    onClick={() => clickHandler("right")}
                    className="h-20 w-20 border-2 border-text text-3xl rounded-full text-text"
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    )
}
