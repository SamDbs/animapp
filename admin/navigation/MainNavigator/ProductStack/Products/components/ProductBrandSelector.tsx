import { gql, useQuery } from '@apollo/client'
import SubItem from '@components/SubItem'
import useSearch from '@hooks/useSearch'
import React from 'react'
import { ActivityIndicator, Button, TextInput, View } from 'react-native'

const GET_POSSIBLE_BRANDS_FOR_PRODUCT = gql`
  query GetPossibleBrandsForProduct($searchTerms: String = "") {
    brands(offset: 0, limit: 5, searchTerms: $searchTerms) {
      id
      name
    }
  }
`

type Brand = {
  id: string
  name: string
}

type QueryReturnType = {
  brands: Brand[]
}

type QueryVariables = {
  limit: number
  searchTerms?: string
}

type Props = { onSelect: (ownerId: string) => void }

export default function ProductBrandSelector(props: Props) {
  const { data, loading, refetch } = useQuery<QueryReturnType, QueryVariables>(
    GET_POSSIBLE_BRANDS_FOR_PRODUCT,
  )

  const search = useSearch((searchTerms) => {
    refetch({ searchTerms })
  })

  if (loading) return <ActivityIndicator />

  return (
    <View>
      <TextInput
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          height: 30,
          paddingHorizontal: 8,
          marginVertical: 8,
        }}
        onChangeText={search}
        placeholder="Search"
      />
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        {data?.brands.map((brand, i) => (
          <SubItem<Brand>
            entityLinkCreator={() => 'lol'}
            even={i % 2 === 0}
            item={brand}
            key={brand.id}
            nameProp="name">
            <Button title="Select" onPress={() => props.onSelect(brand.id)} />
          </SubItem>
        ))}
      </View>
    </View>
  )
}
