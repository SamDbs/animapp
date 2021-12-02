import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import { useNavigation } from '@react-navigation/core'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

import { BrandStackParamList } from '../../../../types'

type Brand = {
  id: string
  name: string
  products: {
    id: string
    name: string
    type: string
  }[]
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
      products {
        id
        name
        type
      }
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
  const { navigate } = useNavigation()
  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Brand</PageHeader>
      <Card style={{ marginBottom: 10 }}>
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
      <Card>
        {loading && !brand && <ActivityIndicator />}
        {brand?.products && (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Type</DataTable.Title>
              </DataTable.Header>
              {brand?.products.map((product) => {
                return (
                  <DataTable.Row key={product.id}>
                    <DataTable.Cell>{product.name}</DataTable.Cell>
                    <DataTable.Cell>{product.type}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton
                        icon="eye"
                        onPress={() =>
                          navigate('ProductStack', {
                            screen: 'Product',
                            params: { id: product.id },
                          })
                        }
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              })}
            </DataTable>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
