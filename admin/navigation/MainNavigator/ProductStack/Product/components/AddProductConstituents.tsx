import { gql, useMutation, useQuery } from '@apollo/client'
import SubItem from '@components/SubItem'
import GET_PRODUCT_CONSTITUENTS from '@hooks/queries/GetProductConstituents/query'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'

import {
  GET_CONSTITUENTS,
  QueryReturnType,
  Constituent,
} from '../../../ConstituentStack/Constituents/components/ConstituentList'

const LIMIT = 5

type Props = { alreadyAddedIds: string[]; productId: string }

type MutationReturnType = {
  addIngredientToProduct: {
    productId: string
    ingredientId: string
    quantity: string
    order: number
  }
}
type MutationVariables = {
  productId: string
  ingredientId: string
  quantity?: string
  order: number
}

const ADD_PRODUCT_INGREDIENT = gql`
  mutation AddConstituentTToProduct($ingredientId: ID!, $productId: ID!, $quantity: String) {
    addConstituentToProduct(
      analyticalConstituentId: $ingredientId
      productId: $productId
      quantity: $quantity
    ) {
      productId
      analyticalConstituentId
      quantity
    }
  }
`

const refetchQueries = [GET_PRODUCT_CONSTITUENTS]

export default function AddProductIngredients(props: Props) {
  const { data, refetch } = useQuery<QueryReturnType>(GET_CONSTITUENTS, {
    variables: { limit: LIMIT, offset: 0 },
  })

  const search = useSearch((searchTerms) => {
    refetch({ searchTerms })
  })

  const [addConstituentToProduct] = useMutation<MutationReturnType, MutationVariables>(
    ADD_PRODUCT_INGREDIENT,
    { refetchQueries },
  )

  const [quantities, setQuantites] = useState<Record<Constituent['id'], string>>({})

  return (
    <>
      <TextInput
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          height: 30,
          paddingHorizontal: 8,
          marginBottom: 8,
        }}
        onChangeText={search}
        placeholder="Search"
      />
      <View
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
        {data?.analyticalConstituents
          .filter((constituent) => !props.alreadyAddedIds.includes(constituent.id))
          .map((constituent, i) => (
            <SubItem<Constituent>
              key={constituent.id}
              entityLinkCreator={() => 'lol'}
              item={constituent}
              even={i % 2 === 0}>
              <TextInput
                style={{
                  padding: 8,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 3,
                  flex: 1,
                  marginRight: 8,
                }}
                onChangeText={(text) =>
                  setQuantites((prev) => ({ ...prev, [constituent.id]: text }))
                }
                placeholder="quantity"
              />
              <Button
                title="Add"
                onPress={() =>
                  addConstituentToProduct({
                    variables: {
                      productId: props.productId,
                      ingredientId: constituent.id,
                      order: data.analyticalConstituents.length,
                      quantity: quantities[constituent.id],
                    },
                  })
                }
              />
            </SubItem>
          ))}
      </View>
    </>
  )
}
