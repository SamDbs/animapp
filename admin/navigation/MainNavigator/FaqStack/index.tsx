import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { FaqStackParamList } from '../../../types'
import Faq from './Faq'
import Faqs from './Faqs'

const Stack = createStackNavigator<FaqStackParamList>()

export default function FaqStack() {
  return (
    <Stack.Navigator
      initialRouteName="Faqs"
      screenOptions={{ animationEnabled: true, headerShown: false }}>
      <Stack.Screen name="Faqs" component={Faqs} />
      <Stack.Screen name="Faq" component={Faq} />
    </Stack.Navigator>
  )
}
