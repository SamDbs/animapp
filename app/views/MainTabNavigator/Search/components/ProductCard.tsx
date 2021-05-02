import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { AntDesign, Card, Text } from '../../../components/Themed'

const CARD_SIZE = 80

type Props = {
  product: { id: number; name: string; brand: string; photo: string }
  onPress?: (() => void) | undefined
}

export default function ProductCard(props: Props): JSX.Element {
  return (
    <Card style={{ height: 80, marginVertical: 5 }}>
      <TouchableWithoutFeedback style={style.result} onPress={props.onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image
              source={{ uri: props.product.photo }}
              style={{
                height: CARD_SIZE,
                width: CARD_SIZE,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                overflow: 'hidden',
              }}
            />
          </View>
          <View style={{ padding: 10 }}>
            <Text>{props.product.name}</Text>
            <Text secondary style={{ fontSize: 12 }}>
              {props.product.brand}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: CARD_SIZE,
            width: CARD_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="smileo" size={24} />
        </View>
      </TouchableWithoutFeedback>
    </Card>
  )
}

const style = StyleSheet.create({
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
