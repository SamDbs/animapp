import useAuthStore from '@hooks/stores/auth'
import { Product } from '@hooks/stores/product'
import { UploadyContext, useItemFinishListener } from '@rpldy/uploady'
import Constants from 'expo-constants'
import React, { useCallback, useContext } from 'react'
import { Button } from 'react-native'
import { StateSelector, UseStore } from 'zustand'

type Props<StoreShape extends object, OwnerItem extends Product> = {
  uploadLinkCreator: (itemId: OwnerItem['id']) => string
  ownerId: OwnerItem['id']
  updateItemImageSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id'], image: string) => void
  >
  useOwnerStore: UseStore<StoreShape>
}

export default function UploadButton<ItemStore extends object, OwnerItem extends Product>({
  uploadLinkCreator,
  ownerId,
  updateItemImageSelector,
  useOwnerStore,
}: Props<ItemStore, OwnerItem>) {
  const jwt = useAuthStore((store) => store.jwt)
  const setImage = useOwnerStore(updateItemImageSelector)
  const uploady = useContext(UploadyContext)
  const onPress = useCallback(() => {
    uploady.showFileUpload({
      inputFieldName: 'image',
      destination: {
        headers: { Authorization: jwt },
        method: 'put',
        url: `${Constants.manifest?.extra?.API_URL}${uploadLinkCreator(ownerId)}`,
      },
    })
  }, [])
  useItemFinishListener((item) => {
    if (item.uploadStatus === 200)
      setImage(ownerId, `${item.uploadResponse.data.url}?${new Date().getTime()}`)
  })
  return <Button onPress={onPress} title="Replace picture" />
}
