import React, { useState } from 'react'
import { Button, TextInput } from 'react-native'

import { useDispatch, useSelector } from '../../hooks/redux'
import { Text, View } from '../../components/Themed'
import { login as loginAction } from '../../features/auth/actions'

export default function Login() {
  const dispatch = useDispatch()
  const { isLoading, jwt } = useSelector((state) => state.auth)
  const [{ login, password }, setState] = useState({ login: '', password: '' })

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
      <Button
        title="Log in"
        onPress={() => dispatch(loginAction({ login, password }))}
        disabled={isLoading}
      />
      {isLoading && <Text>Loading...</Text>}
    </View>
  )
}
