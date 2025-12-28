import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Appbar,
  Searchbar,
  Card,
  Text,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
  List,
  Chip,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { pokemonService, Pokemon } from '../services/pokemonService';

const ITEMS_PER_PAGE = 10;

const DashboardScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [abilitiesModalVisible, setAbilitiesModalVisible] = useState(false);
  const [abilities, setAbilities] = useState<Array<{ ability: string; hidden: boolean }>>([]);
  const [loadingAbilities, setLoadingAbilities] = useState(false);

  const { username, logout, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    if (isAuthenticated) {
      loadPokemons(1);
    } else {
      navigation.navigate('Login' as never);
    }
  }, [isAuthenticated, navigation]);

  const loadPokemons = async (page: number, search?: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

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
      setRefreshing(false);
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

  const handleRefresh = () => {
    const search = searchTerm.trim() || undefined;
    loadPokemons(1, search, true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      const search = searchTerm.trim() || undefined;
      loadPokemons(newPage, search);
    }
  };

  const handleViewAbilities = async (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
    setAbilitiesModalVisible(true);
    setLoadingAbilities(true);
    setAbilities([]);

    try {
      const response = await pokemonService.getPokemonAbilities(pokemonName);
      setAbilities(response.data);
    } catch (error) {
      console.error('Error loading abilities:', error);
      setAbilities([]);
    } finally {
      setLoadingAbilities(false);
    }
  };

  const getInitials = (name: string | null): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login' as never);
  };

  const renderPokemonItem = ({ item }: { item: Pokemon }) => (
    <Card style={styles.card} onPress={() => handleViewAbilities(item.Name)}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Text variant="titleMedium" style={styles.pokemonName}>
            {item.Name}
          </Text>
          <Button
            mode="outlined"
            icon="eye"
            onPress={() => handleViewAbilities(item.Name)}
            compact
          >
            Habilidades
          </Button>
        </View>
      </Card.Content>
    </Card>
  );


  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Pokemons e suas Habilidades" />
        <Appbar.Action
          icon="account-circle"
          onPress={() => {}}
        />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Pesquisar Pokemon por nome..."
          onChangeText={handleSearch}
          value={searchTerm}
          style={styles.searchbar}
        />

        {loading && pokemons.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : pokemons.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Nenhum Pokemon encontrado
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={pokemons}
              renderItem={renderPokemonItem}
              keyExtractor={(item, index) => `${item.Name}-${index}`}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              contentContainerStyle={styles.listContent}
              ListFooterComponent={() => (
                <>
                  {totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                      <Text variant="bodySmall" style={styles.paginationInfo}>
                        Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} -{' '}
                        {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount} Pokemons
                      </Text>

                      <View style={styles.paginationControls}>
                        <IconButton
                          icon="chevron-left"
                          size={24}
                          onPress={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                        />

                        <View style={styles.pageNumbers}>
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
                                mode={currentPage === pageNum ? 'contained' : 'outlined'}
                                onPress={() => handlePageChange(pageNum)}
                                disabled={loading}
                                compact
                                style={styles.pageButton}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </View>

                        <IconButton
                          icon="chevron-right"
                          size={24}
                          onPress={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
            />
          </>
        )}
      </View>

      <Portal>
        <Modal
          visible={abilitiesModalVisible}
          onDismiss={() => setAbilitiesModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">
              Habilidades de {selectedPokemon}
            </Text>
          </View>
          <Divider />
          {loadingAbilities ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : abilities.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text variant="bodyMedium">Nenhuma habilidade encontrada</Text>
            </View>
          ) : (
            <List.Section>
              {abilities.map((ability, index) => (
                <List.Item
                  key={index}
                  title={ability.ability}
                  right={() =>
                    ability.hidden ? (
                      <Chip mode="outlined" compact>
                        Oculta
                      </Chip>
                    ) : null
                  }
                />
              ))}
            </List.Section>
          )}
          <Button
            mode="contained"
            onPress={() => setAbilitiesModalVisible(false)}
            style={styles.modalButton}
          >
            Fechar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonName: {
    flex: 1,
    textTransform: 'capitalize',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#718096',
  },
  paginationContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 8,
  },
  paginationInfo: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: 12,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pageButton: {
    marginHorizontal: 2,
    minWidth: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default DashboardScreen;




