import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const FooterContainer = styled.footer`
  background: #212121;
  color: white;
  padding: 48px 24px 24px;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: white;
`;

const FooterLink = styled(Link)`
  color: #BDBDBD;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.875rem;

  &::placeholder {
    color: #BDBDBD;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const NewsletterButton = styled.button`
  padding: 10px 16px;
  background: white;
  color: #212121;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #E0E0E0;
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 32px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #BDBDBD;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Merci pour votre inscription à notre newsletter !');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>À propos</FooterTitle>
          <FooterLink to="/about">Notre histoire</FooterLink>
          <FooterLink to="/careers">Carrières</FooterLink>
          <FooterLink to="/press">Presse</FooterLink>
          <FooterLink to="/blog">Blog</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Service client</FooterTitle>
          <FooterLink to="/help">Centre d'aide</FooterLink>
          <FooterLink to="/shipping">Livraison</FooterLink>
          <FooterLink to="/returns">Retours</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Légal</FooterTitle>
          <FooterLink to="/privacy">Politique de confidentialité</FooterLink>
          <FooterLink to="/terms">Conditions d'utilisation</FooterLink>
          <FooterLink to="/cookies">Politique de cookies</FooterLink>
          <FooterLink to="/accessibility">Accessibilité</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Restez informé</FooterTitle>
          <p style={{ fontSize: '0.875rem', color: '#BDBDBD', margin: 0 }}>
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.
          </p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Votre adresse email"
              required
            />
            <NewsletterButton type="submit">S'inscrire</NewsletterButton>
          </NewsletterForm>
          <SocialLinks>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} />
            </SocialLink>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </SocialLink>
            <SocialLink href="mailto:contact@retrorise.com" aria-label="Email">
              <Mail size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} RetroRise. Tous droits réservés.
        </Copyright>
        <LegalLinks>
          <FooterLink to="/privacy">Politique de confidentialité</FooterLink>
          <FooterLink to="/terms">Conditions d'utilisation</FooterLink>
        </LegalLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
