import { useState } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
      toast({
        title: 'Erro no login',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent mt={20}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        bg="white"
      >
        <VStack spacing={6}>
          <Heading size="lg">Login</Heading>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Usuário</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;




