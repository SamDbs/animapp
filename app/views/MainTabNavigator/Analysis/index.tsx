import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback as T,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import React, { useCallback, useState } from 'react'
import * as Clipboard from 'expo-clipboard'

import { MainTabParamList } from '../../../types'
import { PageHeader, SafeAreaPage, Text, useThemeColor } from '../../components/Themed'
import { Button } from '../../components/Button'
import useAnalyzeIngredients from '../../../hooks/queries/AnalyzeIngredients'
import IngredientCard from './components/IngredientCard'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

export default function Analysis({ navigation }: Props): JSX.Element {
  const [searchBox, setSearchBox] = useState('')
  const [fetch, { loading, data, error }] = useAnalyzeIngredients()

  const [isSearched, setIsSearched] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [modalContent, setModalContent] = useState<any>(null)

  const backgroundColorCard = useThemeColor({}, 'card')
  const inputText = useThemeColor({}, 'inputText')
  const inputColor = useThemeColor({}, 'input')
  const placeholderColor = useThemeColor({}, 'inputPlaceholder')

  const search = useCallback(async () => {
    fetch({ variables: { q: searchBox } })
    setIsSearched(true)
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
    setIsSearched(false)
  }, [])

  const ingredients =
    data && data.analyzeIngredients?.map((x) => x.ingredientFound)?.filter(Boolean)

  return (
    <SafeAreaPage>
      <PageHeader>Ingredients analysis</PageHeader>
      <View
        style={{
          marginHorizontal: 8,
          marginTop: 30,
          flexDirection: 'row',
        }}>
        <Button onPress={() => paste()} title="Paste" style={{ flex: 1, marginRight: 5 }} />
        <Button
          onPress={() => clear()}
          title="Clear"
          style={{ flex: 1, marginLeft: 5 }}
          color="#F27A5E"
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
        {isSearched && !ingredients?.length && (
          <Text style={style.nothing}>No ingredient found in our database.</Text>
        )}
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
  nothing: { padding: 10 },
})
