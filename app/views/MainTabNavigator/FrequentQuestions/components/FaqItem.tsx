import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export type FaqItemType = { id: number; question: string; answer: string }

type Props = { item: FaqItemType }

function Title(props: JSX.Element['props']) {
  return <Text style={style.title}>{props.children}</Text>
}
export default function FaqItem(props: Props): JSX.Element {
  const [height, setHeight] = useState(0)
  const [target, setTarget] = useState(1)
  const animation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    setTarget(0)
  }, [])

  useEffect(() => {
    Animated.timing(animation, {
      toValue: target,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start()
  }, [animation, target])

  return (
    <View style={style.component}>
      <TouchableWithoutFeedback onPressIn={() => setTarget(target === 0 ? 1 : 0)}>
        <Title>{props.item.question}</Title>
      </TouchableWithoutFeedback>
      <Animated.View
        onLayout={(e) => height === 0 && setHeight(e.nativeEvent.layout.height)}
        style={
          height !== 0
            ? {
                maxHeight: animation.interpolate({ inputRange: [0, 1], outputRange: [0, height] }),
                overflow: 'scroll',
              }
            : undefined
        }>
        <Text>{props.item.answer}</Text>
      </Animated.View>
    </View>
  )
}

const style = StyleSheet.create({
  component: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
})
