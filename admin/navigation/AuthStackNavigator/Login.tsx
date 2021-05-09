import { Button, TextInput } from 'react-native'
import React, { useState } from 'react'

import { Text, View } from '@components/Themed'
import { useAuthStore } from '@hooks/stores'

export default function Login() {
  const loginAction = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [{ login, password }, setState] = useState({ login: '', password: '' })

  const loginAsync = async () => {
    setIsLoading(true)
    try {
      await loginAction({ login, password })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View>
      <TextInput
        autoCompleteType="username"
        onChangeText={(text) => setState((oldState) => ({ ...oldState, login: text }))}
        value={login}
      />
      <TextInput
        autoCompleteType="password"
        onChangeText={(text) => setState((oldState) => ({ ...oldState, password: text }))}
        secureTextEntry
        value={password}
      />
      <Button title="Log in" onPress={loginAsync} disabled={isLoading} />
      {isLoading && <Text>Loading...</Text>}
    </View>
  )
}
