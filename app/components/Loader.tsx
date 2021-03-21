import React, { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

function Circle(props: { progress: Animated.Value; reverse?: boolean; size: number }): JSX.Element {
  const rotation = props.progress.interpolate({
    inputRange: [0, 1],
    outputRange: props.reverse ? ['0deg', '-360deg'] : ['0deg', '360deg'],
  })

  return (
    <Animated.View
      style={{
        borderWidth: 2,
        borderColor: 'transparent',
        borderTopColor: '#999999',
        borderRadius: props.size,
        height: props.size,
        position: 'absolute',
        transform: [{ rotate: rotation }],
        width: props.size,
      }}
    />
  )
}

export default function Loader(): JSX.Element {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start()
  }, [])

  return (
    <View
      style={{
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        position: 'relative',
        width: 40,
      }}>
      <Circle size={20} progress={progress} reverse />
      <Circle size={30} progress={progress} />
    </View>
  )
}
