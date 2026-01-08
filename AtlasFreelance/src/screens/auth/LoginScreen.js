// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { validateForm, validators } from '../../utils/validation';

export default function LoginScreen({ navigation }) {
  const { loginAsAdmin, loginAsUser, loginAsClient, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDemoLogin = async (demoFunction) => {
    setLoading(true);
    try {
      await demoFunction();
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const validationRules = {
      email: [
        (v) => validators.required(v, 'Email'),
        validators.email
      ],
      password: [(v) => validators.required(v, 'Mot de passe')],
    };

    const result = validateForm(formData, validationRules);
    
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      
      if (response && !response.success) {
        Alert.alert('Erreur', response?.error || 'Identifiants incorrects. Veuillez réessayer.');
      }
      // Navigation is handled automatically by AuthContext/App.js
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Connectez-vous à votre compte Atlas Freelance
          </Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={formData.email}
              onChangeText={value => handleChange('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="📧"
            />

            <Input
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
              error={errors.password}
              secureTextEntry={!showPassword}
              leftIcon="🔒"
              rightIcon={showPassword ? "👁️" : "👁️‍🗨️"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <Button
              title="Se connecter"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              size="lg"
              fullWidth
            />

            {/* Demo buttons */}
          <View style={styles.demoButtons}>
            <Button
              title="Demo: Admin"
              onPress={() => handleDemoLogin(loginAsAdmin)}
              variant="outline"
              size="sm"
              fullWidth
              loading={loading}
            />
            <Button
              title="Demo: User"
              onPress={() => handleDemoLogin(loginAsUser)}
              variant="outline"
              size="sm"
              fullWidth
              loading={loading}
            />
            <Button
              title="Demo: Client"
              onPress={() => handleDemoLogin(loginAsClient)}
              variant="outline"
              size="sm"
              fullWidth
              loading={loading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupRole')}>
            <Text style={styles.footerLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  form: {
    gap: theme.spacing.base,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
  demoButtons: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  footerLink: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});

