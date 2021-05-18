import { combine, devtools } from 'zustand/middleware'
import axios from 'axios'
import create from 'zustand'
import useAuthStore from '@hooks/stores/auth'
import { keyBy, map, omit } from 'lodash'

export type Contact = {
  id: string
  name: string
  email: string
  message: string
}

export type ContactStoreState = {
  contacts: Record<Contact['id'], Contact>
  usedContactIds: Record<Contact['id'], number>
  registerIds: (ids: Contact['id'][]) => void
  unregisterIds: (ids: Contact['id'][]) => void
  getContacts: () => Promise<{ ids: Contact['id'][] }>
  searchContacts: (params: { name: string }) => Promise<{ ids: Contact['id'][] }>
}

const useContactsStore = create<ContactStoreState>(
  devtools((set) => ({
    contacts: {},
    usedContactIds: {},
    registerIds(ids: Contact['id'][]) {
      set((state) => {
        const update: Record<Contact['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedContactIds ? state.usedContactIds[id] + 1 : 1,
          }),
          {},
        )

        const newState = {
          ...state,
          usedContactIds: { ...state.usedContactIds, ...update },
        }

        const idsToDelete = Object.entries(newState.usedContactIds)
          .filter(([, value]) => value < 1)
          .map(([key]) => key)

        const finalState = {
          ...newState,
          contacts: omit(newState.contacts, idsToDelete),
          usedContactIds: omit(newState.usedContactIds, idsToDelete),
        }
        return finalState
      })
    },
    unregisterIds(ids: Contact['id'][]) {
      set((state) => {
        const update: Record<Contact['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedContactIds ? state.usedContactIds[id] - 1 : 0,
          }),
          {},
        )
        const newState = { ...state, usedContactIds: { ...state.usedContactIds, ...update } }
        return newState
      })
    },
    async getContacts() {
      const { jwt } = useAuthStore.getState()
      const { data } = await axios.get<Contact[]>(`${process.env.API_URL}/contacts`, {
        headers: { Authorization: jwt },
      })

      const contacts = data.map((contact) => ({ ...contact, id: contact.id.toString() }))

      const ids = map(contacts, (contact) => contact.id)
      const entities = keyBy(contacts, (contact) => contact.id)

      set((state) => ({ contacts: { ...state.contacts, ...entities } }))
      return { ids }
    },
    async searchContacts(params: { name: string }) {
      const { jwt } = useAuthStore.getState()
      const { data } = await axios.get<Contact[]>(`${process.env.API_URL}/contacts`, {
        headers: { Authorization: jwt },
        params,
      })

      const contacts = data.map((contact) => ({ ...contact, id: contact.id.toString() }))

      const ids = map(contacts, (contact) => contact.id)
      const entities = keyBy(contacts, (contact) => contact.id)

      set((state) => ({ contacts: { ...state.contacts, ...entities } }))
      return { ids }
    },
  })),
)

export default useContactsStore
