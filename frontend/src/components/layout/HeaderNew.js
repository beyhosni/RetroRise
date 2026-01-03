
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../../store/slices/cartSlice';
import { useAuth } from '../../hooks/useAuth';
import FavoritesBadge from '../common/FavoritesBadge';
import WishlistBadge from '../common/WishlistBadge';
import ComparisonBadge from '../common/ComparisonBadge';
import HistoryButton from '../common/HistoryButton';

const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: #212121;
  text-decoration: none;
  letter-spacing: -0.5px;

  &:hover {
    color: #424242;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#212121' : '#616161'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.9375rem;
  transition: color 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background: #212121;
    transition: width 0.2s ease;
  }

  &:hover {
    color: #212121;

    &::after {
      width: 100%;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #616161;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #F44336;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0 4px;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: none;
  color: #616161;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 99;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 12px 0;
  color: ${props => props.active ? '#212121' : '#616161'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  border-bottom: 1px solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: none;

  @media (min-width: 769px) {
    display: block;
  }
`;

const SearchInput = styled.input`
  width: 200px;
  padding: 8px 12px 8px 36px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #212121;
    box-shadow: 0 0 0 3px rgba(33, 33, 33, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9E9E9E;
  width: 16px;
  height: 16px;
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, login } = useAuth();
  const cartItemsCount = useSelector(state =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const favoritesCount = useSelector(state => state.favorites.items.length);
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const comparisonCount = useSelector(state => state.comparison.items.length);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/drops', label: 'Drops' },
    { path: '/products', label: 'Produits' },
    { path: '/brands', label: 'Marques' },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">RetroRise</Logo>

        <Nav>
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              active={location.pathname === link.path ? 1 : 0}
            >
              {link.label}
            </NavLink>
          ))}
        </Nav>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon />
          </form>
        </SearchContainer>

        <Actions>
          <HistoryButton />
          <FavoritesBadge />
          <WishlistBadge />
          <ComparisonBadge />
          <IconButton onClick={() => navigate('/cart')}>
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && <Badge>{cartItemsCount}</Badge>}
          </IconButton>

          <IconButton onClick={isAuthenticated ? () => navigate('/profile') : login}>
            <User size={20} />
          </IconButton>

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </Actions>
      </HeaderContent>

      <MobileMenu isOpen={mobileMenuOpen}>
        <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
          <SearchInput
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </form>

        {navLinks.map(link => (
          <MobileNavLink
            key={link.path}
            to={link.path}
            active={location.pathname === link.path ? 1 : 0}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </MobileNavLink>
        ))}

        <MobileNavLink
          to="/favorites"
          onClick={() => setMobileMenuOpen(false)}
        >
          Favoris {favoritesCount > 0 && `(${favoritesCount})`}
        </MobileNavLink>

        <MobileNavLink
          to="/wishlist"
          onClick={() => setMobileMenuOpen(false)}
        >
          Liste de souhaits {wishlistCount > 0 && `(${wishlistCount})`}
        </MobileNavLink>

        <MobileNavLink
          to="/comparison"
          onClick={() => setMobileMenuOpen(false)}
        >
          Comparaison {comparisonCount > 0 && `(${comparisonCount})`}
        </MobileNavLink>

        <MobileNavLink
          to="/cart"
          onClick={() => setMobileMenuOpen(false)}
        >
          Panier {cartItemsCount > 0 && `(${cartItemsCount})`}
        </MobileNavLink>

        <MobileNavLink
          to={isAuthenticated ? '/profile' : '#'}
          onClick={() => {
            if (!isAuthenticated) {
              login();
            }
            setMobileMenuOpen(false);
          }}
        >
          {isAuthenticated ? `Bonjour, ${user?.firstName || 'Utilisateur'}` : 'Connexion'}
        </MobileNavLink>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
