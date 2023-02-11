import { faQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useRef } from "react"

export default function Question({ word }) {
    let partOfSpeech = useRef("")
    let family = useRef("")
    let gender = useRef("")
    let cognate = useRef("")
    let definition = useRef("")

    return (
        <div className="flex h-full w-full flex-col items-center">
            <p className="mt-5 text-5xl text-text">{word}</p>
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
            <button className=" absolute bottom-0 right-0 m-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary bg-black/0 text-4xl text-primary">
                <FontAwesomeIcon icon={faQuestion} />
            </button>
        </div>
    )
}
