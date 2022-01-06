import { StackScreenProps } from '@react-navigation/stack'
import { useContext, useEffect, useState } from 'react'

import { RootStackParamList } from '../../types'
import { SafeAreaPage, Text } from '../components/Themed'
import ProductHistoryContext from '../../hooks/ProductHistoryContext'
import useGetProduct from '../../hooks/queries/GetProduct'

import IngredientModalContext from './components/context'
import ModalIngredient from './components/ModalIngredient'
import ProductDetails from './components/ProductDetails'
import ProductHeader from './components/ProductHeader'

type Props = StackScreenProps<RootStackParamList, 'Product'>

function ProductView(props: Props): JSX.Element {
  const { data, loading } = useGetProduct(props.route.params.productId)
  const { viewProduct } = useContext(ProductHistoryContext)
  const modal = useContext(IngredientModalContext)

  const product = data?.product

  useEffect(() => {
    if (product && product.id) {
      props.navigation.setOptions({ title: product.name })
      viewProduct(product.id)
    }
  }, [product, viewProduct, props.navigation])

  if (loading) return <Text>Loading...</Text>

  const foundIngredient = product?.ingredients?.find(
    ({ ingredient }) => ingredient.id === modal.ingredientId,
  )

  if (!product) return <Text>Loading product...</Text>

  const hasDetails = product.ingredients || product.constituents

  return (
    <SafeAreaPage noContext>
      <ProductHeader product={product} />

      {hasDetails && (
        <ProductDetails constituents={product.constituents} ingredients={product.ingredients} />
      )}

      {modal.ingredientId && foundIngredient && (
        <ModalIngredient ingredient={foundIngredient.ingredient} />
      )}
    </SafeAreaPage>
  )
}

export default function Product(props: Props): JSX.Element {
  const [ingredientId, open] = useState<string | null>(null)

  return (
    <IngredientModalContext.Provider value={{ ingredientId, open }}>
      <ProductView {...props} />
    </IngredientModalContext.Provider>
  )
}
