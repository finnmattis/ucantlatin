import { faCompass, faPen, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../../lib/context.js"
import {useRouter} from "next/router"
import {toast} from "react-hot-toast"

export default function index() {
    const { username } = useContext(UserContext)
    const router = useRouter()

    const goUserPage = () => {
        if (username) {
            router.push(`/terms/users/${username}`)
        }
        else {
            toast.error("Not signed up!")
        }
    }


    return (
        <div className="flex h-[90vh] items-center justify-center bg-primary">
            <Link href="/terms/explore">
                <div className="mx-10 flex h-[50vh] max-h-96 w-96 cursor-pointer flex-col items-center justify-center bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faCompass} className="mt-36" />
                    <p>Explore</p>
                </div>
            </Link>
            <Link href="/terms/create/new">
                <div className="mx-10 flex h-[50vh] max-h-96 w-96 cursor-pointer flex-col items-center rounded bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faPen} className="mt-36" />
                    <p>Create</p>
                </div>
            </Link>
            <button onClick={goUserPage}>
                <div className="mx-10 flex h-[50vh] w-96 max-h-96 cursor-pointer flex-col items-center rounded bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faUser} className="mt-36" />
                    <p>My Sets</p>
                </div>
            </button>
        </div>
    )
}
