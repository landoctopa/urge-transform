import React from 'react';

interface Props {
  title?: string;
}

const FearAudit: React.FC<Props> = ({ title }) => (
  <div>{title || 'FearAudit'}</div>
);

export default FearAudit;
