import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner,
  Center,
  Text,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Header from '../components/Header';
import PokemonAbilitiesModal from '../components/PokemonAbilitiesModal';
import { pokemonService, Pokemon } from '../services/pokemonService';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    if (isAuthenticated) {
      loadPokemons(1);
    }
  }, [isAuthenticated]);

  const loadPokemons = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const response = await pokemonService.searchPokemons(page, ITEMS_PER_PAGE, search);
      setPokemons(response.data.pokemons);
      setTotalCount(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading pokemons:', error);
      setPokemons([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      loadPokemons(1, value);
    } else {
      loadPokemons(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const search = searchTerm.trim() || undefined;
      loadPokemons(newPage, search);
    }
  };

  const handleViewAbilities = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
    onOpen();
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Pesquisar Pokemon por nome..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              bg="white"
              size="lg"
            />
          </InputGroup>

          {loading ? (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : pokemons.length === 0 ? (
            <Center py={10}>
              <Text fontSize="lg" color="gray.500">
                Nenhum Pokemon encontrado
              </Text>
            </Center>
          ) : (
            <>
              <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
                <Table variant="simple">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th>Nome</Th>
                      <Th textAlign="center">Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pokemons.map((pokemon, index) => (
                      <Tr key={index}>
                        <Td fontWeight="medium">{pokemon.Name}</Td>
                        <Td textAlign="center">
                          <Button
                            leftIcon={<ViewIcon />}
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAbilities(pokemon.Name)}
                          >
                            Habilidades
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {totalPages > 1 && (
                <Box
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  p={4}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={4}
                >
                  <Text fontSize="sm" color="gray.600">
                    Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} -{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount} Pokemons
                  </Text>

                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Página anterior"
                      icon={<ChevronLeftIcon />}
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1 || loading}
                    />

                    <HStack spacing={1}>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={currentPage === pageNum ? 'solid' : 'outline'}
                            colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                            onClick={() => handlePageChange(pageNum)}
                            isDisabled={loading}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </HStack>

                    <IconButton
                      aria-label="Próxima página"
                      icon={<ChevronRightIcon />}
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      isDisabled={currentPage === totalPages || loading}
                    />
                  </HStack>
                </Box>
              )}
            </>
          )}
        </VStack>
      </Container>

      {selectedPokemon && (
        <PokemonAbilitiesModal
          isOpen={isOpen}
          onClose={onClose}
          pokemonName={selectedPokemon}
        />
      )}
    </Box>
  );
};

export default Dashboard;

