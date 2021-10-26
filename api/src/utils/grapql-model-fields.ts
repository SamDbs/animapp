import { BaseEntity } from 'typeorm'

function excludeFieldFromSelection(modelName: string, field: string) {
  if (modelName === 'product' && ['description'].includes(field)) return false
  if (modelName === 'ingredient' && ['name', 'review', 'description'].includes(field)) return false
  if (modelName === 'analyticalconstituent' && ['name', 'description'].includes(field)) return false
  if (modelName === 'faq' && ['question', 'answer'].includes(field)) return false
  return true
}

function mandatoryFields(modelName: string) {
  if (['product', 'faq', 'ingredient', 'analyticalconstituent'].includes(modelName)) return ['id']
  return []
}

export default function getSelectedFieldsFromForModel(info: any, model: typeof BaseEntity): any[] {
  const modelNameLowercase = model.name.toLowerCase()

  return info.operation.selectionSet.selections
    .find((y: any) => y.name.value === modelNameLowercase)
    ?.selectionSet.selections.map((x: any) => x.name.value)
    .filter((x: any) => excludeFieldFromSelection(modelNameLowercase, x))
    .concat(mandatoryFields(modelNameLowercase))
}
