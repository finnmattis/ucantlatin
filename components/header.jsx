import Link from "next/link"

export default function Header() {
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
        </header>
    )
}
