import { Animated, Easing, View } from 'react-native'
import { useEffect, useRef } from 'react'

function Circle(props: {
  color: string
  progress: Animated.Value
  reverse?: boolean
  size: number
}): JSX.Element {
  const rotation = props.progress.interpolate({
    inputRange: [0, 1],
    outputRange: props.reverse ? ['0deg', '0deg'] : ['0deg', '0deg'],
  })

  return (
    <Animated.View
      style={{
        borderWidth: 2,
        borderColor: 'transparent',
        borderTopColor: props.color,
        borderRadius: props.size,
        height: props.size,
        position: 'absolute',
        transform: [{ rotate: rotation }],
        width: props.size,
      }}
    />
  )
}

export function Loader({ color = '#999999' }: { color?: string }): JSX.Element {
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
      <Circle color={color} size={20} progress={progress} reverse />
      <Circle color={color} size={30} progress={progress} />
    </View>
  )
}
