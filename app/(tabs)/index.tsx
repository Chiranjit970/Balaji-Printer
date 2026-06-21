import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { HomeHeader } from '../../src/components/home/HomeHeader';
import { PromotionalCard } from '../../src/components/home/PromotionalCard';
import { QuickActions } from '../../src/components/home/QuickActions';
import { WhyChooseUs } from '../../src/components/home/WhyChooseUs';
import { SectionHeader } from '../../src/components/home/SectionHeader';
import { HomeScreenSkeleton } from '../../src/components/common/SkeletonLoader';
import ErrorView from '../../src/components/common/ErrorView';

import { useHomeData } from '../../src/hooks/useHomeData';
import { useNotificationCount } from '../../src/hooks/useNotificationCount';
import { colors } from '../../src/constants';

export default function HomeScreen() {
  const router = useRouter();
  
  // Data fetching
  const { 
    data: homeData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useHomeData();
  
  const { data: notificationData } = useNotificationCount();
  
  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  const handleNotificationPress = () => {
    router.push('/(tabs)/notifications');
  };
  
  const handleQuickActionPress = (route: string) => {
    if (route === '/(tabs)/store') {
      router.push('/(tabs)/store');
    } else if (route === '/(tabs)/orders') {
      router.push('/(tabs)/orders');
    } else if (route === '/(tabs)/print' || route.includes('print')) {
      router.push('/(printing)/upload');
    } else {
      Alert.alert(
        'Coming Soon',
        'This feature will be available in the next update',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handlePromoCTAPress = () => {
    router.push('/(printing)/upload');
  };
  
  // Loading state
  if (isLoading) {
    return <HomeScreenSkeleton />;
  }
  
  // Error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          title="Failed to Load"
          message={error?.message || 'Unable to load home screen'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }
  
  // Main content
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <HomeHeader
        userName={homeData?.user.name || 'Guest'}
        greeting={homeData?.user.greeting || 'Hello'}
        notificationCount={notificationData?.unread || 0}
        onNotificationPress={handleNotificationPress}
      />
      
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.blue}
            colors={[colors.blue]}
          />
        }
      >
        {/* Promotional Card */}
        {homeData?.promotional && (
          <PromotionalCard
            title={homeData.promotional.title}
            subtitle={homeData.promotional.subtitle}
            ctaText={homeData.promotional.ctaText}
            onCTAPress={handlePromoCTAPress}
            image={homeData.promotional.image}
          />
        )}
        
        {/* Quick Actions */}
        {homeData?.quickActions && (
          <QuickActions
            actions={homeData.quickActions}
            onActionPress={handleQuickActionPress}
          />
        )}
        
        {/* Why Choose Us */}
        {homeData?.features && (
          <WhyChooseUs features={homeData.features} />
        )}
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bottomSpacer: {
    height: 40,
  },
});
