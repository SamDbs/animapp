import { StyleSheet, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Card, Text } from '../../../components/Themed'

import { IngredientFound } from '../../../../hooks/queries/AnalyzeIngredients'
import IngredientRating from '../../../components/IngredientRating'

type IngredientCardProps = {
  ingredient: IngredientFound
  onPress?: (ingredient: IngredientCardProps['ingredient']) => void
}

const CARD_SIZE = 80

export default function IngredientCard(props: IngredientCardProps): JSX.Element {
  return (
    <Card style={{ height: 80 }}>
      <TouchableWithoutFeedback
        style={style.ingredientCard}
        onPress={() => props?.onPress?.(props.ingredient)}>
        <View style={{ padding: 10 }}>
          <Text>{props.ingredient.name}</Text>
        </View>
        <View
          style={{
            height: CARD_SIZE,
            width: CARD_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <IngredientRating rating={props.ingredient.rating} />
        </View>
      </TouchableWithoutFeedback>
    </Card>
  )
}

const style = StyleSheet.create({
  ingredientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
