import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useSWR from 'swr'

import { RootStackParamList } from '../types'

import globalStyle from './components/style'

type Props = StackScreenProps<RootStackParamList, 'Ingredient'>

export default function Ingredient(props: Props): JSX.Element {
  const { data: ingredient } = useSWR(`/ingredients/${props.route.params.ingredientId}`)

  useEffect(() => {
    props.navigation.setOptions({ title: ingredient.name })
  }, [ingredient, props.navigation])

  if (!ingredient) return <Text>Loading...</Text>

  return (
    <SafeAreaView style={style.page}>
      <View style={{ ...globalStyle.card, padding: 10 }}>
        <Text>{ingredient.name}</Text>
        <Text>{ingredient.description}</Text>
        <Text>{ingredient.review}</Text>
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
})
