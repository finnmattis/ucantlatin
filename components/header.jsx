import { faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Header() {
    let [menuShown, setMenuShown] = useState(false)
    const profileRef = useRef()

    return (
        <header className="sticky flex h-[10vh] w-full items-center justify-evenly border-b-[1px] border-gray-500 bg-primary">
            <Link
                href="/terms"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Terms</p>
                </div>
                <div className="h-15 -my-2 hidden grow rounded-lg bg-highlight group-hover:block"></div>
            </Link>
            <Link
                href="/"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Home</p>
                </div>
                <div className="h-15 -my-2 hidden grow rounded-lg bg-highlight group-hover:block"></div>
            </Link>
            <Link
                href="/dict"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Dictionary</p>
                </div>
                <div className="h-15 -my-2 hidden grow rounded-lg bg-highlight group-hover:block"></div>
            </Link>
            <div
                ref={profileRef}
                onClick={() => setMenuShown(!menuShown)}
                className="absolute right-0 mx-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-secondary text-4xl text-text"
            >
                <FontAwesomeIcon icon={faUser} />
            </div>
            <Menu
                show={menuShown}
                profileRef={profileRef}
                onClickOutside={() => {
                    setMenuShown(false)
                }}
            />
        </header>
    )
}

function Menu({ show, profileRef, onClickOutside }) {
    const menuRef = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !profileRef.current.contains(event.target)
            ) {
                onClickOutside()
            }
        }
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    }, [])
    return (
        <div
            ref={menuRef}
            data-show={show}
            className="absolute top-24 right-10 flex h-60 w-64 flex-col items-center rounded bg-secondary transition-all duration-150 data-[show=false]:top-28 data-[show=false]:opacity-0"
        >
            <p className="mt-5 text-3xl text-text">Guest</p>
            <Link
                href="/login"
                className="group mt-5 flex h-16 w-full cursor-pointer items-center border-t-[1px] border-gray-500"
            >
                <div className="mx-5 text-2xl text-gray-500 transition-all duration-300 group-hover:text-gray-400">
                    <FontAwesomeIcon icon={faDoorOpen} />
                </div>
                <p className="duraiton-300 text-2xl text-text transition-all group-hover:text-highlight">
                    Log In
                </p>
            </Link>
        </div>
    )
}
