import { gql, useQuery } from '@apollo/client'
import SubItem from '@components/SubItem'
import { Text, View } from '@components/Themed'
import React from 'react'
import { Button } from 'react-native'

type Brand = { id: number; name: string }

export const GET_BRAND = gql`
  query GetBrandProduct($id: String!) {
    brand(id: $id) {
      id
      name
    }
  }
`

type QueryReturnType = { brand: Brand }
type QueryVariables = { id: string }
type Props = { id: number; onRemove: () => void }

export default function ProductBrand(props: Props) {
  const { data } = useQuery<QueryReturnType, QueryVariables>(GET_BRAND, {
    variables: { id: props.id.toString() },
    skip: props.id === 0,
  })

  if (!data) return null

  return (
    <View
      style={{
        marginTop: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
      <SubItem<Brand> entityLinkCreator={() => 'lol'} even item={data.brand} nameProp="name">
        <Button title="Change" onPress={() => props.onRemove()} color="#c00" />
      </SubItem>
    </View>
  )
}
