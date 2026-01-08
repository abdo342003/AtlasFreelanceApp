// src/components/ui/Button.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary.main : 'white'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary.main,
  },
  secondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.base,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  primaryText: {
    color: theme.colors.primary.contrast,
  },
  secondaryText: {
    color: theme.colors.secondary.contrast,
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  ghostText: {
    color: theme.colors.primary.main,
  },

  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.base,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },
});
