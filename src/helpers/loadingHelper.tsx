import React from 'react';
import {createContext, FC, useContext, useState} from 'react';

interface ILoadingContext {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<ILoadingContext>({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoadingContext = () => {
  return useContext(LoadingContext);
};
export const LoadingProvider: FC = props => {
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };
  const hideLoading = () => {
    setLoading(false);
  };
  const value = React.useMemo(
    () => ({
      loading,
      showLoading,
      hideLoading,
    }),
    [loading],
  );
  return (
    <LoadingContext.Provider value={value}>
      {props.children}
    </LoadingContext.Provider>
  );
};
