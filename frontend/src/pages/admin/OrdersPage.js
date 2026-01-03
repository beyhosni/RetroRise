
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const OrdersContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  padding: 0.5rem;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.card};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const OrdersTable = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.card};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const OrderId = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CustomerName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const CustomerEmail = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const OrderStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'pending': return theme.colors.warning;
      case 'processing': return theme.colors.primary;
      case 'shipped': return theme.colors.info;
      case 'delivered': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  color: white;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get(`/orders?page=${currentPage}&search=${searchTerm}&status=${statusFilter}`);
      // setOrders(response.data.content);
      // setTotalPages(response.data.totalPages);

      // Mock data for now
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-1234',
            customer: {
              id: 'CUST-001',
              name: 'Jean Dupont',
              email: 'jean.dupont@email.com'
            },
            date: '2024-02-15T10:30:00',
            total: 189.99,
            status: 'pending',
            items: 2
          },
          {
            id: 'ORD-1235',
            customer: {
              id: 'CUST-002',
              name: 'Marie Martin',
              email: 'marie.martin@email.com'
            },
            date: '2024-02-15T11:45:00',
            total: 249.99,
            status: 'processing',
            items: 1
          },
          {
            id: 'ORD-1236',
            customer: {
              id: 'CUST-003',
              name: 'Pierre Durand',
              email: 'pierre.durand@email.com'
            },
            date: '2024-02-14T15:20:00',
            total: 129.99,
            status: 'shipped',
            items: 3
          },
          {
            id: 'ORD-1237',
            customer: {
              id: 'CUST-004',
              name: 'Sophie Bernard',
              email: 'sophie.bernard@email.com'
            },
            date: '2024-02-13T09:10:00',
            total: 179.99,
            status: 'delivered',
            items: 2
          },
          {
            id: 'ORD-1238',
            customer: {
              id: 'CUST-005',
              name: 'Lucas Petit',
              email: 'lucas.petit@email.com'
            },
            date: '2024-02-12T14:30:00',
            total: 99.99,
            status: 'cancelled',
            items: 1
          },
        ]);
        setTotalPages(10);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <OrdersContainer>
        <LoadingSpinner>
          <div>Chargement...</div>
        </LoadingSpinner>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <PageHeader>
        <PageTitle>Gestion des commandes</PageTitle>
        <SearchBar>
          <Search size={20} color="#666" />
          <SearchInput
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchBar>
      </PageHeader>

      <FiltersBar>
        <FilterButton 
          active={statusFilter === 'all'} 
          onClick={() => handleStatusFilter('all')}
        >
          Toutes
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'pending'} 
          onClick={() => handleStatusFilter('pending')}
        >
          En attente
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'processing'} 
          onClick={() => handleStatusFilter('processing')}
        >
          En cours
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'shipped'} 
          onClick={() => handleStatusFilter('shipped')}
        >
          Expédiées
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'delivered'} 
          onClick={() => handleStatusFilter('delivered')}
        >
          Livrées
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'cancelled'} 
          onClick={() => handleStatusFilter('cancelled')}
        >
          Annulées
        </FilterButton>
      </FiltersBar>

      <OrdersTable>
        <TableHeader>
          <div>Commande</div>
          <div>Client</div>
          <div>Date</div>
          <div>Montant</div>
          <div>Statut</div>
          <div>Articles</div>
          <div>Actions</div>
        </TableHeader>
        {orders.map(order => (
          <TableRow key={order.id} onClick={() => handleViewOrder(order.id)}>
            <OrderId>{order.id}</OrderId>
            <CustomerInfo>
              <CustomerName>{order.customer.name}</CustomerName>
              <CustomerEmail>{order.customer.email}</CustomerEmail>
            </CustomerInfo>
            <div>{formatDate(order.date)}</div>
            <div>{order.total.toFixed(2)} €</div>
            <OrderStatus status={order.status}>
              {getStatusIcon(order.status)}
              {getStatusLabel(order.status)}
            </OrderStatus>
            <div>{order.items}</div>
            <div>
              <ViewButton onClick={(e) => {
                e.stopPropagation();
                handleViewOrder(order.id);
              }}>
                <Eye size={18} />
              </ViewButton>
            </div>
          </TableRow>
        ))}
      </OrdersTable>

      <Pagination>
        <PaginationButton 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <span>Page {currentPage} sur {totalPages}</span>
        <PaginationButton 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </Pagination>
    </OrdersContainer>
  );
};

export default OrdersPage;
