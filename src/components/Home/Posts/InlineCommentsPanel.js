import React from 'react';
import styles from './InlineCommentsPanel.module.css';

const InlineCommentsPanel = React.forwardRef((props, ref) => (
  <div className={styles.inlineCommentsPanel} ref={ref}>
    <h3>Comments</h3>
    <p>Comments coming soon for this post!</p>
  </div>
));

export default InlineCommentsPanel; 