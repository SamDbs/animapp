import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import useSWR from 'swr'

import { Text } from '../components/Themed'

const SearchInputContainer = (props: any) => <View style={style.searchInputContainer} {...props} />

const SearchResult = (props: any) => (
  <View style={[style.result, props.isLast && style.noBorder].filter(Boolean)} {...props} />
)

export default function SearchProductsIngredients() {
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
              <SearchResult
                isLast={i === data.ingredients.length + data.products.length - 1}
                key={result.id}>
                <Text>{result.name}</Text>
              </SearchResult>
            ))}
            {data.ingredients.map((result: any, i: number) => (
              <SearchResult isLast={i === data.ingredients.length - 1} key={result.id}>
                <Text>{result.name}</Text>
              </SearchResult>
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
