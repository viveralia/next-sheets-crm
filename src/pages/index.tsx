import type { NextPage } from 'next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Customer, customerSchema } from '../schemas/customer-validation.schema'
import { PostCustomerResponse } from './api/customers'

const defaultValues: Customer = {
  name: '',
  email: '',
  phone: ''
}

const Home: NextPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])

  const { register, handleSubmit, formState, reset } = useForm<Customer>({
    defaultValues,
    resolver: yupResolver(customerSchema)
  })

  const onSubmit = async (customer: Customer) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        alert('Could not add the customer')
        throw new Error('Could not add the customer')
      }

      const data = await response.json() as PostCustomerResponse;
      setCustomers((c) => [...c, data.customer])
      reset()
    } catch (error) {
      alert('Could not add the customer')
    }
  }

  return (
    <div>
      <h1>Add a new customer to the Sheets CRM!</h1>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1rem', maxWidth: '18rem' }}>
        <div>
          <input type='text' placeholder='Name' {...register('name')} />
          {!!formState.errors.name && <p>{formState.errors.name.message}</p>}
        </div>
        <div>
          <input type='text' placeholder='Email'{...register('email')} />
          {!!formState.errors.email && <p>{formState.errors.email.message}</p>}
        </div>
        <div>
          <input type='text' placeholder='Phone' {...register('phone')} />
          {!!formState.errors.phone && <p>{formState.errors.phone.message}</p>}
        </div>
        <button disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Adding' : 'Add'}</button>
      </form>

      <section style={{ marginTop: '3rem' }}>
        <h2>Customers</h2>
        <ul>
          {customers.map((customer, index) => (
            <li key={index}>{customer.name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Home
