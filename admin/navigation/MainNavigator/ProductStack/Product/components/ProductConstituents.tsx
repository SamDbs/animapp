import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import SubItem from '@components/SubItem'
import useGetProductConstituents, { Constituent } from '@hooks/queries/GetProductConstituents'
import GET_PRODUCT_CONSTITUENTS from '@hooks/queries/GetProductConstituents/query'
import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

import { GET_CONSTITUENTS } from '../../../ConstituentStack/Constituents/components/ConstituentList'
import AddProductConstituents from './AddProductConstituents'

type Props = { productId: string }

const REMOVE_PRODUCT_CONSTITUENT = gql`
  mutation RemoveProductIngredient($analyticalConstituentId: ID!, $productId: ID!) {
    removeConstituentFromProduct(
      analyticalConstituentId: $analyticalConstituentId
      productId: $productId
    ) {
      analyticalConstituentId
      productId
      quantity
    }
  }
`

type MutationVariables = {
  analyticalConstituentId?: string
  productId?: string
}

const refetchQueries = [GET_CONSTITUENTS, GET_PRODUCT_CONSTITUENTS]

export default function ProductAnalyticalConstituents(props: Props) {
  const { data } = useGetProductConstituents(props.productId)

  const [removeConstituentFromProduct] = useMutation<any, MutationVariables>(
    REMOVE_PRODUCT_CONSTITUENT,
    {
      variables: { productId: props.productId },
      refetchQueries,
    },
  )

  const [editing, setEditing] = useState(false)

  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 18 }}>Attached analytical constituents</Text>
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
        {data?.productConstituents &&
          data.productConstituents.map((productConstituents, i) => {
            return (
              <SubItem<Constituent>
                key={productConstituents.constituent.id}
                entityLinkCreator={(item) => `/ingredients/${item.id}`}
                even={i % 2 === 0}
                item={productConstituents.constituent}
                nameProp="name">
                <Text style={{ marginRight: 8 }}>{productConstituents.quantity}</Text>
                {editing && (
                  <Button
                    title="Remove"
                    onPress={() =>
                      removeConstituentFromProduct({
                        variables: { analyticalConstituentId: productConstituents.constituent.id },
                      })
                    }
                  />
                )}
              </SubItem>
            )
          })}
      </View>
      {data?.productConstituents && editing && (
        <AddProductConstituents
          productId={props.productId}
          alreadyAddedIds={data.productConstituents.map((x) => x.constituent.id)}
        />
      )}
      <Button title={editing ? 'Close' : 'Edit'} onPress={() => setEditing((x) => !x)} />
    </Card>
  )
}
