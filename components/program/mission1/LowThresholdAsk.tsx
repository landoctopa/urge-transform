import React from 'react';

interface Props {
  title?: string;
}

const LowThresholdAsk: React.FC<Props> = ({ title }) => (
  <div>{title || 'LowThresholdAsk'}</div>
);

export default LowThresholdAsk;
