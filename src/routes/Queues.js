import React from 'react';
import QueueLanding from '../components/QueueLanding';
import { forwardRef } from 'react';

// eslint-disable-next-line no-empty-pattern
const Queues = forwardRef(({}, ref) => {
  return <QueueLanding ref={ref} />;
});

export default Queues;
