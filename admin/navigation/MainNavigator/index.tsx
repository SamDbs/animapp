import useColorScheme from '@hooks/useColorScheme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as React from 'react'
import { View } from 'react-native'

import Colors from '../../constants/Colors'
import { MainTabParamList } from '../../types'
import BrandStack from './BrandStack'
import ConstituentStack from './ConstituentStack'
import Contacts from './Contacts'
import FaqStack from './FaqStack'
import IngredientStack from './IngredientStack'
import LanguageStack from './LanguageStack'
import ProductStack from './ProductStack'
import Menu from './components/Menu'

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
        <BottomTab.Screen name="BrandStack" component={BrandStack} />
        <BottomTab.Screen name="ConstituentStack" component={ConstituentStack} />
      </BottomTab.Navigator>
    </View>
  )
}
