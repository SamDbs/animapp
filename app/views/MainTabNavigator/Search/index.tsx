import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'

import { PageHeader, SafeAreaPage, Text, useThemeColor } from '../../components/Themed'
import { RootStackParamList } from '../../../types'

import ProductListItem from './components/ProductListItem'
import useSearchProducts from '../../../hooks/queries/SearchProducts'

type Props = BottomTabScreenProps<RootStackParamList, 'Product'>

function SearchInput(props: {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}) {
  const color = useThemeColor({}, 'inputText')
  const backgroundColor = useThemeColor({}, 'input')
  const placeholderColor = useThemeColor({}, 'inputPlaceholder')

  return (
    <View style={style.searchInputContainer}>
      <TextInput
        style={[style.searchInput, { color, backgroundColor }]}
        onChangeText={(event) => props.setInput(event)}
        value={props.input}
        returnKeyType="search"
        clearButtonMode="always"
        placeholder="Rechercher un produit ou une marque"
        placeholderTextColor={placeholderColor}
      />
    </View>
  )
}

function Center(props: { children: JSX.Element }): JSX.Element {
  return <View style={style.center}>{props.children}</View>
}

export default function SearchProducts({ navigation: { navigate } }: Props): JSX.Element {
  const [input, setInput] = useState('')
  const [fetch, { data, loading, error }] = useSearchProducts()

  const shouldFetch = input.length > 3

  useEffect(() => {
    if (shouldFetch) fetch({ variables: { q: input } })
  }, [input, shouldFetch])

  const empty = shouldFetch && data && !data?.products.length

  return (
    <SafeAreaPage>
      <PageHeader>Search a product</PageHeader>
      <ScrollView>
        <SearchInput input={input} setInput={setInput} />
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

        {data?.products.map((result, i) => (
          <ProductListItem
            product={result}
            key={result.id}
            onPress={() => {
              if (navigate) navigate('Product', { productId: result.id })
            }}
            isFirst={i === 0}
          />
        ))}
      </ScrollView>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  searchInputContainer: { padding: 10 },
  searchInput: {
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
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
