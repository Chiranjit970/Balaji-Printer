import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuthHeader from '../../src/components/auth/AuthHeader';
import OTPInput from '../../src/components/auth/OTPInput';
import DemoCard from '../../src/components/auth/DemoCard';
import CountdownTimer from '../../src/components/auth/CountdownTimer';
import Button from '../../src/components/common/Button';
import AppLoader from '../../src/components/common/AppLoader';

import { useVerifyOTP } from '../../src/hooks/useVerifyOtp';
import { useResendOTP } from '../../src/hooks/useResendOtp';
import { useOTPStore } from '../../src/store/otpStore';
import { validators } from '../../src/utils/validation';
import { formatPhoneDisplay } from '../../src/utils/formatters';
import { colors, spacing, typography } from '../../src/constants';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOTP] = useState('');
  const [otpError, setOTPError] = useState('');

  const phone = useOTPStore((state) => state.phone);
  const demoOTP = useOTPStore((state) => state.demoOTP);
  const expiresAt = useOTPStore((state) => state.expiresAt);
  const isResendAvailable = useOTPStore((state) => state.isResendAvailable);
  const setResendAvailable = useOTPStore((state) => state.setResendAvailable);
  const resendCooldownEnd = useOTPStore((state) => state.resendCooldownEnd);

  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  // Redirect to login if no phone session (direct URL access)
  useEffect(() => {
    if (!phone && !isVerifying) {
      router.replace('/(auth)/login');
    }
  }, [phone, router, isVerifying]);

  // Handle resend cooldown
  useEffect(() => {
    if (!resendCooldownEnd) return;

    const interval = setInterval(() => {
      if (Date.now() >= resendCooldownEnd) {
        setResendAvailable(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldownEnd, setResendAvailable]);

  const handleOTPChange = (text: string) => {
    setOTP(text);
    setOTPError('');
  };

  const handleVerify = (otpToVerify?: string) => {
    const finalOtp = otpToVerify || otp;

    // Validate OTP
    if (!validators.isValidOTP(finalOtp)) {
      setOTPError('Please enter a valid 6-digit OTP');
      return;
    }

    // Verify
    verifyOTP(
      { phone: phone!, otp: finalOtp },
      {
        onSuccess: () => {
          // Navigating to print tab explicitly, though AuthGate handles some of this
          router.replace('/(tabs)/print');
        },
        onError: (error) => {
          setOTPError(error.message);
        },
      }
    );
  };

  const handleResend = () => {
    if (!isResendAvailable) return;
    resendOTP(undefined, {
      onSuccess: () => {
        Alert.alert('Success', 'A new OTP has been sent');
        setOTP('');
        setOTPError('');
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    });
  };

  const handleEditPhone = () => {
    router.back();
  };

  const handleOTPExpire = () => {
    Alert.alert(
      'OTP Expired',
      'Your OTP has expired. Please request a new one.',
      [{ text: 'OK', onPress: handleResend }]
    );
  };

  if (isVerifying) {
    return <AppLoader message="Verifying OTP..." />;
  }

  if (!phone) {
    return null; // Will redirect in useEffect
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
          {/* Header */}
          <AuthHeader
            title="Verify Your Number"
            subtitle={`We sent a code to`}
            illustration={
              <Image
                source={require('../../assets/illustrations/security-shield.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            }
          />

          {/* Edit Phone Number Display */}
          <View style={styles.phoneDisplayContainer}>
            <Text style={styles.phoneText}>
              +91 {formatPhoneDisplay(phone)}
            </Text>
            <TouchableOpacity
              style={styles.editPhone}
              onPress={handleEditPhone}
              accessibilityLabel="Edit phone number"
            >
              <Ionicons name="pencil" size={16} color={colors.blue} />
            </TouchableOpacity>
          </View>

          {/* OTP Input */}
          <OTPInput
            value={otp}
            onChangeText={handleOTPChange}
            error={!!otpError}
            disabled={isVerifying || isResending}
            onComplete={handleVerify}
          />

          {/* Error Message */}
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

          {/* Demo OTP Card */}
          {demoOTP && <DemoCard otp={demoOTP} />}

          {/* Countdown Timer */}
          {expiresAt && !isResendAvailable && (
            <CountdownTimer
              expiresAt={expiresAt}
              onExpire={handleOTPExpire}
              label="OTP expires in"
            />
          )}

          {/* Verify Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Verify OTP"
              onPress={() => handleVerify()}
              variant="primary"
              disabled={otp.length < 6 || isVerifying || isResending}
              loading={isVerifying}
            />
          </View>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendLabel}>Didn't receive the code?</Text>

            {isResendAvailable ? (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={styles.resendLink}>
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendDisabled}>
                Resend available in{' '}
                {resendCooldownEnd
                  ? Math.ceil((resendCooldownEnd - Date.now()) / 1000)
                  : 30}
                s
              </Text>
            )}
          </View>
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
  phoneDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing.md,
    marginBottom: spacing.sm,
  },
  phoneText: {
    ...typography.bodyBold,
    color: colors.black,
    marginRight: spacing.sm,
  },
  editPhone: {
    padding: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  resendLink: {
    ...typography.caption,
    color: colors.blue,
    fontWeight: '600',
  },
  resendDisabled: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
