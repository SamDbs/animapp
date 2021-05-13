import { combine, devtools } from 'zustand/middleware'
import axios from 'axios'
import create from 'zustand'
import { useAuthStore } from '@hooks/stores'
import { filter, keyBy, keys, map, mapValues, omit, omitBy, pickBy, reduce } from 'lodash'

export type Contact = {
  id: string
}

const useContactsStore = create(
  devtools(
    combine(
      {
        contacts: {} as Record<Contact['id'], Contact>,
        usedContactIds: {} as Record<Contact['id'], number>,
      },
      (set) => ({
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
        createContact(params: { name: string; email: string; message: string }) {
          const { jwt } = useAuthStore.getState()
          return axios.post(`${process.env.API_URL}/contacts`, params, {
            headers: { Authorization: jwt },
          })
        },
      }),
    ),
  ),
)

export default useContactsStore
