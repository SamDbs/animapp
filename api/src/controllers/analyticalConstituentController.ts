import { RequestHandler } from 'express'

import AnalyticalConstituent from '../models/analyticalConstituent'
// import ConstituentTranslation from '../models/constituentTranslation'
import { viewAnalyticaConstituentsClient } from '../views/analyticalConstituent'

// Return all analytical constituent that exist in database according to the language sent in params
export const getAllAnalyticalConstituents: RequestHandler = async (req, res) => {
  try {
    const analyticalConstituents = await AnalyticalConstituent.find({
      relations: ['translations'],
      order: { id: 'ASC' },
    })
    const { language } = req.query

    res.json(
      viewAnalyticaConstituentsClient(analyticalConstituents, language?.toString().toUpperCase()),
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}
