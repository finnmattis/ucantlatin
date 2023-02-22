import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, firestore } from "../lib/firebase"

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)
    const [profilePicture, setProfilePicture] = useState(null)

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe

        if (user) {
            const ref = doc(firestore, "users", user.uid)
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username)
                setProfilePicture(doc.data()?.photoURL)
            })
        } else {
            setUsername(null)
            setProfilePicture(null)
        }

        return unsubscribe
    }, [user])

    return { user, username, profilePicture }
}
