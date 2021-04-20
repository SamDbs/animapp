import { ActivityIndicator, Image, StyleSheet, TextInput, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Text } from '../../components/Themed'
import { RootStackParamList } from '../../../types'
import globalStyle from '../../components/style'

type Props = BottomTabScreenProps<RootStackParamList, 'Product'>

function SearchInput(props: {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <View style={style.searchInputContainer}>
      <TextInput
        style={style.searchInput}
        onChangeText={(event) => props.setInput(event)}
        value={props.input}
        returnKeyType="search"
        clearButtonMode="always"
      />
    </View>
  )
}

const CARD_SIZE = 80

function SearchResult(props: {
  product: { id: number; name: string; brand: string; photo: string }
  navigate?: Props['navigation']['navigate']
}) {
  return (
    <TouchableWithoutFeedback
      style={style.result}
      onPress={
        props.navigate
          ? () => props.navigate && props.navigate('Product', { productId: props.product.id })
          : undefined
      }>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Image
            source={{ uri: props.product.photo }}
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
          <Text>{props.product.name}</Text>
          <Text style={{ fontSize: 12, color: '#444' }}>{props.product.brand}</Text>
        </View>
      </View>
      <View
        style={{
          height: CARD_SIZE,
          width: CARD_SIZE,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AntDesign name="smileo" size={24} color="black" />
      </View>
    </TouchableWithoutFeedback>
  )
}

function Center(props: { children: JSX.Element }): JSX.Element {
  return <View style={style.center}>{props.children}</View>
}

export default function SearchProducts({ navigation: { navigate } }: Props): JSX.Element {
  const [input, setInput] = useState('')
  const shouldFetch = input.length > 3
  const { data, error } = useSWR(shouldFetch ? `/search?q=${input}` : null)
  const loading = shouldFetch && !data && !error
  const empty = shouldFetch && error

  return (
    <SafeAreaView style={style.page}>
      <SearchInput input={input} setInput={setInput} />
      {!shouldFetch && (
        <Center>
          <Text>Please type something</Text>
        </Center>
      )}
      {loading && (
        <Center>
          <ActivityIndicator size={40} color="#ccc" />
        </Center>
      )}
      {empty && (
        <Center>
          <Text>No result</Text>
        </Center>
      )}
      <ScrollView>
        {data && (
          <>
            {data.products.map((result: any, i: number) => (
              <SearchResult product={result} key={result.id} navigate={navigate} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#eee' },
  searchInputContainer: { padding: 10 },
  searchInput: {
    backgroundColor: '#ddd',
    borderRadius: 15,
    padding: 10,
  },
  result: {
    ...globalStyle.card,
    flexDirection: 'row',
    height: 80,
    marginVertical: 5,
  },
  noResults: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
