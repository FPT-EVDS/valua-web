/* eslint-disable react/require-default-props */
import { Tooltip, TooltipProps, useTheme } from '@mui/material';
import React from 'react';

interface Props extends TooltipProps {
  color?: string;
}

const CustomTooltip = ({ color, ...otherProps }: Props) => {
  const themes = useTheme();
  return (
    <Tooltip
      {...otherProps}
      title={otherProps.title}
      placement="right"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: '#fff',
            boxShadow: themes.shadows[4],
            color: color || themes.palette.text.secondary,
            fontSize: 13,
          },
        },
        arrow: {
          sx: {
            color: '#fff',
          },
        },
      }}
    >
      {otherProps.children}
    </Tooltip>
  );
};

export default CustomTooltip;
