import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HSAuthContext = createContext(null);

export function HSAuthProvider({
  children,
  name,
  ownerid,
  version = '1.0',
  apiUrl = 'https://api.hsauth.mujahid.xyz/api/1.3/',
}) {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('hsauth_sess') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);

  const getHwid = useCallback(() => {
    let hwid = localStorage.getItem('hsauth_hwid');
    if (!hwid) {
      hwid = 'WEB-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('hsauth_hwid', hwid);
    }
    return hwid;
  }, []);

  const request = useCallback(async (params) => {
    const postData = new URLSearchParams({
      name,
      ownerid,
      ...params,
    });
    const res = await fetch(apiUrl.replace(/\/+$/, '') + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: postData.toString(),
    });
    return await res.json();
  }, [name, ownerid, apiUrl]);

  const init = useCallback(async () => {
    try {
      const res = await request({ type: 'init', ver: version });
      if (res.success && res.sessionid) {
        setSessionId(res.sessionid);
        localStorage.setItem('hsauth_sess', res.sessionid);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, [request, version]);

  const login = async (username, pass) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request({
        type: 'login',
        username,
        pass,
        hwid: getHwid(),
        sessionid: sessionId || '',
      });
      if (res.success) {
        setUser(res.info);
        if (res.sessionid) {
          setSessionId(res.sessionid);
          localStorage.setItem('hsauth_sess', res.sessionid);
        }
        if (res.active_message) setActiveMessage(res.active_message);
      } else {
        setError(res.message);
      }
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const license = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request({
        type: 'license',
        key,
        hwid: getHwid(),
        sessionid: sessionId || '',
      });
      if (res.success) {
        setUser(res.info);
        if (res.sessionid) {
          setSessionId(res.sessionid);
          localStorage.setItem('hsauth_sess', res.sessionid);
        }
        if (res.active_message) setActiveMessage(res.active_message);
      } else {
        setError(res.message);
      }
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await request({ type: 'logout', sessionid: sessionId });
      }
    } catch (e) {}
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('hsauth_sess');
  };

  const getVar = async (varid) => {
    const res = await request({ type: 'var', varid, sessionid: sessionId || '' });
    return res.success ? (res.message || res.response) : null;
  };

  useEffect(() => {
    init();
  }, [init]);

  return (
    <HSAuthContext.Provider
      value={{
        user,
        sessionId,
        loading,
        error,
        activeMessage,
        login,
        license,
        logout,
        getVar,
        init,
      }}
    >
      {children}
    </HSAuthContext.Provider>
  );
}

export function useHSAuth() {
  const context = useContext(HSAuthContext);
  if (!context) {
    throw new Error('useHSAuth must be used within an HSAuthProvider');
  }
  return context;
}
