import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ObjectShape, OptionalObjectSchema } from "yup/lib/object";

const HTTP_METHODS_WITH_VALIDATION = ['POST', 'PUT']

export default function withValidation(schema: OptionalObjectSchema<ObjectShape>, handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (HTTP_METHODS_WITH_VALIDATION.includes(req.method!)) {
      try {
        req.body = await schema.validate(req.body, {
          stripUnknown: true,
          strict: true,
          abortEarly: true
        })
      } catch (error) {
        return res.status(400).json(error)
      }
    }

    await handler(req, res)
  }
}