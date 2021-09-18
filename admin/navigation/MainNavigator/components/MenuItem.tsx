import { Link } from '@react-navigation/native'
import * as React from 'react'
import { Text } from 'react-native'

type Props = { title: string; to: string }

export default function MenuItem({ to, title }: Props) {
  const isActive = window.location.pathname?.match(new RegExp('^' + to, 'i'))

  return (
    <Link
      to={to}
      style={{
        padding: 16,
        paddingLeft: isActive ? 24 : 16,
        transition: 'all 150ms linear',
        backgroundColor: isActive ? 'rgb(242,242,242)' : 'transparent',
      }}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </Link>
  )
}
