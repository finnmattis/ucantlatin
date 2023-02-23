export default function Input({
    name,
    func,
    value = "",
    type = "text",
    placeholder = "",
}) {
    return (
        <div className="mt-8 flex h-20 w-80 flex-col">
            <span className="text-gray-500">{name}</span>
            <input
                value={value}
                placeholder={placeholder}
                onChange={func}
                className="h-10 w-80 appearance-none rounded border-2 border-gray-500 bg-primary text-text outline-none drop-shadow-2xl transition duration-300 focus:border-highlight"
                type={type}
            />
        </div>
    )
}