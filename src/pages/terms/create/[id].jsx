import {
    collection,
    collectionGroup,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import Link from "next/link"
import Page404 from "../../../../components/404"
import CreatePage from "../../../../components/create_page"
import { firestore } from "../../../../lib/firebase"

export async function getServerSideProps(context) {
    const { id } = context.params
    const setQuery = query(
        collectionGroup(firestore, "sets"),
        where("id", "==", id)
    )

    const setSnap = (await getDocs(setQuery)).docs[0]
    if (!setSnap) {
        return {
            props: {
                id: null,
                set: [],
                exists: false,
            },
        }
    }
    const wordsRef = collection(setSnap.ref, "words")
    let set = (await getDocs(wordsRef)).docs.map((doc) => doc.data())
    set.sort((a, b) => a.index - b.index)

    if (set.length === 0) {
        set = []
    }
    return {
        props: {
            id: id,
            set: set,
            exists: true,
        },
    }
}

export default function create({ id, set, exists }) {
    if (exists) {
        return <CreatePage id={id} set={set} />
    } else {
        return <Page404 name={"Oops! This set doesn't exist!"} />
    }
}
