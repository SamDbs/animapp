import { gql, useQuery } from '@apollo/client'
import SubItem from '@components/SubItem'
import { View } from '@components/Themed'
import React from 'react'
import { Button } from 'react-native'

type Brand = { id: string; name: string }

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
type Props = { id: string; onRemove: () => void }

export default function ProductBrand(props: Props) {
  const { data } = useQuery<QueryReturnType, QueryVariables>(GET_BRAND, {
    variables: { id: props.id },
    skip: !props.id,
  })

  return (
    <View
      style={{
        marginTop: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
      {!data && (
        <SubItem<Brand> entityLinkCreator={() => ''} even item={{ id: '' }} nameProp="id" />
      )}
      {data && (
        <SubItem<Brand>
          entityLinkCreator={() => data.brand.id}
          even
          item={data.brand}
          nameProp="name">
          <Button title="Change" onPress={() => props.onRemove()} color="#c00" />
        </SubItem>
      )}
    </View>
  )
}
