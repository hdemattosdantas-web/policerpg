import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth } from "../firebase"
import { ensureUserDoc, subscribeUserDoc } from "../services/users"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (e) {
      setError(e)
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (e) {
      setError(e)
      throw e
    }
  }, [])

  useEffect(() => {
    let unsubUserDoc = null

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      try {
        setError(null)

        if (!u) {
          if (unsubUserDoc) {
            unsubUserDoc()
            unsubUserDoc = null
          }
          setFirebaseUser(null)
          setUserDoc(null)
          setLoading(false)
          return
        }

        setFirebaseUser(u)
        
        // Retry logic for user document
        let retryCount = 0
        const maxRetries = 3
        
        const tryEnsureUserDoc = async () => {
          try {
            await ensureUserDoc({ uid: u.uid, nome_policial: u.displayName })
          } catch (e) {
            if (retryCount < maxRetries && e.message.includes("offline")) {
              retryCount++
              await new Promise(resolve => setTimeout(resolve, 1000))
              return tryEnsureUserDoc()
            }
            throw e
          }
        }
        
        await tryEnsureUserDoc()
        
        if (unsubUserDoc) {
          unsubUserDoc()
          unsubUserDoc = null
        }

        unsubUserDoc = subscribeUserDoc(
          u.uid,
          (docData) => {
            setUserDoc(docData)
            setLoading(false)
          },
          (err) => {
            console.error("AuthContext subscription error:", err)
            if (err.message.includes("offline")) {
              setError(new Error("Conexão instável com o Firebase. Tente novamente."))
            } else {
              setError(err)
            }
            setLoading(false)
          },
        )
      } catch (e) {
        console.error("AuthContext error:", e)
        if (e.message.includes("offline")) {
          setError(new Error("Sem conexão com o servidor. Verifique sua internet e tente novamente."))
        } else {
          setError(e)
        }
        setLoading(false)
      }
    })

    return () => {
      if (unsubUserDoc) {
        unsubUserDoc()
        unsubUserDoc = null
      }
      unsubAuth()
    }
  }, [])

  const value = useMemo(
    () => ({
      firebaseUser,
      userDoc,
      loading,
      error,
      signInWithGoogle,
      logout,
    }),
    [firebaseUser, userDoc, loading, error, signInWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}