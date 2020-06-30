import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';

const Back = () => (
  <svg className="back-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path
      d="M721.226 845.716l-330.925-336.576 328.476-341.301c8.349-8.349 8.124-22.074-0.5-30.65l-59.175-59.175c-8.6-8.574-22.325-8.825-30.675-0.474l-334.326 347.4c-4.425 0.775-8.751 2.499-12.174 5.95l-59.775 59.75c-8.7 8.675-8.9 22.524-0.5 30.925l408.351 415.35c8.425 8.425 22.275 8.2 30.95-0.474l59.775-59.8c8.65-8.65 8.9-22.524 0.5-30.925z"
    />
  </svg>
);

interface HeaderProps {
  left?: string | ReactNode;
  title?: string | ReactNode;
  right?: string | ReactNode;
  onBack?: () => void;
}
const Header: FC<HeaderProps> = function(props): JSX.Element {
  const back = useMemo(() => (<Back />), []);
  const history = useHistory();
  const goBack = useCallback(() => {
    history.go(-1);
  }, [history]);
  const { left = back, title, right, onBack = goBack } = props;

  return (
    <header className={'windy-header'}>
      <div className={'left'} onClick={onBack}>{left}</div>
      <div className={'content'}>{title}</div>
      <div className={'right'}>{right}</div>
    </header>
  );
};

export { Header };
