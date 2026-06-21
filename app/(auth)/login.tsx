import React, { useState } from 'react';
import {
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuthHeader from '../../src/components/auth/AuthHeader';
import PhoneInput from '../../src/components/auth/PhoneInput';
import InfoCard from '../../src/components/common/InfoCard';
import Button from '../../src/components/common/Button';
import AppLoader from '../../src/components/common/AppLoader';

import { useLogin } from '../../src/hooks/useLogin';
import { validators } from '../../src/utils/validation';
import { colors, spacing, typography } from '../../src/constants';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const { mutate: requestOTP, isPending } = useLogin();

  const handlePhoneChange = (text: string) => {
    // Only allow numbers
    const numeric = text.replace(/[^0-9]/g, '');
    setPhone(numeric);
    setPhoneError(''); // Clear error on input
  };

  const handleSendOTP = () => {
    // Validate phone
    if (!validators.isValidPhone(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }

    // Request OTP
    requestOTP(
      { phone },
      {
        onSuccess: () => {
          router.push('/(auth)/verify-otp');
        },
        onError: (error) => {
          setPhoneError(error.message);
        },
      }
    );
  };

  const isButtonDisabled = phone.length < 10 || isPending;

  if (isPending) {
    return <AppLoader message="Sending OTP..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo and Illustration */}
          <AuthHeader
            title="Welcome to Balaji Printers"
            subtitle="Fast, reliable printing delivered to your door"
            illustration={
              <Image
                source={require('../../assets/illustrations/phone-auth.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            }
          />

          {/* Phone Input */}
          <PhoneInput
            value={phone}
            onChangeText={handlePhoneChange}
            error={phoneError}
            disabled={isPending}
          />

          {/* Privacy Trust Card */}
          <InfoCard
            icon={
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.blue}
              />
            }
            message="Your privacy matters. We'll never share your number with anyone."
            variant="info"
          />

          {/* Send OTP Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              variant="primary"
              disabled={isButtonDisabled}
              loading={isPending}
            />
          </View>

          {/* Legal Text */}
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  illustration: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  legalText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
  link: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },
});
