import { gql, useMutation, useQuery } from '@apollo/client'
import SubItem from '@components/SubItem'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'

import {
  GET_INGREDIENTS,
  QueryReturnType,
  Ingredient,
} from '../../../IngredientStack/Ingredients/components/IngredientList'
import { GET_PRODUCT_INGREDIENTS } from './ProductIngredients'

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
  mutation AddIngredientToProduct(
    $ingredientId: ID!
    $productId: ID!
    $order: Int!
    $quantity: String
  ) {
    addIngredientToProduct(
      ingredientId: $ingredientId
      productId: $productId
      order: $order
      quantity: $quantity
    ) {
      productId
      ingredientId
      quantity
      order
    }
  }
`

const refetchQueries = [GET_PRODUCT_INGREDIENTS]

export default function AddProductIngredients(props: Props) {
  const { data, refetch } = useQuery<QueryReturnType>(GET_INGREDIENTS, {
    variables: { limit: LIMIT, offset: 0 },
  })

  const search = useSearch((searchTerms) => {
    refetch({ searchTerms })
  })

  const [addIngredientToProduct] = useMutation<MutationReturnType, MutationVariables>(
    ADD_PRODUCT_INGREDIENT,
    { refetchQueries },
  )

  const [quantities, setQuantites] = useState<Record<Ingredient['id'], string>>({})

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
        {data?.ingredients
          .filter((ingredient) => !props.alreadyAddedIds.includes(ingredient.id))
          .map((ingredient, i) => (
            <SubItem<Ingredient>
              key={ingredient.id}
              entityLinkCreator={() => 'lol'}
              item={ingredient}
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
                  setQuantites((prev) => ({ ...prev, [ingredient.id]: text }))
                }
                placeholder="quantity"
              />
              <Button
                title="Add"
                onPress={() =>
                  addIngredientToProduct({
                    variables: {
                      productId: props.productId,
                      ingredientId: ingredient.id,
                      order: data.ingredients.length,
                      quantity: quantities[ingredient.id],
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
