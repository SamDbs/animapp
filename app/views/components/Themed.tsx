import { AntDesign as DefaultAntDesign } from '@expo/vector-icons'
import { SafeAreaViewProps, SafeAreaView as SafeAreaViewSAC } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  SafeAreaView as DefaultSafeAreaView,
  Text as DefaultText,
  View as DefaultView,
} from 'react-native'
import React from 'react'

import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): string {
  const theme = useColorScheme()
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return Colors[theme][colorName]
  }
}

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}
export type TextProps = ThemeProps & DefaultText['props'] & { secondary?: boolean }
type ViewProps = ThemeProps & DefaultView['props']
type SafeAreaPageProps = ThemeProps & SafeAreaViewProps & { noContext?: boolean }

export function Text(props: TextProps): JSX.Element {
  const { darkColor, lightColor, style, ...otherProps } = props
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    props.secondary ? 'secondaryText' : 'text',
  )

  return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function Card(props: ViewProps): JSX.Element {
  const { darkColor, lightColor, style, ...otherProps } = props
  const backgroundColorCard = useThemeColor({ light: lightColor, dark: darkColor }, 'card')
  const cardShadowColor = useThemeColor({ light: lightColor, dark: darkColor }, 'shadowColor')

  return (
    <DefaultView
      style={[
        {
          backgroundColor: backgroundColorCard,
          borderRadius: 5,
          elevation: 5,
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 5,
          shadowColor: cardShadowColor,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0.3,
        },
        style,
      ]}
      {...otherProps}
    />
  )
}

export function SafeAreaPage(props: SafeAreaPageProps): JSX.Element {
  const { darkColor, lightColor, style, ...otherProps } = props
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  if (props.noContext)
    return <DefaultSafeAreaView style={[{ flex: 1, backgroundColor }, style]} {...otherProps} />

  return <SafeAreaViewSAC style={[{ flex: 1, backgroundColor }, style]} {...otherProps} />
}

export function Title(props: JSX.Element['props']): JSX.Element {
  const { darkColor, lightColor, style, ...otherProps } = props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultText style={[{ color, fontSize: 20, margin: 10 }, style]} {...otherProps} />
}

export function ContentView(props: ViewProps): JSX.Element {
  const { darkColor, lightColor, style, ...otherProps } = props
  const backgroundColorCard = useThemeColor({ light: lightColor, dark: darkColor }, 'card')

  return <DefaultView style={[{ backgroundColor: backgroundColorCard }, style]} {...otherProps} />
}

type AntDesignProps = ThemeProps & typeof DefaultAntDesign['defaultProps']
export function AntDesign(props: AntDesignProps): JSX.Element {
  const { darkColor, lightColor, ...otherProps } = props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultAntDesign color={color} {...otherProps} />
}

export function PageHeader(props: ViewProps): JSX.Element {
  const { children, style, ...otherProps } = props
  return (
    <DefaultView style={{ alignItems: 'center' }}>
      <DefaultView
        style={{
          height: 50,
          width: 50,
          borderRadius: 50,
          transform: [{ scaleX: 20 }, { scaleY: 5 }, { translateY: -20 }],
          position: 'absolute',
          overflow: 'hidden',
          backgroundColor: 'red',
          zIndex: 10,
          elevation: 10,
        }}
        {...otherProps}>
        <LinearGradient style={{ flex: 1 }} colors={['#F27A5E', '#F2CA80']} />
      </DefaultView>
      <DefaultView style={{ marginTop: 5, zIndex: 20, elevation: 20 }}>
        <Text style={{ color: '#222', fontSize: 18 }}>{children}</Text>
      </DefaultView>
    </DefaultView>
  )
}
