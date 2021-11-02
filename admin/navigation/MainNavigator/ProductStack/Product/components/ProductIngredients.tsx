import { gql, useQuery, useMutation } from '@apollo/client'
import Card from '@components/Card'
import SubItem from '@components/SubItem'
import React from 'react'
import { Text, View } from 'react-native'

type Props = { productId: string }

const GET_PRODUCT_INGREDIENTS = gql`
  query GetProductIngredients($productId: String!) {
    productIngredients(productId: $productId) {
      quantity
      order
      ingredient {
        description
        id
        name
        review
      }
    }
  }
`
type Ingredient = {
  description: string
  id: string
  name: string
  review: string
}

type QueryReturnType = {
  productIngredients: {
    quantity: number
    order: number
    ingredient: Ingredient
  }[]
}

type QueryVariables = { productId: string }

export default function ProductIngredients(props: Props) {
  const { data } = useQuery<QueryReturnType, QueryVariables>(GET_PRODUCT_INGREDIENTS, {
    variables: { productId: props.productId },
  })

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
        }}>
        {data?.productIngredients &&
          data.productIngredients.map((productIngredient, i) => {
            return (
              <SubItem<Ingredient>
                entityLinkCreator={(item) => `/ingredients/${item.id}`}
                even={i % 2 === 0}
                item={productIngredient.ingredient}
                nameProp="name"
              />
            )
          })}
      </View>
    </Card>
  )
}
