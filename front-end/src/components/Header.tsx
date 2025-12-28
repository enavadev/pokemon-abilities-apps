import {
  Box,
  Flex,
  Heading,
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <Box bg="blue.500" color="white" py={4} px={6} boxShadow="md">
      <Flex justify="space-between" align="center">
        <Heading size="lg" textAlign="center" flex="1">
          Pokemons e suas Habilidades
        </Heading>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            colorScheme="whiteAlpha"
            rightIcon={
              <Avatar size="sm" name={username || 'User'}>
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            }
          >
            {getInitials(username)}
          </MenuButton>
          <MenuList color="gray.800">
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Header;




