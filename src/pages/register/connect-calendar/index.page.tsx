import React from 'react'
import { Container, Header } from '../styles'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const ConnectCalendar: React.FC = () => {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isAuthenticated = session.status === 'authenticated'

  //   async function handleRegister(data: IRegisterFormSchema) {}

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados..
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isAuthenticated ? (
            <Button disabled size={'sm'}>
              Connectado
              <Check />
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => signIn('google')}>
              Connectar <ArrowRight />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google. Verifique se você habilitou as
            configurações de acesso ao Google Calendar.
          </AuthError>
        )}
        <Button
          onClick={handleNavigateToNextStep}
          type="submit"
          disabled={!isAuthenticated}
        >
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

export default ConnectCalendar
