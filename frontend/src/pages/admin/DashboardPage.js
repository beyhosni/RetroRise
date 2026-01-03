
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DashboardSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${({ positive, theme }) => positive ? theme.colors.success : theme.colors.error};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const RecentActivity = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeDrops: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch data from API
    // Mock data for now
    setStats({
      totalOrders: 1234,
      totalRevenue: 45678,
      totalUsers: 567,
      activeDrops: 12,
    });

    setSalesData([
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 4500 },
      { month: 'May', sales: 6000 },
      { month: 'Jun', sales: 5500 },
    ]);

    setUserGrowthData([
      { month: 'Jan', users: 100 },
      { month: 'Feb', users: 150 },
      { month: 'Mar', users: 200 },
      { month: 'Apr', users: 280 },
      { month: 'May', users: 350 },
      { month: 'Jun', users: 450 },
    ]);

    setRecentActivities([
      { id: 1, title: 'Nouvelle commande #1234', time: 'Il y a 5 minutes' },
      { id: 2, title: 'Nouvel utilisateur inscrit', time: 'Il y a 15 minutes' },
      { id: 3, title: 'Drop "Nike Air Max" publié', time: 'Il y a 1 heure' },
      { id: 4, title: 'Marque "Adidas Classic" mise à jour', time: 'Il y a 2 heures' },
      { id: 5, title: 'Commande #1233 expédiée', time: 'Il y a 3 heures' },
    ]);
  }, []);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Tableau de bord administrateur</DashboardTitle>
        <DashboardSubtitle>Vue d'ensemble de l'activité de la plateforme</DashboardSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard onClick={() => navigate('/admin/orders')}>
          <StatTitle>Commandes totales</StatTitle>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatChange positive>+12% vs mois dernier</StatChange>
        </StatCard>

        <StatCard>
          <StatTitle>Revenu total</StatTitle>
          <StatValue>{stats.totalRevenue.toLocaleString()} €</StatValue>
          <StatChange positive>+8% vs mois dernier</StatChange>
        </StatCard>

        <StatCard onClick={() => navigate('/admin/users')}>
          <StatTitle>Utilisateurs</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatChange positive>+15% vs mois dernier</StatChange>
        </StatCard>

        <StatCard onClick={() => navigate('/admin/drops')}>
          <StatTitle>Drops actifs</StatTitle>
          <StatValue>{stats.activeDrops}</StatValue>
          <StatChange positive>+3 ce mois</StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Évolution des ventes</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Ventes (€)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Croissance des utilisateurs</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Utilisateurs" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <RecentActivity>
        <ChartTitle>Activité récente</ChartTitle>
        <ActivityList>
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id}>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default DashboardPage;
