import Card from '@components/Card'
import useAuthStore from '@hooks/stores/auth'
import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'

export default function Login() {
  const loginAction = useAuthStore((state) => state.login)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [{ login, password }, setState] = useState({ login: '', password: '' })

  const loginAsync = async () => {
    setIsLoading(true)
    try {
      await loginAction({ login, password })
      setError('')
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Card style={{ margin: 32 }}>
        <TextInput
          style={{ padding: 8, marginBottom: 8 }}
          autoCompleteType="username"
          onChangeText={(text) => setState((oldState) => ({ ...oldState, login: text }))}
          value={login}
          placeholder="Login"
        />
        <TextInput
          style={{ padding: 8, marginBottom: 8 }}
          autoCompleteType="password"
          onChangeText={(text) => setState((oldState) => ({ ...oldState, password: text }))}
          secureTextEntry
          value={password}
          placeholder="Password"
        />
        <Button title="Log in" onPress={loginAsync} disabled={isLoading} />
        {isLoading && <Text>Loading...</Text>}
        {error ? <Text>{error}</Text> : null}
      </Card>
    </View>
  )
}
