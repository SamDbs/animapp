import { PaginationDetails } from '@hooks/useSearchableList'
import debounce from 'lodash/fp/debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

type Props = { onChangePage: Function; pagination: PaginationDetails }

export default function Pagination({ onChangePage, pagination }: Props) {
  const [currentPageText, setCurrentPageText] = useState('')
  const lastPageNumber = Math.ceil(pagination.count / pagination.limit)
  const isFirstPage = pagination.page === 0
  const isLastPage = pagination.page === lastPageNumber - 1

  const debouncedChangePage = useCallback(
    debounce(500, async (text: string) => {
      onChangePage(parseInt(text) - 1)
      setCurrentPageText('')
    }),
    [],
  )

  useEffect(() => {
    if (currentPageText) debouncedChangePage(currentPageText)
  }, [currentPageText])

  return (
    <View style={{ flexDirection: 'row', marginTop: 16 }}>
      <Pressable
        disabled={pagination.page === 0}
        onPress={() => onChangePage((page: number) => page - 1)}
        style={[style.button, isFirstPage && style.disabled]}>
        <Text>Previous</Text>
      </Pressable>

      <Pressable
        style={[style.button, isFirstPage && style.disabled]}
        onPress={() => onChangePage(0)}>
        <Text>1</Text>
      </Pressable>

      <View style={[style.button, style.input]}>
        <TextInput
          placeholder={(pagination.page + 1).toString()}
          onChangeText={setCurrentPageText}
          value={currentPageText}
        />
      </View>

      <Pressable
        style={[style.button, isLastPage && style.disabled]}
        onPress={() => onChangePage(lastPageNumber - 1)}>
        <Text>{isNaN(lastPageNumber) ? '-' : lastPageNumber}</Text>
      </Pressable>

      <Pressable
        disabled={pagination.page === lastPageNumber - 1}
        onPress={() => onChangePage((page: number) => page + 1)}
        style={[style.button, isLastPage && style.disabled]}>
        <Text>Next</Text>
      </Pressable>
    </View>
  )
}

const style = StyleSheet.create({
  button: {
    cursor: 'pointer',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
  },
  disabled: { backgroundColor: '#ccc', cursor: 'initial' },
  input: { width: 50 },
})
