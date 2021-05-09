import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'

import Card from '@components/Card'

import { createProduct } from '../../../../features/products/actions'
import { useDispatch, useSelector } from '../../../../hooks/redux'

function Row({
  label,
  onChangeValue,
  value,
}: {
  label: string
  onChangeValue: any
  value: string
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      <TextInput
        style={{ padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 3 }}
        onChangeText={onChangeValue}
        value={value}
      />
    </View>
  )
}

const initialState = { type: '', name: '', barCode: '', brandId: 3 }
export default function ProductCreator({ style }: any) {
  const dispatch = useDispatch()
  const [state, setState] = useState({ ...initialState })
  const isError = useSelector((state) => state.products.isCreationError)
  const errorMsg = useSelector((state) => state.products.creationErrorMsg)

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a product</Text>
      <Row
        label="Type"
        value={state.type}
        onChangeValue={(val: string) => setState((current) => ({ ...current, type: val }))}
      />
      <Row
        label="Name"
        value={state.name}
        onChangeValue={(val: string) => setState((current) => ({ ...current, name: val }))}
      />
      <Row
        label="Bar code"
        value={state.barCode}
        onChangeValue={(val: string) => setState((current) => ({ ...current, barCode: val }))}
      />
      {isError && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{errorMsg}</Text>
      )}
      <Button
        title="Create"
        onPress={async () => {
          const res = await dispatch(createProduct(state))
          if (res.meta.requestStatus === 'fulfilled') setState({ ...initialState })
        }}
      />
    </Card>
  )
}
