import { Brand } from '@hooks/stores/brand'
import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Link } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'

type Props<OwnedItem extends Brand | Ingredient | Constituent> = {
  children?: JSX.Element | false
  item: Partial<OwnedItem>
  entityLinkCreator: (entity: Partial<OwnedItem>) => string
  even: boolean
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
      <Link to={props.entityLinkCreator(props.item)}>
        <Text>{props.item.name}</Text>
      </Link>
      {props.children && <View>{props.children}</View>}
    </View>
  )
}
