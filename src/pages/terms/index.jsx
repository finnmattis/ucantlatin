import { faCompass, faPen, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function index() {
    return (
        <div className="flex h-[90vh] items-center justify-center bg-primary">
            <Link href="/terms/explore">
                <div className="mx-10 flex h-[50vh] w-96 cursor-pointer flex-col items-center rounded bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faCompass} className="mt-36" />
                    <p>Explore</p>
                </div>
            </Link>
            <Link href="/terms/create/new">
                <div className="mx-10 flex h-[50vh] w-96 cursor-pointer flex-col items-center rounded bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faPen} className="mt-36" />
                    <p>Create</p>
                </div>
            </Link>
            <Link href="/terms/sets">
                <div className="mx-10 flex h-[50vh] w-96 cursor-pointer flex-col items-center rounded bg-secondary text-8xl text-primary transition-all duration-300 hover:bg-gray-500">
                    <FontAwesomeIcon icon={faUser} className="mt-36" />
                    <p>My Sets</p>
                </div>
            </Link>
        </div>
    )
}
