import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback as T,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import React, { useCallback, useState } from 'react'

import { MainTabParamList } from '../../../types'
import { AntDesign, Card, SafeAreaPage, Text, Title, useThemeColor } from '../../components/Themed'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

type IngredientCardProps = {
  ingredient: { id: string; name: string; image: string }
  onPress?: (ingredient: IngredientCardProps['ingredient']) => void
}

const CARD_SIZE = 80
export function IngredientCard(props: IngredientCardProps): JSX.Element {
  return (
    <Card style={{ height: 80 }}>
      <TouchableWithoutFeedback
        style={style.result}
        onPress={() => props?.onPress?.(props.ingredient)}>
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
  const [isModal, setIsModal] = useState(false)
  const [modalContent, setModalContent] = useState<any>(null)

  const backgroundColorCard = useThemeColor({}, 'card')

  const search = useCallback(async () => {
    // const request = await fetch(`http://10.0.2.2:8080/search/ingredients?q=${searchBox}`)
    const request = await fetch(`${process.env.API_URL}/search/ingredients?q=${searchBox}`)
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
          style={{
            backgroundColor: 'white',
            margin: 10,
            minHeight: 200,
            padding: 10,
            borderRadius: 5,
          }}
          textAlignVertical="top"
          onChangeText={setSearchBox}
          value={searchBox}
        />
        <View style={{ marginHorizontal: 8, marginBottom: 10 }}>
          <Button onPress={() => search()} title="Search" />
        </View>
        {ingredients &&
          ingredients.map((ingredient: any) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onPress={(ingredient) => {
                setModalContent(ingredient)
                setIsModal(true)
              }}
            />
          ))}
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => setIsModal(false)}
        transparent
        visible={isModal}>
        <TouchableOpacity style={style.modal} activeOpacity={0.5} onPress={() => setIsModal(false)}>
          <T>
            {modalContent && (
              <View style={[style.modalContent, { backgroundColor: backgroundColorCard }]}>
                <Text selectable style={style.modalText}>
                  Name : {modalContent.name}
                </Text>
                <Text selectable style={style.modalText}>
                  Description : {modalContent.description}
                </Text>
                <Text selectable>Review : {modalContent.review}</Text>
              </View>
            )}
          </T>
        </TouchableOpacity>
      </Modal>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  scrollView: { flexGrow: 1 },
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(100,100,100,0.5)',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    marginBottom: 20,
  },
})
