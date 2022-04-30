import {
  fetchLogin,
  fetchRegister,
  LoginRequest,
  RegisterRequest,
} from 'api/auth';
import { User } from 'features/users/models';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import jwt from 'jwt-decode';

interface AuthContextType {
  user?: User;
  isLoading: boolean;
  login: (loginRequest: LoginRequest) => Promise<void>;
  signUp: (registerRequest: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setUser(jwt(accessToken));
    }
  }, []);

  const login = async (loginRequest: LoginRequest) => {
    setIsLoading(true);

    return fetchLogin(loginRequest)
      .then(({ accessToken }) => {
        localStorage.setItem('accessToken', accessToken);
        setUser(jwt(accessToken));
      })
      .finally(() => setIsLoading(false));
  };

  const signUp = async (registerRequest: RegisterRequest) => {
    setIsLoading(true);

    return fetchRegister(registerRequest)
      .then(({ accessToken }) => {
        localStorage.setItem('accessToken', accessToken);
        setUser(jwt(accessToken));
      })
      .finally(() => setIsLoading(false));
  };

  function logout() {
    localStorage.removeItem('accessToken');
    setUser(undefined);
  }

  const memoValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signUp,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
