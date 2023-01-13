import React, { useEffect } from 'react'
import { Container, Form, FormErrors, Header } from './styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'
import axios from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa de ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hífens.',
    })
    .transform((username) => username.toLowerCase()),
  fullname: z
    .string()
    .min(3, { message: 'O usuário precisa de ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hífens.',
    })
    .transform((fullname) => fullname.toLowerCase()),
})

type IRegisterFormSchema = z.infer<typeof registerFormSchema>

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<IRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  })
  const router = useRouter()

  async function handleRegister(data: IRegisterFormSchema) {
    try {
      await api.post('/users', data)
      router.push('/register/connect-calendar')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return alert(
          'Erro ao registrar usuário. Por favor tente novamente mais tarde.',
        )
      }

      console.error(error)
    }
  }

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome do usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && (
            <FormErrors size={'sm'}>{errors.username?.message}</FormErrors>
          )}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            prefix=""
            placeholder="Seu nome"
            {...register('fullname')}
          />
          {errors.fullname && (
            <FormErrors size={'sm'}>{errors.fullname?.message}</FormErrors>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}

export default Register
