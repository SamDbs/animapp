import Card from '@components/Card'
import SubItem from '@components/SubItem'
import useIngredientsStore, { Ingredient } from '@hooks/stores/ingredient'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'

type Props = { style?: View['props']['style'] }

export default function IngredientsAnalyzer(props: Props) {
  const [ids, setIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [ingredients, guessIngredient, registerIds, unregisterIds] = useIngredientsStore(
    (state) => [state.ingredients, state.guessIngredients, state.registerIds, state.unregisterIds],
  )

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

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
      <Button
        onPress={async () => {
          setIsLoading(true)
          const { ids } = await guessIngredient(input)
          setIds(ids)
          setIsLoading(false)
        }}
        title="Search"
      />
      <Text style={{ marginTop: 20 }}>Found items</Text>
      {isLoading && <ActivityIndicator />}
      {ids.map((id, i) => (
        <View
          style={{
            marginTop: 16,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
          <SubItem<Ingredient>
            even={i % 2 === 0}
            item={ingredients[id]}
            entityLinkCreator={(item) => `/ingredients/${item.id}`}
          />
        </View>
      ))}
    </Card>
  )
}
