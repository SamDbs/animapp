import Image from '../models/image'

interface IImagesService {
  uploadImage(image: Buffer): Promise<string>
  getImage(url: Image['id']): Promise<Buffer>
}

export default class ImagesService implements IImagesService {
  async uploadImage(image: Buffer): Promise<string> {
    const img = Image.create({ image })
    await img.save()
    return `http://localhost:8080/api/images/${img.id}`
  }

  async getImage(id: Image['id']): Promise<Buffer> {
    const img = await Image.findOneOrFail({ where: { id } })
    return img.image
  }
}
