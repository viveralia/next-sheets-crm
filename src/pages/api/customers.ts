import type { NextApiRequest, NextApiResponse } from 'next'

import withValidation from '../../middlewares/with-validation'
import { Customer, customerSchema } from '../../schemas/customer-validation.schema'
import { sheets } from '../../utils/google-sheets'

export interface PostCustomerResponse {
  customer: Customer
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostCustomerResponse>
) {
  if (req.method === 'POST') {
    const { name, email, phone } = req.body as Customer
  
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, phone]],
      }
    })

    const customer = { name, email, phone }
    res.status(200).json({ customer })
  }
}

export default withValidation(customerSchema, handler)
