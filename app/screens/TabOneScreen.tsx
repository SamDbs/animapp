import * as React from 'react'
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import useSWR, { mutate } from 'swr'

import { Text, View } from '../components/Themed'

export default function TabOneScreen() {
  const { data, error } = useSWR('/products')

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map((item: any) => (
        <TouchableWithoutFeedback
          key={item.id}
          onPress={() =>
            mutate(
              '/products',
              data.map((i) => {
                if (i.id === item.id && !item.isClicked)
                  return { ...i, name: `${i.name} clicked`, isClicked: true }
                return i
              }),
              false,
            )
          }>
          <View style={styles.product}>
            <Text>{item.type}</Text>
            <Text>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
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
