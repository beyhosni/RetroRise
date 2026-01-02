import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCartItem } from '../../store/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemBrand = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #212121;
`;

const ItemSize = styled.span`
  font-size: 0.875rem;
  color: #616161;
`;

const ItemPrice = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #212121;
`;

const ItemActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #212121;
    background: #F5F5F5;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #F44336;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(244, 67, 54, 0.1);
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

const EmptyCart = styled.div`
  background: white;
  border-radius: 16px;
  padding: 64px 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const EmptyCartIcon = styled.div`
  color: #BDBDBD;
  margin-bottom: 24px;
`;

const EmptyCartText = styled.p`
  font-size: 1.125rem;
  color: #616161;
  margin: 0 0 24px 0;
`;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingSpinner fullWidth fullHeight />
        </ContentContainer>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Mon panier</PageTitle>
          </PageHeader>
          <EmptyCart>
            <EmptyCartIcon>
              <ShoppingBag size={64} />
            </EmptyCartIcon>
            <EmptyCartText>Votre panier est vide</EmptyCartText>
            <Button onClick={() => navigate('/products')}>
              Découvrir nos produits
            </Button>
          </EmptyCart>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <PageTitle>Mon panier ({items.length} article{items.length !== 1 ? 's' : ''})</PageTitle>
        </PageHeader>

        <CartContainer>
          <CartItems>
            {items.map(item => (
              <CartItem key={item.id}>
                <ItemImage src={item.product?.image} alt={item.product?.name} />
                <ItemDetails>
                  <ItemBrand>{item.product?.brand?.name}</ItemBrand>
                  <ItemName>{item.product?.name}</ItemName>
                  <ItemSize>Taille: {item.size}</ItemSize>
                  <ItemPrice>{(item.product?.price * item.quantity).toFixed(2)} €</ItemPrice>
                  <ItemActions>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </QuantityButton>
                      <QuantityDisplay>{item.quantity}</QuantityDisplay>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >
                        <Plus size={16} />
                      </QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 size={16} />
                      Supprimer
                    </RemoveButton>
                  </ItemActions>
                </ItemDetails>
              </CartItem>
            ))}
          </CartItems>

          <OrderSummary>
            <SummaryTitle>Récapitulatif</SummaryTitle>
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
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
            >
              Passer la commande
            </Button>
          </OrderSummary>
        </CartContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default CartPage;
