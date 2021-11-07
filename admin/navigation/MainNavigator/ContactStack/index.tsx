import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ContactStackParamList } from '../../../types'
import Contact from './Contact'
import Contacts from './Contacts'

const Stack = createStackNavigator<ContactStackParamList>()

export default function ContactStack() {
  return (
    <Stack.Navigator
      initialRouteName="Contacts"
      screenOptions={{ animationEnabled: true, headerShown: false }}>
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  )
}
