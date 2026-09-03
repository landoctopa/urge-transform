import React from 'react';

interface Props {
  title?: string;
}

const RealWorldAsk: React.FC<Props> = ({ title }) => (
  <div>{title || 'RealWorldAsk'}</div>
);

export default RealWorldAsk;
