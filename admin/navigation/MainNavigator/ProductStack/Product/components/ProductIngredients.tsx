import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import SubItem from '@components/SubItem'
import useGetProductIngredients, { Ingredient } from '@hooks/queries/GetProductIngredients'
import GET_PRODUCT_INGREDIENTS from '@hooks/queries/GetProductIngredients/query'
import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

import { GET_INGREDIENTS } from '../../../IngredientStack/Ingredients/components/IngredientList'
import AddProductIngredients from './AddProductIngredients'

type Props = { productId: string }

const REMOVE_PRODUCT_INGREDIENT = gql`
  mutation RemoveProductIngredient($ingredientId: ID!, $productId: ID!) {
    removeIngredientFromProduct(ingredientId: $ingredientId, productId: $productId) {
      ingredientId
      order
      productId
      quantity
    }
  }
`

type MutationVariables = {
  ingredientId?: string
  productId?: string
}
const refetchQueries = [GET_INGREDIENTS, GET_PRODUCT_INGREDIENTS]

export default function ProductIngredients(props: Props) {
  const { data } = useGetProductIngredients(props.productId)

  const [removeIngredientFromProduct] = useMutation<any, MutationVariables>(
    REMOVE_PRODUCT_INGREDIENT,
    {
      variables: { productId: props.productId },
      refetchQueries,
    },
  )

  const [editing, setEditing] = useState(false)

  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 18 }}>Attached ingredients</Text>
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
        {data?.productIngredients &&
          data.productIngredients.map((productIngredient, i) => {
            return (
              <SubItem<Ingredient>
                key={productIngredient.ingredient.id}
                entityLinkCreator={(item) => `/ingredients/${item.id}`}
                even={i % 2 === 0}
                item={productIngredient.ingredient}
                nameProp="name">
                <Text style={{ marginRight: 8 }}>{productIngredient.quantity}</Text>
                {editing && (
                  <Button
                    title="Remove"
                    onPress={() =>
                      removeIngredientFromProduct({
                        variables: { ingredientId: productIngredient.ingredient.id },
                      })
                    }
                  />
                )}
              </SubItem>
            )
          })}
      </View>
      {data?.productIngredients && editing && (
        <AddProductIngredients
          productId={props.productId}
          alreadyAddedIds={data.productIngredients.map((x) => x.ingredient.id)}
        />
      )}
      <Button title={editing ? 'Close' : 'Edit'} onPress={() => setEditing((x) => !x)} />
    </Card>
  )
}
