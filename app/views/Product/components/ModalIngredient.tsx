import { useContext } from 'react'
import { Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Ingredient } from '../../../hooks/queries/GetProduct'

import { Card, Text, Title } from '../../components/Themed'

import IngredientModalContext from './context'

type Props = { ingredient: Ingredient }

export default function ModalIngredient({ ingredient }: Props) {
  const modal = useContext(IngredientModalContext)

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
      }}
      onPress={() => modal.open(null)}>
      <TouchableWithoutFeedback>
        <Card
          style={{
            elevation: 10,
            padding: 10,
            margin: 20,
          }}>
          <Title>{ingredient.name}</Title>
          <Text>{ingredient.description}</Text>
          <Text>{ingredient.review}</Text>
        </Card>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  )
}
