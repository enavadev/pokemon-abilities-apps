import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '../config/apiConfig';

const API_BASE_URL = apiConfig.apiUrl;

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface Pokemon {
  Name: string;
}

export interface PokemonSearchResponse {
  data: {
    count: number;
    pokemons: Pokemon[];
  };
}

export interface PokemonAbility {
  ability: string;
  hidden: boolean;
}

export interface PokemonAbilityResponse {
  data: PokemonAbility[];
}

export const pokemonService = {
  async searchPokemons(
    page: number = 1,
    totalPerPage: number = 20,
    searchTerm?: string,
  ): Promise<PokemonSearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      totalperpage: totalPerPage.toString(),
    });

    if (searchTerm) {
      params.append('p', searchTerm);
    }

    const headers = await getAuthHeaders();

    const response = await axios.get<PokemonSearchResponse>(
      `${API_BASE_URL}/api/v1/pokemon?${params.toString()}`,
      {
        headers,
      },
    );
    return response.data;
  },

  async getPokemonAbilities(
    pokemonName: string,
  ): Promise<PokemonAbilityResponse> {
    const headers = await getAuthHeaders();

    const response = await axios.get<PokemonAbilityResponse>(
      `${API_BASE_URL}/api/v1/pokemon/ability?name=${pokemonName}`,
      {
        headers,
      },
    );
    return response.data;
  },
};




