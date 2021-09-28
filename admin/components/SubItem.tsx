import { Brand } from '@hooks/stores/brand'
import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Link } from '@react-navigation/native'
import React from 'react'
import { Animated, Text, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'

type Props<OwnedItem extends Brand | Ingredient | Constituent> = {
  children?: View['props']['children']
  item: Partial<OwnedItem>
  entityLinkCreator: (entity: Partial<OwnedItem>) => string
  even: boolean
  withOrder?: boolean
}

export default function SubItem<OwnedItem extends Brand | Ingredient | Constituent>(
  props: Props<OwnedItem>,
) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: props.even ? '#f5f5f5' : '#fff',
        alignItems: 'center',
      }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {props.withOrder && (
          <PanGestureHandler onGestureEvent={console.log} onHandlerStateChange={console.warn}>
            <Animated.View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
          </PanGestureHandler>
        )}
        <Link to={props.entityLinkCreator(props.item)}>
          <Text>{props.item.name}</Text>
        </Link>
      </View>
      {props.children && <View style={{ flexDirection: 'row' }}>{props.children}</View>}
    </View>
  )
}
