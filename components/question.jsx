import { useEffect, useState } from "react"
import Input from "./input"

export default function Question({ card, setCardSet }) {
    const [POS, setPOS] = useState()
    const [family, setFamily] = useState()
    const [gender, setGender] = useState()
    const [cognate, setCognate] = useState()
    const [def, setDef] = useState()
    //want to reset inputs to default values when card changes
    useEffect(() => {
        setPOS(card && card.POS)
        setFamily(card && card.family)
        setGender(card && card.gender)
        setCognate(card && card.cognate !== "N/A" ? card.cognate : "")
        setDef(card && card.def !== "N/A" ? card.def : "")
    }, [card])

    return (
        <div className="flex h-full w-full flex-col items-center">
            <div className="mt-10 flex w-full justify-evenly">
                <select
                    onChange={(e) => {
                        setCardSet("POS", e.target.value)
                        setPOS(e.target.value)
                    }}
                    className=" aspect-[10/3] w-[30%] cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                    value={POS}
                >
                    <option value="n">Noun</option>
                    <option value="v">Verb</option>
                    <option value="adj">Adjective</option>
                    <option value="adv">Adverb</option>
                    <option value="conj">Conjunction</option>
                </select>
                <select
                    onChange={(e) => {
                        setCardSet("family", e.target.value)
                        setFamily(e.target.value)
                    }}
                    className="aspect-[10/3] w-[30%] cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                    value={family}
                >
                    <option value="1">Family 1</option>
                    <option value="2">Family 2</option>
                    <option value="3">Family 3</option>
                    <option value="4">Family 4</option>
                    <option value="5">Family 5</option>
                </select>
                <select
                    onChange={(e) => {
                        setCardSet("gender", e.target.value)
                        setGender(e.target.value)
                    }}
                    className="aspect-[10/3] w-[30%] cursor-pointer appearance-none rounded bg-primary text-center text-text outline-highlight placeholder:text-center focus:outline"
                    value={gender}
                >
                    <option value="N/A">N/A</option>
                    <option value="m">Masculine</option>
                    <option value="f">Feminine</option>
                    <option value="n">Neuter</option>
                </select>
            </div>
            <Input
                name="cognate"
                value={cognate}
                func={(e) => {
                    setCardSet("cognate", e.target.value)
                    setCognate(e.target.value)
                }}
            />
            <Input
                name="definition"
                value={def}
                func={(e) => {
                    setCardSet("def", e.target.value)
                    setDef(e.target.value)
                }}
            />
        </div>
    )
}
