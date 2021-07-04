import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import { HelpStackParamList } from '../../../types'

import Contact from './Contact'
import FrequentQuestions from './FrequentQuestions'
import HelpHome from './HelpHome'

const Stack = createStackNavigator<HelpStackParamList>()

export default function HelpStack(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HelpHome" component={HelpHome} options={{ title: 'Help' }} />
      <Stack.Screen
        name="FrequentQuestions"
        component={FrequentQuestions}
        options={{ title: 'FAQ' }}
      />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  )
}
