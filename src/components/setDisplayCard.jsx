import Image from "next/image"
import { useRouter } from "next/router"

export default function SetDisplayCard({ set }) {
    const router = useRouter()
    return (
        <div
            onClick={() => router.push(`/terms/flashcards/${set.id}`)}
            className="group relative flex h-44 w-80 cursor-pointer flex-col overflow-hidden rounded bg-secondary sm:w-full"
        >
            <p className="ml-5 mt-2 text-3xl text-text">{set.name}</p>
            <p className="ml-5 mt-2 text-lg text-highlight">
                {set.length} term{set.length > 1 && "s"}
            </p>
            <div className="ml-5 mt-2 flex items-center">
                <div className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-secondary">
                    <Image
                        className="rounded-full"
                        src={set.photoURL}
                        fill
                        sizes="3rem"
                        alt="profile"
                    />
                </div>
                <p className="ml-2 text-2xl text-text">{set.username}</p>
            </div>
            <div className="absolute -bottom-4 h-4 w-full grow rounded-lg bg-highlight duration-200 ease-[cubic-bezier(.05,.43,.25,.95)] group-hover:my-2"></div>
        </div>
    )
}
