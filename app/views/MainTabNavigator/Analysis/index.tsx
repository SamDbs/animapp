import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  Image,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback as T,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import React, { useCallback, useState } from 'react'
import * as Clipboard from 'expo-clipboard'

import { MainTabParamList } from '../../../types'
import { AntDesign, Card, SafeAreaPage, Text, Title, useThemeColor } from '../../components/Themed'
import { Button } from '../../components/Button'

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
  const [data, setData] = useState<any>(null)
  const [isModal, setIsModal] = useState(false)
  const [modalContent, setModalContent] = useState<any>(null)

  const backgroundColorCard = useThemeColor({}, 'card')
  const inputText = useThemeColor({}, 'inputText')
  const inputColor = useThemeColor({}, 'input')
  const placeholderColor = useThemeColor({}, 'inputPlaceholder')

  const search = useCallback(async () => {
    const request = await fetch(`http://10.0.2.2:8080/search/ingredients?q=${searchBox}`)
    // const request = await fetch(`${process.env.API_URL}/search/ingredients?q=${searchBox}`)
    const res = await request.json()
    setData(res)
  }, [searchBox])

  const paste = useCallback(async () => {
    try {
      const string = await Clipboard.getStringAsync()
      setSearchBox(string)
    } catch (e) {
      console.log('errrr', JSON.stringify(e))
      throw e
    }
  }, [])

  const clear = useCallback(async () => {
    setSearchBox('')
    setData(null)
  }, [])

  const ingredients = data && data?.map((x: any) => x.ingredientFound)?.filter(Boolean)

  return (
    <SafeAreaPage>
      <Title>Ingredients analysis</Title>
      <View
        style={{
          marginHorizontal: 8,
          flexDirection: 'row',
        }}>
        <Button onPress={() => paste()} title="Paste" style={{ flex: 1, marginRight: 5 }} />
        <Button
          onPress={() => clear()}
          title="Clear"
          style={{ flex: 1, marginLeft: 5 }}
          color="#be3636"
        />
      </View>
      <ScrollView style={style.scrollView}>
        <TextInput
          multiline
          numberOfLines={10}
          style={{
            margin: 10,
            minHeight: 200,
            padding: 10,
            color: inputText,
            borderRadius: 10,
            backgroundColor: inputColor,
          }}
          placeholder="Paste, your, ingredients, here"
          textAlignVertical="top"
          onChangeText={setSearchBox}
          value={searchBox}
          placeholderTextColor={placeholderColor}
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
