import { faCodeCompare, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import DiffDisplay from "../../components/diffdisplay"
import TextField from "../../components/textfield"
import diff from "../../lib/diff"

export default function index() {
    const [text1, setText1] = useState("")
    const [text2, setText2] = useState("")

    const [editing, setEditing] = useState(true)
    const [diffLines, setDiffLines] = useState([])

    const onClick = () => {
        if (editing) {
            setDiffLines(diff(text1, text2))
            setEditing(false)
        } else {
            setEditing(true)
        }
    }

    return (
        <div className="flex min-h-[90vh] flex-col items-center bg-primary">
            <p className="mt-6 text-6xl text-white">Free Diff</p>
            <div className="flex w-full justify-evenly pt-8">
                {editing ? (
                    <TextField
                        width={45}
                        value={text1}
                        onChange={(e) => {
                            setText1(e.target.value)
                        }}
                    />
                ) : (
                    <DiffDisplay
                        width={45}
                        diffLines={diffLines}
                        additions={false}
                    />
                )}
                {editing ? (
                    <TextField
                        width={45}
                        value={text2}
                        onChange={(e) => {
                            setText2(e.target.value)
                        }}
                    />
                ) : (
                    <DiffDisplay
                        width={45}
                        diffLines={diffLines}
                        additions={true}
                    />
                )}
            </div>
            <button
                onClick={onClick}
                className="mt-4 h-16 w-16 rounded-full border-2 border-secondary text-3xl text-secondary"
            >
                <FontAwesomeIcon icon={editing ? faCodeCompare : faPen} />
            </button>
        </div>
    )
}
