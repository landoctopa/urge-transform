import React from 'react';

interface Props {
  title?: string;
}

const WhyHaventYouStarted: React.FC<Props> = ({ title }) => (
  <div>{title || 'WhyHaventYouStarted'}</div>
);

export default WhyHaventYouStarted;
