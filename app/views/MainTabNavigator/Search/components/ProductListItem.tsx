import { Image, StyleSheet, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { AntDesign, Text } from '../../../components/Themed'

const CARD_SIZE = 80

type Props = {
  isFirst: boolean
  product: { image: string; name: string; brand: { name: string } }
  onPress?: (() => void) | undefined
}

export default function ProductListItem(props: Props): JSX.Element {
  return (
    <TouchableWithoutFeedback
      style={[style.result, { borderTopWidth: props.isFirst ? 0 : StyleSheet.hairlineWidth }]}
      onPress={props.onPress}>
      <View style={{ flexDirection: 'row', flexShrink: 1 }}>
        <Image
          source={{ uri: props.product.image }}
          style={{ height: CARD_SIZE, width: CARD_SIZE }}
        />
        <View style={{ padding: 10, flexShrink: 1 }}>
          <Text>{props.product.name}</Text>
          <Text secondary style={{ fontSize: 12 }}>
            {props.product.brand.name}
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
  )
}

const style = StyleSheet.create({
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopColor: '#999',
    marginHorizontal: 10,
  },
})
