import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { theme } from '../../theme';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'Développement',
  'Design',
  'Rédaction',
  'Marketing',
  'Traduction',
  'Vidéo/Photo',
  'Audio',
  'Business',
  'Data',
  'Autre',
];

export default function CreateProjectScreen({ navigation }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    skills: [],
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      if (!formData.skills.includes(currentSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, currentSkill.trim()],
        }));
        setCurrentSkill('');
      } else {
        Alert.alert('Attention', 'Cette compétence existe déjà');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.title.trim()) {
        newErrors.title = 'Le titre est requis';
      }
      if (!formData.category) {
        newErrors.category = 'La catégorie est requise';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'La description est requise';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = 'La description doit contenir au moins 50 caractères';
      }
    }

    if (currentStep === 1) {
      if (!formData.budgetMin || formData.budgetMin <= 0) {
        newErrors.budgetMin = 'Le budget minimum est requis';
      }
      if (!formData.budgetMax || formData.budgetMax <= 0) {
        newErrors.budgetMax = 'Le budget maximum est requis';
      }
      if (formData.budgetMin && formData.budgetMax && 
          parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) {
        newErrors.budgetMax = 'Le budget max doit être supérieur au minimum';
      }
      if (!formData.deadline) {
        newErrors.deadline = 'La date limite est requise';
      }
    }

    if (currentStep === 2) {
      if (formData.skills.length === 0) {
        Alert.alert('Attention', 'Ajoutez au moins une compétence requise');
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePublish = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const projectData = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
        deadline: formData.deadline,
        skills: formData.skills,
        clientId: user?.id,
      };

      const response = await projectService.createProject(projectData, user?.token);

      if (response.success) {
        Alert.alert(
          'Succès',
          'Votre projet a été publié avec succès !',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de créer le projet');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>Étape {currentStep + 1}/3</Text>
      <View style={styles.progressBarContainer}>
        {[0, 1, 2].map((step) => (
          <View
            key={step}
            style={[
              styles.progressBar,
              step <= currentStep && styles.progressBarActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informations de base</Text>

      <Input
        label="Titre du projet *"
        placeholder="Ex: Développement d'une application mobile"
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
        error={errors.title}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Catégorie *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                formData.category === cat && styles.categoryChipActive,
              ]}
              onPress={() => handleChange('category', cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  formData.category === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Décrivez votre projet en détail (minimum 50 caractères)"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>
          {formData.description.length} / 50 minimum
        </Text>
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Budget et délais</Text>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Input
            label="Budget minimum (MAD) *"
            placeholder="Ex: 5000"
            value={formData.budgetMin}
            onChangeText={(value) => handleChange('budgetMin', value)}
            keyboardType="numeric"
            error={errors.budgetMin}
          />
        </View>
        <View style={styles.halfInput}>
          <Input
            label="Budget maximum (MAD) *"
            placeholder="Ex: 10000"
            value={formData.budgetMax}
            onChangeText={(value) => handleChange('budgetMax', value)}
            keyboardType="numeric"
            error={errors.budgetMax}
          />
        </View>
      </View>

      <Input
        label="Date limite *"
        placeholder="Ex: 2025-03-15"
        value={formData.deadline}
        onChangeText={(value) => handleChange('deadline', value)}
        error={errors.deadline}
        leftIcon="📅"
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Conseil : Fixez un budget réaliste pour attirer les meilleurs freelances
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Compétences requises</Text>

      <View style={styles.skillInputContainer}>
        <TextInput
          style={styles.skillInput}
          placeholder="Ex: React Native"
          value={currentSkill}
          onChangeText={setCurrentSkill}
          onSubmitEditing={addSkill}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSkill}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skillsContainer}>
        {formData.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillTagText}>{skill}</Text>
            <TouchableOpacity onPress={() => removeSkill(skill)}>
              <Text style={styles.removeSkillText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {formData.skills.length === 0 && (
        <Text style={styles.hintText}>
          Ajoutez au moins une compétence que les freelances doivent posséder
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un projet</Text>
        <View style={{ width: 60 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <Button
            title="Précédent"
            variant="outline"
            onPress={handlePrevious}
            style={styles.footerButton}
          />
        )}
        
        {currentStep < 2 ? (
          <Button
            title="Suivant"
            onPress={handleNext}
            style={[styles.footerButton, currentStep === 0 && styles.footerButtonFull]}
          />
        ) : (
          <Button
            title="Publier"
            onPress={handlePublish}
            loading={loading}
            disabled={loading}
            style={styles.footerButton}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.base,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  backButton: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  stepIndicator: {
    padding: theme.spacing.base,
    backgroundColor: theme.colors.background.primary,
  },
  stepText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.xs,
  },
  progressBarActive: {
    backgroundColor: theme.colors.primary.main,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: theme.spacing.base,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.base,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  categoryScroll: {
    marginBottom: theme.spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    marginRight: theme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  categoryChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  categoryChipTextActive: {
    color: theme.colors.primary.contrast,
  },
  textArea: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 120,
  },
  charCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.base,
  },
  halfInput: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: theme.colors.info.light + '20',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info.main,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.base,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  skillInputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.base,
    gap: theme.spacing.sm,
  },
  skillInput: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
  },
  addButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.base,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  skillTagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
  removeSkillText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
  },
  hintText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.base,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
    gap: theme.spacing.base,
  },
  footerButton: {
    flex: 1,
  },
  footerButtonFull: {
    flex: 1,
  },
});
