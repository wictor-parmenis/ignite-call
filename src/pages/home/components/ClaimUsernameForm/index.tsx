import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Digite um nome válido' })
    .regex(/^[a-zA-Z]+$/)
    .transform((username) => username.toLowerCase()),
})

type IClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>

const ClaimUsernameForm: React.FC = () => {
  const { register, handleSubmit } = useForm<IClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  async function handleClaimUsername(data: IClaimUsernameFormSchema) {
    console.log(data)
  }

  return (
    <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
      <TextInput
        size={'sm'}
        prefix="ignite.com/"
        placeholder="seu-usuario"
        {...register('username')}
      />
      <Button size={'sm'} type="submit">
        Reservar usuário
        <ArrowRight />
      </Button>
    </Form>
  )
}

export default ClaimUsernameForm
