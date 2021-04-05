import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import useSWR from 'swr'

import { Text } from '../../components/Themed'
import { RootStackParamList } from '../../../types'

type Props = BottomTabScreenProps<RootStackParamList, 'Product'>

function SearchInputContainer(props: any) {
  return <View style={style.searchInputContainer} {...props} />
}

function SearchResultProduct(props: {
  productId: number
  isLast: boolean
  navigate?: Props['navigation']['navigate']
  children: JSX.Element
}) {
  return (
    <TouchableWithoutFeedback
      style={[style.result, props.isLast && style.noBorder].filter(Boolean)}
      onPress={
        props.navigate
          ? () => props.navigate && props.navigate('Product', { productId: props.productId })
          : undefined
      }>
      {props.children}
    </TouchableWithoutFeedback>
  )
}

function SearchResultIngredient(props: { isLast: boolean; children: JSX.Element }) {
  return (
    <TouchableWithoutFeedback
      style={[style.result, props.isLast && style.noBorder].filter(Boolean)}>
      {props.children}
    </TouchableWithoutFeedback>
  )
}

function Center(props: { children: JSX.Element }): JSX.Element {
  return <View style={style.center}>{props.children}</View>
}

export default function SearchProductsIngredients({
  navigation: { navigate },
}: Props): JSX.Element {
  const [input, setInput] = useState('')
  const shouldFetch = input.length > 3
  const { data, error } = useSWR(shouldFetch ? `/search?q=${input}` : null)
  const loading = shouldFetch && !data && !error
  const empty = shouldFetch && error

  return (
    <SafeAreaView style={style.page}>
      <SearchInputContainer>
        <TextInput
          style={style.searchInput}
          onChangeText={(event) => setInput(event)}
          value={input}
          returnKeyType="search"
          clearButtonMode="always"
        />
      </SearchInputContainer>
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
              <SearchResultProduct
                productId={result.id}
                isLast={i === data.ingredients.length + data.products.length - 1}
                key={result.id}
                navigate={navigate}>
                <Text>{result.name}</Text>
              </SearchResultProduct>
            ))}
            {data.ingredients.map((result: any, i: number) => (
              <SearchResultIngredient isLast={i === data.ingredients.length - 1} key={result.id}>
                <Text>{result.name}</Text>
              </SearchResultIngredient>
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
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#ddd',
  },
  result: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'silver',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  noResults: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
