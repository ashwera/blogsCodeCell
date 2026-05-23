import { db } from '../firebase'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

export const getBlogs = async () => {
  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((b) => b.published === true)
}

export const getAllBlogs = async () => {
  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const getBlog = async (id) => {
  const snap = await getDoc(doc(db, 'blogs', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export const createBlog = async (data, user) => {
  return addDoc(collection(db, 'blogs'), {
    ...data,
    authorName: user.displayName || user.email.split('@')[0],
    authorEmail: user.email,
    createdAt: serverTimestamp(),
    published: true,
  })
}

export const deleteBlog = async (id) => {
  await deleteDoc(doc(db, 'blogs', id))
}

// Approved emails are stored in Firestore at settings/allowlist { emails: string[] }
// Seed this document manually in the Firebase console.
export const getApprovedEmails = async () => {
  const snap = await getDoc(doc(db, 'settings', 'allowlist'))
  if (!snap.exists()) return []
  return snap.data().emails || []
}
