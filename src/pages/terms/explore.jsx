import {
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
import SetDisplayCard from "../../components/setDisplayCard"
import { firestore } from "../../lib/firebase"

const IN_LIMIT = 8
const LOAD_LIMIT = 4

export async function getServerSideProps() {
    const setQuery = query(
        collectionGroup(firestore, "sets"),
        orderBy("name"),
        limit(IN_LIMIT)
    )

    const setSnap = await Promise.all(
        (
            await getDocs(setQuery)
        ).docs.map(async (document) => {
            const authorDoc = doc(firestore, "users", document.data().author)
            const authorSnap = (await getDoc(authorDoc)).data()
            return {
                ...document.data(),
                username: authorSnap.username,
                photoURL: authorSnap.photoURL,
            }
        })
    )
    return {
        props: {
            initialSets: setSnap,
        },
    }
}

export default function explore({ initialSets }) {
    const [sets, setSets] = useState(initialSets)

    const loadMore = async () => {
        const last = sets[sets.length - 1]
        const setQuery = query(
            collectionGroup(firestore, "sets"),
            orderBy("name"),
            startAfter(last.name),
            limit(LOAD_LIMIT)
        )
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
        setSets([...sets, ...setSnap])
        console.log(sets)
    }

    //Detect last video being visible
    const observer = useRef()
    const lastSet = useCallback((node) => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore()
            }
        })
        if (node) observer.current.observe(node)
    })

    return (
        <div
            onClick={loadMore}
            className="flex min-h-[90vh] grid-cols-2 justify-center bg-primary"
        >
            <div className="my-5 grid w-[80%] grid-cols-responsive gap-4 sm:flex sm:flex-col">
                {sets.map((set, index) => {
                    return (
                        <div ref={index == sets.length - 1 ? lastSet : null}>
                            <SetDisplayCard key={set.id} set={set} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
