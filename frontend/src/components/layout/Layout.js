import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CartBadge from '../common/CartBadge';
import SearchBar from '../common/SearchBar';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const cartItemsCount = useSelector((state) => state.cart.items.length);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <MobileMenuButton onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>

          <Logo to="/">
            <LogoText>RetroRise</LogoText>
          </Logo>

          <DesktopNav>
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/drops" active={location.pathname.startsWith('/drops')}>
              Drops
            </NavLink>
            <NavLink to="/brands" active={location.pathname.startsWith('/brands')}>
              Brands
            </NavLink>
          </DesktopNav>

          <HeaderActions>
            <SearchButton onClick={toggleSearch}>
              <Search size={20} />
            </SearchButton>

            <CartLink to="/cart">
              <ShoppingCart size={20} />
              <CartBadge count={cartItemsCount} />
            </CartLink>

            {isAuthenticated ? (
              <UserMenu>
                <UserButton>
                  <User size={20} />
                </UserButton>
                <UserDropdown>
                  <DropdownHeader>
                    <UserName>{user?.firstName} {user?.lastName}</UserName>
                    <UserEmail>{user?.email}</UserEmail>
                  </DropdownHeader>
                  <DropdownMenu>
                    <DropdownItem to="/profile">My Profile</DropdownItem>
                    <DropdownItem to="/orders">My Orders</DropdownItem>
                    {user?.roles?.includes('ROLE_ADMIN') && (
                      <DropdownItem to="/admin">Admin Dashboard</DropdownItem>
                    )}
                    <DropdownDivider />
                    <LogoutButton onClick={logout}>Logout</LogoutButton>
                  </DropdownMenu>
                </UserDropdown>
              </UserMenu>
            ) : (
              <LoginLink to="/login">Login</LoginLink>
            )}
          </HeaderActions>
        </HeaderContent>

        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      </Header>

      {mobileMenuOpen && (
        <MobileNav>
          <MobileNavLink to="/" onClick={toggleMobileMenu}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/drops" onClick={toggleMobileMenu}>
            Drops
          </MobileNavLink>
          <MobileNavLink to="/brands" onClick={toggleMobileMenu}>
            Brands
          </MobileNavLink>
          {isAuthenticated && (
            <>
              <MobileNavLink to="/profile" onClick={toggleMobileMenu}>
                My Profile
              </MobileNavLink>
              <MobileNavLink to="/orders" onClick={toggleMobileMenu}>
                My Orders
              </MobileNavLink>
              {user?.roles?.includes('ROLE_ADMIN') && (
                <MobileNavLink to="/admin" onClick={toggleMobileMenu}>
                  Admin Dashboard
                </MobileNavLink>
              )}
              <MobileLogoutButton onClick={() => {
                logout();
                toggleMobileMenu();
              }}>
                Logout
              </MobileLogoutButton>
            </>
          )}
          {!isAuthenticated && (
            <MobileNavLink to="/login" onClick={toggleMobileMenu}>
              Login
            </MobileNavLink>
          )}
        </MobileNav>
      )}

      <MainContent>
        {children}
      </MainContent>

      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>RetroRise</FooterTitle>
            <FooterText>Your premium sneaker destination for exclusive drops and limited editions.</FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Shop</FooterTitle>
            <FooterLinks>
              <FooterLink to="/drops">Drops</FooterLink>
              <FooterLink to="/brands">Brands</FooterLink>
              <FooterLink to="/new">New Arrivals</FooterLink>
              <FooterLink to="/sale">Sale</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Customer Service</FooterTitle>
            <FooterLinks>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/shipping">Shipping Info</FooterLink>
              <FooterLink to="/returns">Returns</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>About</FooterTitle>
            <FooterLinks>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
              <FooterLink to="/sustainability">Sustainability</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Stay Connected</FooterTitle>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Enter your email" />
              <NewsletterButton>Subscribe</NewsletterButton>
            </NewsletterForm>
            <SocialLinks>
              <SocialLink href="#">Instagram</SocialLink>
              <SocialLink href="#">Twitter</SocialLink>
              <SocialLink href="#">Facebook</SocialLink>
              <SocialLink href="#">YouTube</SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <FooterCopyright>© 2023 RetroRise. All rights reserved.</FooterCopyright>
          <FooterLegalLinks>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/cookies">Cookie Policy</FooterLink>
          </FooterLegalLinks>
        </FooterBottom>
      </Footer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartLink = styled(Link)`
  position: relative;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: none;
  z-index: 1001;

  ${UserMenu}:hover & {
    display: block;
  }
`;

const DropdownHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const DropdownMenu = styled.div`
  padding: 5px 0;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 5px 0;
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const LoginLink = styled(Link)`
  padding: 8px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const MobileNav = styled.nav`
  background-color: white;
  padding: 20px;
  display: none;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavLink = styled(Link)`
  padding: 10px 0;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const MobileLogoutButton = styled.button`
  padding: 10px 0;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const MainContent = styled.main`
  flex: 1;
  min-height: calc(100vh - 70px - 300px);
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.background};
  padding: 40px 0 20px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;

const NewsletterButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterCopyright = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const FooterLegalLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export default Layout;
