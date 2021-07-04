import { ActivityIndicator, Button, StyleSheet, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { AntDesign, Card, SafeAreaPage, Text } from '../../../components/Themed'

export default function Contact(): JSX.Element {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!name || !email || !message) {
      setError('please complete all the fields')
    } else {
      setError('')
    }
  }, [name, email, message])

  const sendContact = async () => {
    setLoading(true)
    const request = await fetch(`${process.env.API_URL}/contacts`, {
      method: 'post',
      body: JSON.stringify({ name, email, message }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!request.ok) {
      setIsSuccess(false)
      setLoading(false)
      return
    }
    setError('')
    setIsSuccess(true)
    setLoading(false)
  }

  return (
    <SafeAreaPage noContext>
      <View style={style.marginTop} />
      <Card style={style.card}>
        <TextInput
          editable={!isSuccess}
          style={style.input}
          placeholder="Your name"
          onChangeText={setName}
          returnKeyType="next"
        />
        <TextInput
          editable={!isSuccess}
          style={style.input}
          placeholder="Email"
          onChangeText={setEmail}
        />
        <TextInput
          editable={!isSuccess}
          multiline
          numberOfLines={10}
          onChangeText={setMessage}
          placeholder="Message"
          style={[style.input, style.big]}
          textAlignVertical="top"
        />
        {!!error && <Text style={style.error}>{error}</Text>}
        {isSuccess ? (
          <View style={{ alignItems: 'center' }}>
            <Text>Thank you for your message. We will reply by email as soon as possible.</Text>
            <AntDesign name="checkcircleo" size={24} />
          </View>
        ) : (
          <Button title="send" onPress={sendContact} disabled={loading || !!error} />
        )}
        {loading && <ActivityIndicator size={40} color="#ccc" />}
      </Card>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  card: { padding: 20 },
  marginTop: { height: 5 },
  error: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  big: { height: 120 },
})
