import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import * as React from 'react'

import useColorScheme from '@hooks/useColorScheme'

import { MainTabParamList } from '../../types'
import Colors from '../../constants/Colors'
import Menu from './components/Menu'
import IngredientStack from './IngredientStack'
import LanguageStack from './LanguageStack'
import Contacts from './Contacts'
import FaqStack from './FaqStack'
import ProductStack from './ProductStack'

const BottomTab = createBottomTabNavigator<MainTabParamList>()

export default function TabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Menu />
      <BottomTab.Navigator
        initialRouteName="ProductStack"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
        tabBar={() => null}>
        <BottomTab.Screen name="IngredientStack" component={IngredientStack} />
        <BottomTab.Screen name="Contacts" component={Contacts} />
        <BottomTab.Screen name="LanguageStack" component={LanguageStack} />
        <BottomTab.Screen name="FaqStack" component={FaqStack} />
        <BottomTab.Screen name="ProductStack" component={ProductStack} />
      </BottomTab.Navigator>
    </View>
  )
}
