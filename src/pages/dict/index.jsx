import { faMagicWandSparkles, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Input from "../../components/Input"

export default function index() {
    const [word, setWord] = useState("")
    const [definition, setDefinition] = useState("")

    //these values are for the stars
    const [left1, setLeft1] = useState(0)
    const [top1, setTop1] = useState(0)

    const [left2, setLeft2] = useState(0)
    const [top2, setTop2] = useState(0)
    const [animation2, setAnimation2] = useState(false)

    const [left3, setLeft3] = useState(0)
    const [top3, setTop3] = useState(0)
    const [animation3, setAnimation3] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setLeft1(Math.floor(Math.random() * 110 - 10))
            setTop1(Math.floor(Math.random() * 110 - 40))
            setTimeout(() => {
                setLeft2(Math.floor(Math.random() * 110 - 10))
                setTop2(Math.floor(Math.random() * 110 - 40))
                setAnimation2(true)
            }, 333)
            setTimeout(() => {
                setLeft3(Math.floor(Math.random() * 110 - 10))
                setTop3(Math.floor(Math.random() * 110 - 40))
                setAnimation3(true)
            }, 666)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const getWord = () => {
        if (!word) {
            toast.error("Please enter a word")
            return
        }

        if (word.length < 2) {
            toast.error("Please enter a word with 2 or more letters")
            return
        }

        const loadingToast = toast.loading("Loading...")

        fetch("https://words-image-rt3y5woe6q-uc.a.run.app/?w=" + word)
            .then((response) => response.text())
            .then((data) => {
                toast.dismiss(loadingToast)
                toast.success("Done!")
                if (data === "") {
                    setDefinition("No definition found")
                } else {
                    setDefinition(data)
                }
            })
    }

    return (
        <div className="flex min-h-[90vh] flex-col items-center bg-primary">
            <p className="mt-6 text-center text-6xl text-white sm:text-3xl">
                Look up a word in{"   "}
                <span className="relative inline-block text-purple-500">
                    <FontAwesomeIcon
                        className="absolute h-4 w-4 animate-twinkle"
                        style={{ left: `${left1}%`, top: `${top1}%` }}
                        icon={faStar}
                    />
                    <FontAwesomeIcon
                        data-animate={animation2}
                        className="absolute h-4 w-4 scale-0 data-[animate=true]:animate-twinkle"
                        style={{ left: `${left2}%`, top: `${top2}%` }}
                        icon={faStar}
                    />
                    <FontAwesomeIcon
                        data-animate={animation3}
                        className="absolute h-4 w-4 scale-0 data-[animate=true]:animate-twinkle"
                        style={{ left: `${left3}%`, top: `${top3}%` }}
                        icon={faStar}
                    />
                    <span className="animate-bg-pan bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-[length:200%] bg-clip-text text-transparent">
                        Whitiker's Words
                    </span>
                </span>
            </p>
            <div className="flex">
                <Input
                    name="word"
                    func={(e) => setWord(e.target.value)}
                    value={word}
                />
                <button
                    onClick={getWord}
                    className="mt-14 ml-4 h-10 w-10 rounded-full border-2 border-secondary text-lg text-white"
                >
                    <FontAwesomeIcon icon={faMagicWandSparkles} />
                </button>
            </div>
            <div className="relative flex aspect-[4/2] w-[50%] min-w-[450px] items-center justify-center rounded-lg bg-secondary">
                <pre className="top-12 left-16 my-20 w-[50%] overflow-hidden text-lg text-white">
                    {definition}
                </pre>
                <div className="absolute top-0 left-0 z-20 m-2 h-40 w-40 rotate-180">
                    <Image
                        priority
                        src="/corner.svg"
                        fill="contain"
                        alt="corner flourish"
                    />
                </div>
                <div className="absolute bottom-0 right-0 z-20 m-2 h-40 w-40">
                    <Image
                        priority
                        src="/corner.svg"
                        fill="contain"
                        alt="corner flourish"
                    />
                </div>
            </div>
        </div>
    )
}
