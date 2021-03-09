import * as React from 'react'
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import useSWR, { mutate } from 'swr'

import { Text, View } from '../components/Themed'

export default function TabTwoScreen() {
  const { data, error } = useSWR('/products/1')

  if (error)
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    )

  if (!data)
    return (
      <View>
        <Text>LOADIIING</Text>
      </View>
    )

  console.log(data)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>coucou</Text>
      <TouchableWithoutFeedback
        key={data.id}
        onPress={() => {
          if (data.isClicked) return
          mutate('/products/1', { ...data, name: `${data.name} clicked`, isClicked: true }, false)

          mutate(
            '/products',
            async (products) =>
              products.map((i) => {
                if (i.id === data.id) return { ...i, name: `${i.name} clicked`, isClicked: true }
                return i
              }),
            false,
          )
        }}>
        <View style={styles.product}>
          <Text>{data.type}</Text>
          <Text>{data.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  product: {
    padding: 10,
    borderBottomColor: 'silver',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
