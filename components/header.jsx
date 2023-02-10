import Link from "next/link"

export default function Header() {
    return (
        <header className="sticky h-[10vh] w-full flex justify-between items-center bg-primary border-b-2 border-gray-500">
            <Link
                href="/terms"
                className="group h-full mx-10 flex flex-col overflow-hidden"
            >
                <div className="h-full flex flex-col justify-center">
                    <p className="text-lg text-text">Terms</p>
                </div>
                <div className="hidden group-hover:block -my-2 h-15 grow rounded-lg bg-highlight"></div>
            </Link>
            <Link
                href="/"
                className="group h-full mx-10 flex flex-col overflow-hidden"
            >
                <div className="h-full flex flex-col justify-center">
                    <p className="text-lg text-text">Home</p>
                </div>
                <div className="hidden group-hover:block -my-2 h-15 grow rounded-lg bg-highlight"></div>
            </Link>
            <Link
                href="/dict"
                className="group h-full mx-10 flex flex-col overflow-hidden"
            >
                <div className="h-full flex flex-col justify-center">
                    <p className="text-lg text-text">Dictionary</p>
                </div>
                <div className="hidden group-hover:block -my-2 h-15 grow rounded-lg bg-highlight"></div>
            </Link>
        </header>
    )
}
