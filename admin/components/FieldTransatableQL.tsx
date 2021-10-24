import useLanguagesStore from '@hooks/stores/languages'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

type Props = { translations: { languageId: string; str: string }[] }

export default function FieldTranslatableQL(props: Props) {
  const [languages, getAllLanguages] = useLanguagesStore((state) => [
    Object.keys(state.languages).map((langId) => state.languages[langId]),
    state.getAllLanguages,
  ])

  useEffect(() => {
    getAllLanguages()
  }, [])

  if (!languages.length)
    return (
      <View>
        <Text>Loading languages</Text>
      </View>
    )

  return (
    <View>
      {languages.map((l) => (
        <View key={l.id}>
          <View>{l.name}</View>
          <View>{props.translations.find((x) => x.languageId === l.id)?.str}</View>
        </View>
      ))}
    </View>
  )
}
