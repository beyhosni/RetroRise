
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Search, Edit, Shield, Ban, UserPlus, Mail, Calendar } from 'lucide-react';

const UsersContainer = styled.div`
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

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
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

const UsersTable = styled.div`
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const UserRole = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ role, theme }) => {
    switch (role) {
      case 'ADMIN': return theme.colors.error;
      case 'OPS': return theme.colors.warning;
      case 'CUSTOMER': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  color: white;
`;

const UserStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ active, theme }) => active ? theme.colors.success : theme.colors.error};
  color: white;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, variant }) => 
    variant === 'danger' ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'danger' ? theme.colors.errorDark : theme.colors.primaryDark};
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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get(`/users?page=${currentPage}&search=${searchTerm}&role=${roleFilter}&status=${statusFilter}`);
      // setUsers(response.data.content);
      // setTotalPages(response.data.totalPages);

      // Mock data for now
      setTimeout(() => {
        setUsers([
          {
            id: 'USR-001',
            name: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            role: 'CUSTOMER',
            status: 'active',
            registrationDate: '2024-01-15',
            lastLogin: '2024-02-14T10:30:00',
            ordersCount: 5,
            totalSpent: 459.99
          },
          {
            id: 'USR-002',
            name: 'Marie Martin',
            email: 'marie.martin@email.com',
            role: 'CUSTOMER',
            status: 'active',
            registrationDate: '2024-01-20',
            lastLogin: '2024-02-13T15:45:00',
            ordersCount: 3,
            totalSpent: 289.99
          },
          {
            id: 'USR-003',
            name: 'Pierre Durand',
            email: 'pierre.durand@email.com',
            role: 'ADMIN',
            status: 'active',
            registrationDate: '2023-12-01',
            lastLogin: '2024-02-15T09:00:00',
            ordersCount: 0,
            totalSpent: 0
          },
          {
            id: 'USR-004',
            name: 'Sophie Bernard',
            email: 'sophie.bernard@email.com',
            role: 'OPS',
            status: 'active',
            registrationDate: '2024-01-10',
            lastLogin: '2024-02-14T14:20:00',
            ordersCount: 0,
            totalSpent: 0
          },
          {
            id: 'USR-005',
            name: 'Lucas Petit',
            email: 'lucas.petit@email.com',
            role: 'CUSTOMER',
            status: 'inactive',
            registrationDate: '2024-01-25',
            lastLogin: '2024-02-01T11:30:00',
            ordersCount: 1,
            totalSpent: 99.99
          },
        ]);
        setTotalPages(15);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleEditUser = (userId) => {
    // TODO: Implement user edit functionality
    console.log('Edit user:', userId);
  };

  const handleBanUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) {
      // TODO: Implement user ban functionality
      console.log('Ban user:', userId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'OPS': return 'Opérateur';
      case 'CUSTOMER': return 'Client';
      default: return role;
    }
  };

  if (loading) {
    return (
      <UsersContainer>
        <LoadingSpinner>
          <div>Chargement...</div>
        </LoadingSpinner>
      </UsersContainer>
    );
  }

  return (
    <UsersContainer>
      <PageHeader>
        <PageTitle>Gestion des utilisateurs</PageTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchBar>
            <Search size={20} color="#666" />
            <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBar>
          <Button>
            <UserPlus size={20} />
            Nouvel utilisateur
          </Button>
        </div>
      </PageHeader>

      <FiltersBar>
        <FilterButton 
          active={roleFilter === 'all'} 
          onClick={() => handleRoleFilter('all')}
        >
          Tous les rôles
        </FilterButton>
        <FilterButton 
          active={roleFilter === 'CUSTOMER'} 
          onClick={() => handleRoleFilter('CUSTOMER')}
        >
          Clients
        </FilterButton>
        <FilterButton 
          active={roleFilter === 'OPS'} 
          onClick={() => handleRoleFilter('OPS')}
        >
          Opérateurs
        </FilterButton>
        <FilterButton 
          active={roleFilter === 'ADMIN'} 
          onClick={() => handleRoleFilter('ADMIN')}
        >
          Administrateurs
        </FilterButton>
      </FiltersBar>

      <FiltersBar>
        <FilterButton 
          active={statusFilter === 'all'} 
          onClick={() => handleStatusFilter('all')}
        >
          Tous les statuts
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'active'} 
          onClick={() => handleStatusFilter('active')}
        >
          Actifs
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'inactive'} 
          onClick={() => handleStatusFilter('inactive')}
        >
          Inactifs
        </FilterButton>
      </FiltersBar>

      <UsersTable>
        <TableHeader>
          <div>Avatar</div>
          <div>Utilisateur</div>
          <div>Rôle</div>
          <div>Statut</div>
          <div>Inscription</div>
          <div>Commandes</div>
          <div>Actions</div>
        </TableHeader>
        {users.map(user => (
          <TableRow key={user.id}>
            <UserInfo>
              <UserAvatar 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={user.name}
              />
            </UserInfo>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
            <UserRole role={user.role}>
              <Shield size={16} />
              {getRoleLabel(user.role)}
            </UserRole>
            <UserStatus active={user.status === 'active'}>
              {user.status === 'active' ? 'Actif' : 'Inactif'}
            </UserStatus>
            <div>{formatDate(user.registrationDate)}</div>
            <div>{user.ordersCount}</div>
            <div>
              <ActionButton onClick={() => handleEditUser(user.id)}>
                <Edit size={18} />
              </ActionButton>
              <ActionButton 
                variant="danger" 
                onClick={() => handleBanUser(user.id)}
              >
                <Ban size={18} />
              </ActionButton>
            </div>
          </TableRow>
        ))}
      </UsersTable>

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
    </UsersContainer>
  );
};

export default UsersPage;
