import { Brand } from '@hooks/stores/brand'
import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Link } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import React, { useState } from 'react'

export const ITEM_HEIGHT = 50

type Props<OwnedItem extends Brand | Ingredient | Constituent> = {
  children?: View['props']['children']
  entityLinkCreator: (entity: Partial<OwnedItem>) => string
  even: boolean
  item: Partial<OwnedItem>
} & (
  | { withOrder?: false }
  | {
      withOrder: true
      index: number
      onOrderChange: (current: number, movement: number) => Promise<void>
    }
)

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
          backgroundColor: props.even ? '#f5f5f5' : '#fff',
          flexDirection: 'row',
          height: ITEM_HEIGHT,
          justifyContent: 'space-between',
          padding: 8,
          shadowColor: 'rgba(4,9,20,0.10)',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: taken ? 10 : 0,
          transition: 'shadow 100ms, background 100ms',
          zIndex: taken ? 1 : 0,
        },
        animatedStyle,
      ]}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {props.withOrder && (
          <PanGestureHandler
            onGestureEvent={(e) => {
              if (e.nativeEvent.state === State.ACTIVE) {
                y.value = e.nativeEvent.translationY
              }
            }}
            onHandlerStateChange={(e) => {
              if (e.nativeEvent.state === State.END) {
                props.onOrderChange?.(props.index, y.value)
                take(false)
                y.value = 0
              } else {
                take(true)
              }
            }}>
            <MaterialIcons name="drag-handle" size={24} color="black" style={{ cursor: 'grab' }} />
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
