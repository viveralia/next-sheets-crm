import { object, string, number } from 'yup'

export const customerSchema = object().shape({
  name: string().required(),
  email: string().email().notRequired(),
  phone: number().notRequired(),
})

export interface Customer {
  name: string;
  email: string;
  phone: number | string;
}