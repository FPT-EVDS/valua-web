import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import AppConstants from 'enums/app';
import Role from 'enums/role.enum';
import { getUserProfile } from 'features/auth/authSlice';
import useQuery from 'hooks/useQuery';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { parseJwt } from 'utils';

const OAuth2RedirectHandler = () => {
  const query = useQuery();
  const accessToken = query.get('token');
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleGetProfile = async () => {
    const result = await dispatch(getUserProfile());
    const user = unwrapResult(result);
    const { role, refreshToken } = user;
    if (role === Role.Manager || role === Role.ShiftManager) {
      localStorage.setItem(AppConstants.REFRESH_TOKEN, refreshToken);
    }
    if (role === Role.Manager) history.push('/manager');
    else if (role === Role.ShiftManager) history.push('/shift-manager');
    else throw new Error('Invalid role');
  };

  useEffect(() => {
    const error = query.get('error') ?? '';
    if (error && error.length > 0) {
      history.push('/login', { error: new Error(error) });
      return;
    }
    const jwt = parseJwt(String(accessToken));
    if (jwt.role === '0' || jwt.role === '1') {
      localStorage.setItem(AppConstants.ACCESS_TOKEN, String(accessToken));
      handleGetProfile().catch(error_ => {
        history.push('/login', { error: error_ });
      });
    } else {
      history.push('/login', { error: new Error('Invalid role') });
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
