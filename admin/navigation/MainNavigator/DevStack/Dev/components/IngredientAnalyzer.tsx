import Card from '@components/Card'
import SubItem from '@components/SubItem'
import useAnalyzeIngredients, { IngredientFound } from '@hooks/queries/AnalyzeIngredients'
import React, { useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'

type Props = { style?: View['props']['style'] }

export default function IngredientsAnalyzer(props: Props) {
  const [input, setInput] = useState('')
  const [fetch, { loading, data }] = useAnalyzeIngredients()

  return (
    <Card style={props.style}>
      <Text style={{ fontSize: 18 }}>Ingredients analyzer</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type / paste ingredients"
        multiline
        numberOfLines={15}
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          padding: 8,
          marginVertical: 8,
        }}
      />
      <Button onPress={() => fetch({ variables: { q: input } })} title="Search" />
      <Text style={{ marginTop: 20 }}>Found items</Text>
      {loading && <ActivityIndicator />}
      {data?.analyzeIngredients
        .filter((x) => x.ingredientFound)
        .map((x, i) => (
          <View
            style={{
              marginTop: 16,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
            <SubItem<IngredientFound>
              even={i % 2 === 0}
              item={x.ingredientFound}
              entityLinkCreator={(item) => `/ingredients/${item.id}`}
            />
          </View>
        ))}
    </Card>
  )
}
