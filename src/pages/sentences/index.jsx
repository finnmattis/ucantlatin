import { faCompass, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function index() {
    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <p className="mt-6 text-6xl text-white">Practice Sentences</p>
            <div className="mt-6 flex w-[80%] justify-evenly sm:justify-around">
                <Link href="/sentences/browse">
                    <div className="flex aspect-[2/3] w-80 flex-col items-center justify-center rounded-lg bg-secondary drop-shadow-2xl sm:w-48">
                        <p className="text-6xl text-primary">Browse</p>
                        <FontAwesomeIcon
                            icon={faCompass}
                            className="mt-6 text-6xl text-primary"
                        />
                    </div>
                </Link>
                <Link href="/sentences/freediff">
                    <div className="flex aspect-[2/3] w-80 flex-col items-center justify-center rounded-lg bg-secondary drop-shadow-2xl sm:w-48">
                        <p className="text-6xl text-primary">Free Diff</p>
                        <FontAwesomeIcon
                            icon={faPen}
                            className="mt-6 text-6xl text-primary"
                        />
                    </div>
                </Link>
            </div>
        </div>
    )
}
