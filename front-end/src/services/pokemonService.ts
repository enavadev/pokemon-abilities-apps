import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:18081'
    : `http://${window.location.hostname}:18081`);

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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
    totalPerPage: number = 10,
    searchTerm?: string,
  ): Promise<PokemonSearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      totalperpage: totalPerPage.toString(),
    });

    if (searchTerm) {
      params.append('p', searchTerm);
    }

    const response = await axios.get<PokemonSearchResponse>(
      `${API_BASE_URL}/api/v1/pokemon?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  },

  async getPokemonAbilities(
    pokemonName: string,
  ): Promise<PokemonAbilityResponse> {
    const response = await axios.get<PokemonAbilityResponse>(
      `${API_BASE_URL}/api/v1/pokemon/ability?name=${pokemonName}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  },
};

