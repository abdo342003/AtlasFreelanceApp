// src/components/ui/Input.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme';

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <Text style={styles.leftIcon}>{leftIcon}</Text>}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Text style={styles.rightIcon}>{rightIcon}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.base,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: theme.colors.error.main,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.sm,
  },
  error: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
});
