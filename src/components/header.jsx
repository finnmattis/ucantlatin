import { faBook, faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { UserContext } from "../lib/context"
import { auth } from "../lib/firebase"

export default function Header() {
    const { profilePicture } = useContext(UserContext)

    const [menuShown, setMenuShown] = useState(false)
    const profileRef = useRef()

    return (
        <header
            // Need menu to go on top of everything else if shown
            data-shown={menuShown}
            className="sticky flex h-[10vh] w-full items-center justify-evenly border-b-[1px] border-gray-500 bg-primary data-[shown=true]:z-30"
        >
            <Link
                href="/terms"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Terms</p>
                </div>
                <div className="grow rounded-lg bg-highlight duration-200 ease-[cubic-bezier(.05,.43,.25,.95)] group-hover:-my-2"></div>
            </Link>
            <Link
                href="/sentences"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Sentences</p>
                </div>
                <div className="grow rounded-lg bg-highlight duration-200 ease-[cubic-bezier(.05,.43,.25,.95)] group-hover:-my-2"></div>
            </Link>
            <Link
                href="/dict"
                className="group flex h-full flex-col overflow-hidden"
            >
                <div className="flex h-full flex-col justify-center">
                    <p className="text-lg text-text">Dictionary</p>
                </div>
                <div className="grow rounded-lg bg-highlight duration-200 ease-[cubic-bezier(.05,.43,.25,.95)] group-hover:-my-2"></div>
            </Link>
            <div
                ref={profileRef}
                onClick={() => setMenuShown(!menuShown)}
                className="absolute right-5 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-secondary text-4xl text-text sm:h-12 sm:w-12 sm:text-3xl"
            >
                {profilePicture ? (
                    <Image
                        className="rounded-full"
                        src={profilePicture}
                        fill
                        sizes="4rem, 3rem"
                        alt="profile"
                    ></Image>
                ) : (
                    <FontAwesomeIcon icon={faUser} />
                )}
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
    const { user, username } = useContext(UserContext)
    const menuRef = useRef()

    const signOut = async () => {
        await auth.signOut()
        toast.success("Signed out!")
        onClickOutside()
    }

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
            className="absolute top-24 right-5 flex h-60 w-64 flex-col items-center rounded bg-secondary drop-shadow-2xl transition-all duration-150 data-[show=false]:pointer-events-none data-[show=false]:top-28 data-[show=false]:opacity-0"
        >
            <p className="mt-5 text-3xl text-text">
                {username ? username : "Guest"}
            </p>
            {user ? (
                <div className="w-full">
                    <button
                        onClick={signOut}
                        className="mt-5 flex h-16 w-full items-center border-t-[1px] border-gray-500 transition duration-300 hover:bg-gray-500"
                    >
                        <div className="mx-5 text-2xl text-text">
                            <FontAwesomeIcon icon={faDoorOpen} />
                        </div>
                        <p className="text-2xl text-text">Sign Out</p>
                    </button>
                    <Link
                        href={`/terms/users/${username}`}
                        className="flex h-16 w-full cursor-pointer items-center border-t-[1px] border-gray-500 transition duration-300 hover:bg-gray-500"
                    >
                        <div className="mx-5 text-2xl text-text">
                            <FontAwesomeIcon icon={faBook} />
                        </div>
                        <p className="text-2xl text-text">My Sets</p>
                    </Link>
                </div>
            ) : (
                <Link
                    onClick={onClickOutside}
                    href="/enter"
                    className="mt-5 flex h-16 w-full cursor-pointer items-center border-t-[1px] border-gray-500 transition duration-300 hover:bg-gray-500"
                >
                    <div className="mx-5 text-2xl text-text">
                        <FontAwesomeIcon icon={faDoorOpen} />
                    </div>
                    <p className="text-2xl text-text">Sign In</p>
                </Link>
            )}
        </div>
    )
}
