import Link from "next/link"

export default function Page404({ name }) {
    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <p className="mt-20 text-5xl text-text">{name}</p>
            <Link href="/">
                <button className="mt-10 h-12 w-48 rounded bg-highlight text-3xl text-primary">
                    Back Home
                </button>
            </Link>
        </div>
    )
}
