import { Link } from '@react-navigation/native'
import * as React from 'react'
import { Text } from 'react-native'

type Props = { title: string; to: string }

export default function MenuItem({ to, title }: Props) {
  return (
    <Link to={to} style={{ padding: 16 }}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </Link>
  )
}
