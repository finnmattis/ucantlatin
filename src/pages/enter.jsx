import {
    faArrowLeft,
    faArrowRight,
    faUpload,
    faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import debounce from "lodash.debounce"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import CheckBox from "../components/checkbox"
import Input from "../components/input"
import { UserContext } from "../lib/context"
import { auth, firestore, googleAuth, storage } from "../lib/firebase"

export default function login() {
    //check username because google auth will connect firebase auth but not register a user in firestore
    const { username } = useContext(UserContext)
    const router = useRouter()

    useEffect(() => {
        if (username) {
            router.push("/")
        }
    }, [username])

    return (
        <div className="flex h-[90vh] flex-col items-center bg-primary">
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <div className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] -rotate-6 rounded bg-secondary drop-shadow-2xl sm:hidden"></div>
            <Page />
        </div>
    )
}

function Page() {
    const [frontPageNum, setFrontPageNum] = useState(0)
    const [backPageNum, setBackPageNum] = useState(0)
    const [flipped, setFlipped] = useState(false)
    //Need because creating user function is different if google auth is used
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    const [rightEnabled, setRightEnabled] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [profilePic, setProfilePic] = useState(null)

    const firebaseErrorToString = (err) => {
        //this turns the error into a string, takes off the first part, and turns it into titlecase
        const errorString = err.code
            .split("/")[1]
            .replace("-", " ")
            .replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        return errorString
    }

    const signInGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuth)
            //Can click button from Sign Up Page on second card
            setFlipped(false)
            setFrontPageNum(1)
            setRightEnabled(false)
            setIsGoogleAuth(true)
        } catch (err) {
            const errorString = firebaseErrorToString(err)
            toast.error(errorString)
        }
    }

    const createUser = async () => {
        const loadingToast = toast.loading("Loading...")
        if (!isGoogleAuth) {
            try {
                await createUserWithEmailAndPassword(auth, email, password)
            } catch (err) {
                toast.dismiss(loadingToast)
                throw err
            }
        }
        //Upload to storage
        const file = Array.from(profilePic)[0]
        const extension = file.type.split("/")[1]

        const vidRef = ref(
            storage,
            `profiles/${auth.currentUser.uid}.${extension}`
        )
        const vidTask = await uploadBytes(vidRef, file)
        let url = await getDownloadURL(vidTask.ref)

        const batch = writeBatch(firestore)
        const userDoc = doc(firestore, "users", auth.currentUser.uid)
        const usernameDoc = doc(firestore, "usernames", username)

        batch.set(userDoc, {
            username,
            photoURL: url,
        })
        batch.set(usernameDoc, { uid: auth.currentUser.uid })
        toast.dismiss(loadingToast)

        await batch.commit()

        toast.success("Done!")
    }

    const handleRight = async () => {
        if (!flipped && frontPageNum == 0) {
            try {
                await signInWithEmailAndPassword(auth, email, password)
            } catch (err) {
                toast.error(firebaseErrorToString(err))
                return
            }
        } else if (backPageNum == 1) {
            try {
                await createUser()
            } catch (err) {
                toast.error(firebaseErrorToString(err))
                setFrontPageNum(0)
                setBackPageNum(0)
                return
            }
        }

        if (flipped) {
            setFrontPageNum(frontPageNum + 1)
        } else {
            setBackPageNum(backPageNum + 1)
        }
        setFlipped(!flipped)
        setRightEnabled(false)
    }

    const flipLeft = () => {
        if (flipped) {
            setFrontPageNum(frontPageNum + 1)
        } else {
            setBackPageNum(backPageNum + 1)
        }

        setFlipped(!flipped)
    }

    return (
        <div
            className="absolute mt-10 h-[70vh] w-[30vw] min-w-[400px] rounded
            drop-shadow-2xl [perspective:1000px]"
        >
            <div
                data-flipped={flipped}
                className="relative h-full w-full duration-500 ease-[cubic-bezier(.05,.43,.25,.95)] [transform-style:preserve-3d] data-[flipped=true]:[transform:rotateY(180deg)]"
            >
                <div
                    className="absolute flex h-full w-full flex-col items-center
            rounded bg-secondary duration-700 ease-[cubic-bezier(.05,.43,.25,.95)] [backface-visibility:hidden]"
                >
                    {frontPageNum == 0 ? (
                        <SignPage
                            signType="in"
                            emailFunc={setEmail}
                            passwordFunc={setPassword}
                            completeFunc={setRightEnabled}
                            signInGoogleFunc={signInGoogle}
                            switchSignFunc={() => {
                                setFlipped(true)
                                setRightEnabled(false)
                            }}
                        />
                    ) : (
                        <UserNamePage
                            usernameFunc={setUsername}
                            completeFunc={setRightEnabled}
                        />
                    )}
                    <button
                        disabled={!rightEnabled}
                        onClick={handleRight}
                        className="absolute right-0 bottom-0 m-3 h-20 w-20 rounded-full bg-highlight text-3xl text-primary transition hover:scale-105 disabled:opacity-25"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    <button
                        disabled={backPageNum === 0}
                        onClick={flipLeft}
                        className="absolute left-0 bottom-0 m-3 h-20 w-20 rounded-full bg-highlight text-3xl text-primary transition hover:scale-105 disabled:opacity-25"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>
                <div
                    className="absolute flex h-full w-full flex-col items-center rounded
            bg-secondary [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                    {backPageNum == 0 ? (
                        <SignPage
                            signType="up"
                            emailFunc={setEmail}
                            passwordFunc={setPassword}
                            completeFunc={setRightEnabled}
                            signInGoogleFunc={signInGoogle}
                            switchSignFunc={() => {
                                setFlipped(false)
                                setRightEnabled(false)
                            }}
                        />
                    ) : (
                        <ProfilePage
                            profileFunc={setProfilePic}
                            completeFunc={setRightEnabled}
                        />
                    )}
                    <button
                        disabled={!rightEnabled}
                        onClick={handleRight}
                        className="absolute right-0 bottom-0 m-3 h-20 w-20 rounded-full bg-highlight text-3xl text-primary transition hover:scale-105 disabled:opacity-25"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    <button
                        disabled={backPageNum === 0}
                        onClick={flipLeft}
                        className="absolute left-0 bottom-0 m-3 h-20 w-20 rounded-full bg-highlight text-3xl text-primary transition hover:scale-105 disabled:opacity-25"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function SignPage({
    signType,
    emailFunc,
    passwordFunc,
    switchSignFunc,
    signInGoogleFunc,
    completeFunc,
}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)

    const checkComplete = (emailV, passwordV) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (
            emailV &&
            passwordV &&
            emailRegex.test(emailV) &&
            passwordV.length >= 6
        ) {
            emailFunc(emailV)
            passwordFunc(passwordV)
            completeFunc(true)
        } else {
            completeFunc(false)
        }
    }

    return (
        <>
            <p className="mt-5 text-5xl text-text">
                {signType == "in" ? "Sign In" : "Sign Up"}
            </p>
            <Input
                func={(e) => {
                    setEmail(e.target.value)
                    checkComplete(e.target.value, password)
                }}
                name="Email"
            />
            <Input
                func={(e) => {
                    setPassword(e.target.value)
                    checkComplete(email, e.target.value)
                }}
                name="Password"
                type={showPassword ? "text" : "password"}
            />
            <CheckBox
                name="Show Password"
                func={() => setShowPassword(!showPassword)}
            />
            <div className="mt-12 cursor-pointer" onClick={switchSignFunc}>
                <span className=" text-text">
                    {signType == "in"
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                </span>
                <span className="text-highlight">
                    {signType == "in" ? "Sign Up! " : "Sign In! "}
                    <FontAwesomeIcon icon={faArrowRight} />
                </span>
            </div>
            <p className="mt-2 mb-2 text-gray-500">OR</p>
            <button
                onClick={signInGoogleFunc}
                className="flex	 h-16 w-60 items-center rounded bg-primary drop-shadow-2xl"
            >
                <Image
                    className="ml-1"
                    src="/google.png"
                    alt="google"
                    height={48}
                    width={48}
                />
                <p className="align-center ml-3 flex text-text">
                    Sign in with Google
                </p>
            </button>
        </>
    )
}

function UserNamePage({ usernameFunc, completeFunc }) {
    const [username, setUsername] = useState("")

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3 && username.length <= 15) {
                const usernameRef = doc(firestore, "usernames", username)
                const usernameSnap = await getDoc(usernameRef)
                const exists = usernameSnap.exists()
                usernameFunc(username)
                completeFunc(!exists)
            }
        }, 500),
        []
    )

    const usernameChange = (e) => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        if (val.length < 3 || val.length > 15) {
            setUsername(val)
            completeFunc(false)
        }

        if (re.test(val)) {
            setUsername(val)
            completeFunc(false)
            checkUsername(val)
        }
    }

    return (
        <>
            <p className="mt-5 text-5xl text-text">Username</p>
            <Input func={usernameChange} name="Username" />
        </>
    )
}

function ProfilePage({ profileFunc, completeFunc }) {
    const [viewPic, setViewPic] = useState("")

    return (
        <>
            <p className="mt-5 text-5xl text-text">Profile Picture</p>
            <label
                className="mt-12 flex h-12 w-32 cursor-pointer items-center justify-center rounded bg-primary text-text drop-shadow-2xl"
                htmlFor="file-upload"
            >
                <span>
                    Upload File
                    <FontAwesomeIcon className="ml-1" icon={faUpload} />
                </span>
            </label>
            <input
                onChange={(e) => {
                    profileFunc(e.target.files)

                    const reader = new FileReader()
                    reader.onloadend = () => {
                        setViewPic(reader.result)
                    }
                    reader.readAsDataURL(e.target.files[0])
                    completeFunc(true)
                }}
                accept="image/*"
                id="file-upload"
                type="file"
                className="hidden"
            />
            <div className="relative mt-12 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary text-4xl text-text">
                {viewPic ? (
                    <Image
                        className="rounded-full"
                        src={viewPic}
                        fill
                        sizes="4rem"
                        alt="profile"
                    ></Image>
                ) : (
                    <FontAwesomeIcon icon={faUser} />
                )}
            </div>
        </>
    )
}
