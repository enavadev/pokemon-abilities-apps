import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { pokemonService, PokemonAbility } from '../services/pokemonService';

interface PokemonAbilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonName: string;
}

const PokemonAbilitiesModal: React.FC<PokemonAbilitiesModalProps> = ({
  isOpen,
  onClose,
  pokemonName,
}) => {
  const [abilities, setAbilities] = useState<PokemonAbility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pokemonName) {
      loadAbilities();
    } else {
      setAbilities([]);
      setError(null);
    }
  }, [isOpen, pokemonName]);

  const loadAbilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pokemonService.getPokemonAbilities(pokemonName);
      setAbilities(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao carregar habilidades do Pokemon',
      );
      setAbilities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Habilidades de {pokemonName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : abilities.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={4}>
              Nenhuma habilidade encontrada
            </Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {abilities.map((ability, index) => (
                <HStack
                  key={index}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  justify="space-between"
                >
                  <Text fontWeight="medium">{ability.ability}</Text>
                  {ability.hidden && (
                    <Badge colorScheme="purple">Oculta</Badge>
                  )}
                </HStack>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PokemonAbilitiesModal;




