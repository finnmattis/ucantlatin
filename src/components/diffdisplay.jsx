export default function DiffDisplay({ width, diffLines, additions }) {
    const lineNumbers = diffLines.map((_, index) => {
        return (
            <p key={index} className="text-white">
                {index + 1}
            </p>
        )
    })

    return (
        <div
            className="flex border-[1px] border-gray-500 bg-secondary"
            style={{ width: `${width}%` }}
        >
            <div className="m-2">{lineNumbers}</div>
            <div className="mt-[0.45rem] block">
                {diffLines.map((l, i) => (
                    <div key={i} className="text-md ml-[0.5rem]">
                        {l
                            .filter(
                                (d) =>
                                    d.type === "match" ||
                                    (d.type === "insert" && additions) ||
                                    (d.type === "delete" && !additions)
                            )
                            .map((d, i) => (
                                <span key={i}>
                                    {d.type === "match" ? (
                                        <span className="text-white">
                                            {d.val}
                                        </span>
                                    ) : (
                                        <span
                                            className={
                                                additions
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {d.val}
                                        </span>
                                    )}
                                </span>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
