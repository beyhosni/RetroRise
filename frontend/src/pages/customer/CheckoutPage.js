import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/ordersSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
  padding: 24px;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #212121;
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #212121;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 24px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #212121;
`;

const SummaryItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #212121;
`;

const ItemSize = styled.span`
  font-size: 0.875rem;
  color: #616161;
`;

const ItemPrice = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #212121;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9375rem;
  color: #616161;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding-top: 20px;
  border-top: 2px solid #F5F5F5;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #212121;
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #212121;
`;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
        },
        paymentMethod: 'card',
      };

      const order = await dispatch(createOrder(orderData)).unwrap();

      // Clear cart
      dispatch(clearCart());

      toast.success('Commande créée avec succès !');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Paiement</PageTitle>
          </PageHeader>
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '64px 32px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{ fontSize: '1.125rem', color: '#616161', marginBottom: '24px' }}>
              Votre panier est vide
            </p>
            <Button onClick={() => navigate('/products')}>
              Découvrir nos produits
            </Button>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <PageTitle>Paiement</PageTitle>
        </PageHeader>

        <CheckoutContainer>
          <CheckoutForm>
            <form onSubmit={handleSubmit}>
              <Section>
                <SectionTitle>
                  <User size={20} />
                  Informations personnelles
                </SectionTitle>
                <FormGrid>
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGrid>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Section>

              <Section>
                <SectionTitle>
                  <MapPin size={20} />
                  Adresse de livraison
                </SectionTitle>
                <Input
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <FormGrid>
                  <Input
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Code postal"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormGrid>
                <Input
                  label="Pays"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </Section>

              <Section>
                <SectionTitle>
                  <CreditCard size={20} />
                  Paiement
                </SectionTitle>
                <Input
                  label="Numéro de carte"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FormGrid>
                  <Input
                    label="Date d'expiration"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVC"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                  />
                </FormGrid>
              </Section>

              <Button
                variant="primary"
                size="large"
                fullWidth
                type="submit"
                loading={loading}
              >
                {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
              </Button>
            </form>
          </CheckoutForm>

          <OrderSummary>
            <SummaryTitle>Récapitulatif de commande</SummaryTitle>
            {items.map(item => (
              <SummaryItem key={item.id}>
                <ItemImage src={item.product?.image} alt={item.product?.name} />
                <ItemDetails>
                  <ItemName>{item.product?.name}</ItemName>
                  <ItemSize>Taille: {item.size}</ItemSize>
                  <ItemPrice>{(item.product?.price * item.quantity).toFixed(2)} €</ItemPrice>
                </ItemDetails>
              </SummaryItem>
            ))}
            <SummaryRow>
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </SummaryRow>
            <SummaryRow>
              <span>Livraison</span>
              <span>Gratuite</span>
            </SummaryRow>
            <SummaryRow>
              <span>TVA (20%)</span>
              <span>{(total * 0.2).toFixed(2)} €</span>
            </SummaryRow>
            <SummaryTotal>
              <TotalLabel>Total</TotalLabel>
              <TotalAmount>{total.toFixed(2)} €</TotalAmount>
            </SummaryTotal>
          </OrderSummary>
        </CheckoutContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default CheckoutPage;
