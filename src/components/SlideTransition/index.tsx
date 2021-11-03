import { Slide, SlideProps } from '@mui/material';
import React from 'react';

const SlideTransition = React.forwardRef(
  (props: SlideProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

export default SlideTransition;
