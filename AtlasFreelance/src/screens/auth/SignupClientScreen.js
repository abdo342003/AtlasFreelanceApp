// src/screens/auth/SignupClientScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';
import { validateForm, validators } from '../../utils/validation';

export default function SignupClientScreen({ navigation }) {
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const validationRules = {
      companyName: [(v) => validators.required(v, 'Nom de l\'entreprise')],
      firstName: [(v) => validators.required(v, 'Prénom')],
      lastName: [(v) => validators.required(v, 'Nom')],
      email: [
        (v) => validators.required(v, 'Email'),
        validators.email
      ],
      phone: [
        (v) => validators.required(v, 'Téléphone'),
        validators.phone
      ],
      password: [
        (v) => validators.required(v, 'Mot de passe'),
        validators.password
      ],
      confirmPassword: [
        (v) => validators.required(v, 'Confirmation mot de passe'),
        (v) => validators.confirmPassword(formData.password, v)
      ],
    };

    const result = validateForm(formData, validationRules);
    
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual signup API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Compte créé !',
        'Vérifiez votre email pour activer votre compte.',
        [{ text: 'OK', onPress: () => navigation.navigate('VerifyEmail') }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Inscription Client</Text>
        <Text style={styles.subtitle}>
          Créez votre compte et trouvez des freelancers qualifiés
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nom de l'entreprise *"
          placeholder="Votre entreprise"
          value={formData.companyName}
          onChangeText={value => handleChange('companyName', value)}
          error={errors.companyName}
        />

        <Input
          label="Prénom *"
          placeholder="Votre prénom"
          value={formData.firstName}
          onChangeText={value => handleChange('firstName', value)}
          error={errors.firstName}
          autoCapitalize="words"
        />

        <Input
          label="Nom *"
          placeholder="Votre nom"
          value={formData.lastName}
          onChangeText={value => handleChange('lastName', value)}
          error={errors.lastName}
          autoCapitalize="words"
        />

        <Input
          label="Email *"
          placeholder="votre@email.com"
          value={formData.email}
          onChangeText={value => handleChange('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Téléphone *"
          placeholder="+212 6XX XXX XXX"
          value={formData.phone}
          onChangeText={value => handleChange('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
        />

        <Input
          label="Mot de passe *"
          placeholder="Min. 8 caractères"
          value={formData.password}
          onChangeText={value => handleChange('password', value)}
          error={errors.password}
          secureTextEntry={!showPassword}
          leftIcon="🔒"
          rightIcon={showPassword ? "👁️" : "🙈"}
          onRightIconPress={() => setShowPassword(!showPassword)}
          helperText="Min. 8 caractères, 1 majuscule, 1 chiffre"
        />

        <Input
          label="Confirmer le mot de passe *"
          placeholder="Confirmez votre mot de passe"
          value={formData.confirmPassword}
          onChangeText={value => handleChange('confirmPassword', value)}
          error={errors.confirmPassword}
          secureTextEntry={!showConfirmPassword}
          leftIcon="🔒"
          rightIcon={showConfirmPassword ? "👁️" : "🙈"}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <Button
          title="Créer mon compte"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
          fullWidth
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  contentContainer: {
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    gap: theme.spacing.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
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
