export default function CheckBox({ name, func }) {
    return (
        <div>
            <input
                id="default-checkbox"
                onChange={func}
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-highlight ring-offset-gray-800 outline-none focus:ring-0 focus:ring-highlight dark:border-gray-600"
            />
            <label
                htmlFor="default-checkbox"
                className="ml-2 text-sm font-medium text-gray-500"
            >
                {name}
            </label>
        </div>
    )
}
