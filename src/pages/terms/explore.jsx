import {
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
} from "firebase/firestore"
import Feed from "../../components/Feed"
import { firestore } from "../../lib/firebase"

const IN_LIMIT = 8

export async function getServerSideProps() {
    const setsQuery = query(
        collectionGroup(firestore, "sets"),
        orderBy("name"),
        limit(IN_LIMIT)
    )

    const setSnap = await Promise.all(
        (
            await getDocs(setsQuery)
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
    return (
        <div className="min-h-[90vh] bg-primary flex justify-center">
            <Feed initialSets={initialSets} />
        </div>
    )
}
