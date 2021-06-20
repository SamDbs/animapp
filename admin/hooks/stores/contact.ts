import { PaginationDetails } from '@hooks/useSearchableList'
import { keyBy, map, omit } from 'lodash'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from '.'

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
  searchContacts: (
    query: string,
    page?: number,
  ) => Promise<{ pagination: PaginationDetails; ids: Contact['id'][] }>
}

const useContactsStore = create<ContactStoreState>(
  devtools(
    (set) => ({
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
      async searchContacts(query: string, page = 0) {
        const { data } = await fetcher.get<{ pagination: PaginationDetails; contacts: Contact[] }>(
          `/contacts`,
          {
            params: { q: query, page },
          },
        )

        const contacts = data.contacts.map((contact) => ({ ...contact, id: contact.id.toString() }))

        const ids = map(contacts, (contact) => contact.id)
        const entities = keyBy(contacts, (contact) => contact.id)

        set((state) => ({ contacts: { ...state.contacts, ...entities } }))
        return { ids, pagination: data.pagination }
      },
    }),
    'contact',
  ),
)

export default useContactsStore
