import { Image, useWindowDimensions, View } from 'react-native'

import { Text } from '../../components/Themed'

const IMG_MARGIN = 20

type Props = { product: { image: string; name: string; type: string; description: string } }

export default function ProductHeader({ product }: Props) {
  const dimensions = useWindowDimensions()
  const { width } = dimensions
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          height: width * 0.4,
          width: width * 0.4,
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: product.image }}
          style={{
            height: width * 0.4 - IMG_MARGIN,
            width: width * 0.4 - IMG_MARGIN,
            margin: IMG_MARGIN / 2,
            borderRadius: 5,
            overflow: 'hidden',
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{ width: width * 0.6 - 20, padding: 10 }}>
        <Text style={{ fontSize: 24 }}>{product.name}</Text>
        <Text style={{ fontSize: 12 }}>{product.type}</Text>
        <Text style={{ marginTop: 20 }}>{product.description}</Text>
      </View>
    </View>
  )
}
