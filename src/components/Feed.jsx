import {
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from "firebase/firestore"
import { useCallback, useRef, useState } from "react"
import { firestore } from "../lib/firebase"
import SetDisplayCard from "./setDisplayCard"

const LOAD_LIMIT = 4

export default function Feed({ initialSets, uid = null }) {
    const [sets, setSets] = useState(initialSets)
    const [end, setEnd] = useState(false)

    const loadMore = async () => {
        const last = sets[sets.length - 1]
        let setQuery
        if (uid) {
            setQuery = query(
                collection(firestore, "users", uid, "sets"),
                orderBy("name"),
                startAfter(last.name),
                limit(LOAD_LIMIT)
            )
        } else {
            setQuery = query(
                collectionGroup(firestore, "sets"),
                orderBy("name"),
                startAfter(last.name),
                limit(LOAD_LIMIT)
            )
        }
        const setSnap = await Promise.all(
            (
                await getDocs(setQuery)
            ).docs.map(async (document) => {
                const authorDoc = doc(
                    firestore,
                    "users",
                    document.data().author
                )
                const authorSnap = (await getDoc(authorDoc)).data()
                return {
                    ...document.data(),
                    username: authorSnap.username,
                    photoURL: authorSnap.photoURL,
                }
            })
        )
        if (setSnap.length === 0) {
            setEnd(true)
        } else {
            setEnd(false)
        }
        setSets([...sets, ...setSnap])
    }

    //Detect last video being visible
    const observer = useRef()
    const lastSet = useCallback((node) => {
        if (end) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                console.log("LOADING MORE")
                loadMore()
            }
        })
        if (node) observer.current.observe(node)
    })

    return (
        <div className="my-5 grid w-[80%] grid-cols-4 gap-4 sm:flex sm:flex-col">
            {sets.map((set, index) => {
                return (
                    <div
                        ref={index == sets.length - 1 ? lastSet : null}
                        key={set.id}
                    >
                        <SetDisplayCard set={set} />
                    </div>
                )
            })}
        </div>
    )
}
