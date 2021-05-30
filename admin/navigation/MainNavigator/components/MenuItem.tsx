import { Link } from '@react-navigation/native'
import { Text } from 'react-native'
import * as React from 'react'

type Props = { title: string; to: string }

export default function MenuItem({ to, title }: Props) {
  return (
    <Link to={to} style={{ padding: 16 }}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </Link>
  )
}
