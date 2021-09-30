import { Brand } from '@hooks/stores/brand'
import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Link } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type Props<OwnedItem extends Brand | Ingredient | Constituent> = {
  children?: View['props']['children']
  item: Partial<OwnedItem>
  entityLinkCreator: (entity: Partial<OwnedItem>) => string
  even: boolean
  withOrder?: boolean
  onChangeOrder?: Function
}

export default function SubItem<OwnedItem extends Brand | Ingredient | Constituent>(
  props: Props<OwnedItem>,
) {
  const [taken, take] = useState(false)
  const y = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: y.value }],
    }),
    [taken, y.value],
  )

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          backgroundColor: taken ? '#c0c0c0' : props.even ? '#f5f5f5' : '#fff',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
          zIndex: taken ? 1 : 0,
          shadowColor: 'rgba(4,9,20,0.10)',
          shadowRadius: taken ? 10 : 0,
          shadowOffset: { width: 0, height: 0 },
          transition: 'shadow 100ms, background 100ms',
        },
        animatedStyle,
      ]}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {props.withOrder && (
          <PanGestureHandler
            onGestureEvent={(e) => (y.value = e.nativeEvent.translationY)}
            onHandlerStateChange={(e) => {
              console.log('onHandlerStateChange - e.nativeEvent.state', e.nativeEvent.state)
              if (e.nativeEvent.state === State.END) {
                take(false)
                y.value = 0
              } else {
                take(true)
              }
            }}>
            <View style={{ width: 20, height: 20, backgroundColor: 'red', cursor: 'grab' }} />
          </PanGestureHandler>
        )}
        <Link to={props.entityLinkCreator(props.item)}>
          <Text>{props.item.name}</Text>
        </Link>
      </View>
      {props.children && <View style={{ flexDirection: 'row' }}>{props.children}</View>}
    </Animated.View>
  )
}
