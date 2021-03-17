import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import useSWR from 'swr'
import { StackNavigationProp } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '../components/Themed'
import { RootStackParamList } from '../types'

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Product'>

type Props = {
  navigation: ProductScreenNavigationProp
}

const SearchInputContainer = (props: any) => <View style={style.searchInputContainer} {...props} />

const SearchResultProduct = (props: {
  productId: string
  isLast: boolean
  navigate?: Props['navigation']['push']
  children: JSX.Element
}) => (
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

const SearchResultIngredient = (props: { isLast: boolean; children: JSX.Element }) => (
  <TouchableWithoutFeedback style={[style.result, props.isLast && style.noBorder].filter(Boolean)}>
    {props.children}
  </TouchableWithoutFeedback>
)

export default function SearchProductsIngredients({
  navigation: { navigate },
}: Props): JSX.Element {
  const [input, setInput] = useState('')
  const willFetch = input.length > 3
  const { data } = useSWR(willFetch ? `/search?q=${input}` : null)

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
      <ScrollView>
        {data ? (
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
        ) : (
          <View style={style.noResults}>
            <Text>No result yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { backgroundColor: '#eee', flexGrow: 1 },
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
})
