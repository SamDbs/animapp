import * as path from 'path'

import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist'
import { createConnection, getRepository } from 'typeorm'

const loadFixtures = async (fixturesPath: string) => {
  let connection

  try {
    connection = await createConnection()
    // await connection.synchronize()

    const loader = new Loader()
    loader.load(path.resolve(fixturesPath))

    const resolver = new Resolver()
    const fixtures = resolver.resolve(loader.fixtureConfigs)
    const builder = new Builder(connection, new Parser())

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture)
      await getRepository(entity.constructor.name).save(entity)
    }
  } catch (err) {
    throw err
  } finally {
    if (connection) {
      await connection.close()
    }
  }
}

loadFixtures('./fixtures')
  .then(() => {
    console.log('Fixtures are successfully loaded.')
  })
  .catch((err) => console.log(err))
