export default function Input({
    name,
    func,
    value,
    type = "text",
    placeholder = "",
}) {
    return (
        <div className="mt-8 h-20 w-80">
            <span className="text-secondary">{name}</span>
            <input
                value={value}
                placeholder={placeholder}
                onChange={func}
                className="h-10 w-80 appearance-none rounded border-2 border-secondary bg-primary text-text outline-none drop-shadow-2xl transition duration-300 focus:border-highlight"
                type={type}
            />
        </div>
    )
}
