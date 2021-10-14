import { BaseEntity } from 'typeorm'

export default function getSelectedFieldsFromForModel(info: any, model: typeof BaseEntity): any[] {
  const modelNameLowercase = model.name.toLowerCase()

  return info.operation.selectionSet.selections
    .find((y: any) => y.name.value === modelNameLowercase)
    ?.selectionSet.selections.map((x: any) => x.name.value)
}
