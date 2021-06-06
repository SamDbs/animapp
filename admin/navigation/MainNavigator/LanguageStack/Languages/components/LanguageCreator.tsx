import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import useLanguageStore from '@hooks/stores/languages'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

const initialState = { id: '', name: '' }

export default function LanguageCreator() {
  const [language, setLanguage] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createLanguage = useLanguageStore((state) => state.createLanguage)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createLanguage(language)
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
