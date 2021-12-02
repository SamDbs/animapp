import { BaseEntity } from 'typeorm'

function useFieldForSelection(modelName: string, field: string) {
  if (field === '__typename') return false
  if (modelName === 'product' && ['description', 'image', 'ingredients', 'constituents'].includes(field)) return false
  if (modelName === 'ingredient' && ['name', 'review', 'description'].includes(field)) return false
  if (modelName === 'analyticalconstituent' && ['name', 'description'].includes(field)) return false
  if (modelName === 'faq' && ['question', 'answer'].includes(field)) return false
  return true
}

function mandatoryFields(modelName: string) {
  if (['product', 'faq', 'ingredient', 'analyticalconstituent', 'contact'].includes(modelName)) return ['id']
  return []
}

export default function getSelectedFieldsFromForModel(info: any, model: typeof BaseEntity): any[] {
  const modelNameLowercase = model.name.toLowerCase()

  const fields = info.operation.selectionSet.selections
    .find((y: any) => y.name.value === modelNameLowercase)
    ?.selectionSet.selections.map((x: any) => x.name.value)
    .filter((x: any) => useFieldForSelection(modelNameLowercase, x))
    .concat(mandatoryFields(modelNameLowercase))
    .reduce((acc: any, cur: any) => (acc.includes(cur) ? acc : acc.concat(cur)), [])

  return fields
}
