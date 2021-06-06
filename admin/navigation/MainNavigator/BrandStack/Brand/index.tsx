import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import useBrandStore from '@hooks/stores/brand'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import { BrandStackParamList } from '../../../../types'

export default function Brand(props: StackScreenProps<BrandStackParamList, 'Brand'>) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const brand = useBrandStore((state) => state.brands[props.route.params.id])
  const [registerIds, unregisterIds, getBrandById, updateBrand] = useBrandStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getBrandById,
    state.updateBrand,
  ])

  useEffect(() => {
    if (!brand) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getBrandById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Brand</PageHeader>
      <Card>
        {isLoading && !brand && <ActivityIndicator />}
        {brand && (
          <>
            <View
              style={{
                height: 400,
                width: 400,
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://cdn.stocksnap.io/img-thumbs/960w/vintage-red_8QKIFL9ZUI.jpg',
                }}
                style={{
                  height: 400 - 20,
                  width: 400 - 20,
                  margin: 20 / 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View>
              <FieldWithLabel
                label="Name"
                value={brand.name}
                onChangeValue={(val) => updateBrand(brand.id, { name: val })}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
