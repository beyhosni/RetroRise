import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction, fetchUserInfo } from '../store/slices/authSlice';

/**
 * Custom hook for authentication
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, token } = useSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !user) {
          await dispatch(fetchUserInfo());
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [dispatch, user]);

  /**
   * Login method
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise that resolves when login is complete
   */
  const login = async (email, password) => {
    try {
      const result = await dispatch(loginAction({ email, password }));
      if (result.error) {
        throw result.error;
      }
      return result.payload;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Logout method
   */
  const logout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has the role
   */
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean} True if user has any of the roles
   */
  const hasAnyRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => hasRole(role));
  };

  /**
   * Check if user has all of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean} True if user has all of the roles
   */
  const hasAllRoles = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.every(role => hasRole(role));
  };

  return {
    user,
    isAuthenticated,
    loading: loading || !initialized,
    token,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};

export default useAuth;
