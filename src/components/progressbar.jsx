export default function ProgressBar({ progress }) {
    return (
        <div className="mt-2 h-1 w-[60%] min-w-[450px]  bg-secondary">
            <div
                className="h-full bg-highlight"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}