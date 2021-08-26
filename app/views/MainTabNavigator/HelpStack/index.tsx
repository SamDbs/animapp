import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import { HelpStackParamList } from '../../../types'

import Contact from './Contact'
import FrequentQuestions from './FrequentQuestions'
import HelpHome from './AboutHome'

const Stack = createStackNavigator<HelpStackParamList>()

export default function HelpStack(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AboutHome" component={HelpHome} options={{ title: 'About' }} />
      <Stack.Screen
        name="FrequentQuestions"
        component={FrequentQuestions}
        options={{ title: 'FAQ' }}
      />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  )
}
