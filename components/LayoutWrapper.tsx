import React, { forwardRef, memo } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

type Props = ScrollViewProps & {
  children: React.ReactNode;
};

const LayoutWrapper = forwardRef<ScrollView, Props>(
  ({ children, contentContainerStyle, style, ...rest }, ref) => {
    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        style={[{ flex: 1, backgroundColor: 'white' }, style]}
        {...rest}
        className="flex-1 bg-white">
        {children}
      </ScrollView>
    );
  }
);

export default memo(LayoutWrapper);
