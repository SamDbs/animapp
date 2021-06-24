import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Button, Image, StyleSheet, View } from 'react-native'
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import React, { useCallback, useState } from 'react'

import { MainTabParamList } from '../../../types'
import { AntDesign, Card, SafeAreaPage, Text, Title } from '../../components/Themed'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

type IngredientCardProps = {
  ingredient: { id: string; name: string; image: string }
  onPress?: () => void
}

const CARD_SIZE = 80
export function IngredientCard(props: IngredientCardProps): JSX.Element {
  return (
    <Card style={{ height: 80, marginVertical: 5, marginTop: 8 }}>
      <TouchableWithoutFeedback style={style.result} onPress={props.onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image
              source={{ uri: props.ingredient.image }}
              style={{
                height: CARD_SIZE,
                width: CARD_SIZE,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                overflow: 'hidden',
              }}
            />
          </View>
          <View style={{ padding: 10 }}>
            <Text>{props.ingredient.name}</Text>
          </View>
        </View>
        <View
          style={{
            height: CARD_SIZE,
            width: CARD_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="smileo" size={24} />
        </View>
      </TouchableWithoutFeedback>
    </Card>
  )
}

export default function Analysis({ navigation }: Props): JSX.Element {
  const [searchBox, setSearchBox] = useState('')
  const [data, setData] = useState<any>()

  const search = useCallback(async () => {
    const request = await fetch(`http://10.0.2.2:8080/search/ingredients?q=${searchBox}`)
    const res = await request.json()
    setData(res)
  }, [searchBox])

  const ingredients = data && data?.map((x: any) => x.ingredientFound)?.filter(Boolean)
  return (
    <SafeAreaPage>
      <Title>Ingredients analysis</Title>
      <ScrollView style={style.scrollView}>
        <TextInput
          multiline
          numberOfLines={10}
          style={{ backgroundColor: 'white' }}
          textAlignVertical="top"
          onChangeText={setSearchBox}
          value={searchBox}
        />
        <Button onPress={() => search()} title="Search" />
        {ingredients &&
          ingredients.map((ingredient: any) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
      </ScrollView>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  scrollView: { flexGrow: 1 },
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
