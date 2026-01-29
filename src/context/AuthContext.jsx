import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { ensureUserDoc, subscribeUserDoc } from '../services/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    await signOut(auth)
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
        await ensureUserDoc({ uid: u.uid, nome_policial: u.displayName })

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
            setError(err)
            setLoading(false)
          },
        )
      } catch (e) {
        setError(e)
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
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
