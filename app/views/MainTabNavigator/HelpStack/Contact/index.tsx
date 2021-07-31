import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { AntDesign, SafeAreaPage, Text, useThemeColor } from '../../../components/Themed'
import { Button } from '../../../components/Button'

export default function Contact(): JSX.Element {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const color = useThemeColor({}, 'inputText')
  const backgroundColor = useThemeColor({}, 'input')
  const placeholderColor = useThemeColor({}, 'inputPlaceholder')

  const inputStyle = { color, backgroundColor }

  useEffect(() => {
    if (!name || !email || !message) {
      setError('Please complete all the fields')
    } else {
      setError('')
    }
  }, [name, email, message])

  const sendContact = async () => {
    setLoading(true)
    const request = await fetch(`${process.env.API_URL}/contacts`, {
      // const request = await fetch(`http://10.0.2.2:8080/contacts`, {
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
    <SafeAreaPage noContext style={style.pageContainer}>
      <View style={style.marginTop} />
      <View style={style.text}>
        <Text>
          If you have any question you can contact us with this form. We will reply by email as soon
          as possible.
        </Text>
      </View>
      <TextInput
        editable={!isSuccess}
        style={[style.input, inputStyle]}
        placeholder="Your name"
        onChangeText={setName}
        returnKeyType="next"
        placeholderTextColor={placeholderColor}
      />
      <TextInput
        editable={!isSuccess}
        style={[style.input, inputStyle]}
        placeholder="Email"
        onChangeText={setEmail}
        placeholderTextColor={placeholderColor}
      />
      <TextInput
        editable={!isSuccess}
        multiline
        numberOfLines={10}
        onChangeText={setMessage}
        placeholder="Message"
        style={[style.input, inputStyle, style.big]}
        textAlignVertical="top"
        placeholderTextColor={placeholderColor}
      />
      {isSuccess ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={style.thanks}>Thank you for your message.</Text>
          <AntDesign name="checkcircleo" size={24} />
        </View>
      ) : (
        <Button
          style={style.button}
          title={error ? error : 'Send'}
          onPress={sendContact}
          disabled={loading || !!error}
        />
      )}
      {loading && <ActivityIndicator size={40} color="#ccc" />}
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  text: { margin: 10 },
  marginTop: { height: 5 },
  error: {
    marginBottom: 10,
  },
  input: {
    marginHorizontal: 10,
    marginBottom: 10,
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  big: { height: 120 },
  button: { marginHorizontal: 10 },
  thanks: { marginBottom: 5, marginHorizontal: 10 },
})
