import { parseQueryToWordArray } from '../../../src/controllers/searchController'

describe('search multiple ingredients', () => {
  it('should find multiple ingredients', () => {
    const stringTest = `small, petits pois (pois), poisson (arete, 
      chair)`
    const tableauMots = parseQueryToWordArray(stringTest)
    expect(tableauMots).toEqual(['small', 'petits pois', 'poisson'])
  })
})
