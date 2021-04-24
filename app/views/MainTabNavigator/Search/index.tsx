import { ActivityIndicator, Image, StyleSheet, TextInput, View } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Text } from '../../components/Themed'
import { RootStackParamList } from '../../../types'

import ProductCard from './components/ProductCard'

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

function Center(props: { children: JSX.Element }): JSX.Element {
  return <View style={style.center}>{props.children}</View>
}

export default function SearchProducts({
  navigation: { navigate, setOptions },
}: Props): JSX.Element {
  const [input, setInput] = useState('')
  const shouldFetch = input.length > 3
  const { data, error } = useSWR(shouldFetch ? `/search?q=${input}` : null)
  const loading = shouldFetch && !data && !error
  const empty = shouldFetch && data && !data.products.length

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

      {data && (
        <ScrollView>
          {data.products.map((result: any, i: number) => (
            <ProductCard
              product={result}
              key={result.id}
              onPress={() => {
                if (navigate) navigate('Product', { productId: result.id })
              }}
            />
          ))}
        </ScrollView>
      )}
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
