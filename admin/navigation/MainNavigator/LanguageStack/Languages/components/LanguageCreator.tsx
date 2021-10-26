import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

import { GET_LANGUAGES } from './LanguageList'

const initialState = { id: '', name: '' }

const CREATE_LANGUAGE = gql`
  mutation CreateLanguage($id: String!, $name: String!) {
    createLanguage(id: $id, name: $name) {
      id
      name
    }
  }
`

export default function LanguageCreator() {
  const [language, setLanguage] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createLanguage] = useMutation(CREATE_LANGUAGE, {
    refetchQueries: [GET_LANGUAGES],
  })
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createLanguage({ variables: { id: language.id, name: language.name } })
      setLanguage({ ...initialState })
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a language</Text>
      <FieldWithLabel
        label="ID"
        value={language.id}
        onChangeValue={(val) => setLanguage((current) => ({ ...current, id: val }))}
      />
      <FieldWithLabel
        label="Name"
        value={language.name}
        onChangeValue={(val) => setLanguage((current) => ({ ...current, name: val }))}
      />
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
