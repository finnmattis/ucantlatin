import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import Page404 from "../../../components/404"
import Feed from "../../../components/Feed"
import { firestore } from "../../../lib/firebase"

const IN_LIMIT = 8

export async function getServerSideProps(context) {
    let { username } = context.params
    const userQuery = query(
        collection(firestore, "users"),
        where("username", "==", username)
    )

    const userSnap = (await getDocs(userQuery)).docs[0]
    if (!userSnap.exists()) {
        return {
            props: {
                uid: userSnap,
                username: username,
                initialSets: [],
                exists: false,
            },
        }
    }

    const setsQuery = query(
        collection(userSnap.ref, "sets"),
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

    username = username.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })

    return {
        props: {
            uid: userSnap.id,
            username: username,
            initialSets: setSnap,
            exists: true,
        },
    }
}

export default function username({ uid, username, initialSets, exists }) {
    if (!exists) {
        return <Page404 name={`Oops! The user ${username} does not exist!`} />
    } else {
        return (
            <div className="bg-primary min-h-[90vh] flex flex-col items-center">
                <p className="text-5xl text-text my-5">{username}'s Page</p>
                <Feed initialSets={initialSets} uid={uid} />
            </div>
        )
    }
}
