import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import { BrandStackParamList } from '../../../../types'

type Brand = {
  id: string
  name: string
}

type Variables = {
  id?: string
  name?: string
}

const GET_BRAND = gql`
  query GetBrand($id: String!) {
    brand(id: $id) {
      id
      name
    }
  }
`
const UPDATE_BRAND = gql`
  mutation UpdateBrand($id: String!, $name: String!) {
    updateBrand(id: $id, name: $name) {
      id
      name
    }
  }
`
export default function BrandComponent(props: StackScreenProps<BrandStackParamList, 'Brand'>) {
  const { data, loading } = useQuery<{ brand: Brand }>(GET_BRAND, {
    variables: { id: props.route.params.id },
  })
  const [updateBrand] = useMutation<{ updateBrand: { id: string } }, Variables>(UPDATE_BRAND, {
    variables: { id: props.route.params.id },
  })

  const brand = data?.brand

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Brand</PageHeader>
      <Card>
        {loading && !brand && <ActivityIndicator />}
        {brand && (
          <>
            <View
              style={{
                height: 400,
                width: 400,
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://cdn.stocksnap.io/img-thumbs/960w/vintage-red_8QKIFL9ZUI.jpg',
                }}
                style={{
                  height: 400 - 20,
                  width: 400 - 20,
                  margin: 20 / 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View>
              <FieldWithLabel
                label="Name"
                value={brand.name}
                onChangeValue={(val) => updateBrand({ variables: { name: val } })}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
