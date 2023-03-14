export default function TextField({ width, value, onChange }) {
    const lineNumbers = value.split("\n").map((_, index) => {
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
            <textarea
                className="grow resize-none overflow-hidden border-none bg-secondary text-white focus:outline-none"
                autoComplete="off"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
