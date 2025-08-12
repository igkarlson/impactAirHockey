import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/context/SettingsContext';
import { useLocalization } from './i18n/hooks';

const { width, height } = Dimensions.get('window');

// Calculate scale factors based on Figma design (360x640)
const scaleX = width / 360;
const scaleY = height / 640;

export default function SettingsScreen() {
  const { t, changeLanguage, currentLanguage } = useLocalization();
  const { soundEnabled, vibrationEnabled, setSoundEnabled, setVibrationEnabled, goalTarget, setGoalTarget } = useSettings();
  const [displayMode, setDisplayMode] = useState('display');
  const [goalValue, setGoalValue] = useState(String(goalTarget));
  const [timingValue, setTimingValue] = useState('5');

  const handleBack = () => {
    router.back();
  };

  const handleDisplayMode = (mode: string) => {
    setDisplayMode(mode);
  };

  const handleLanguageChange = (language: 'en' | 'ru') => {
    changeLanguage(language);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={['#0A1B35', '#0B2A55']}
          style={styles.backgroundGradient}
        />
        <LinearGradient
          colors={['#6BB3E1', '#12649A']}
          style={styles.overlayGradient}
        />
        
        <View style={styles.dotPattern}>
          {Array.from({ length: 20 }, (_, groupIndex) => (
            <View key={groupIndex} style={styles.dotGroup}>
              {Array.from({ length: 16 }, (_, dotIndex) => (
                <View
                  key={dotIndex}
                  style={[
                    styles.dot,
                    {
                      left: dotIndex * 29.91 * scaleX,
                    }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.unionOverlay} />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonBackground} />
          <MaterialCommunityIcons name="arrow-left" size={34} color="white" />
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <TouchableOpacity 
            style={[
              styles.displayButton,
              displayMode === 'display' && styles.displayButtonActive
            ]}
            onPress={() => handleDisplayMode('display')}
          >
            <ThemedText style={styles.displayButtonText}>{t('display')}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.displayButton,
              displayMode === 'gameplay' && styles.displayButtonActive
            ]}
            onPress={() => handleDisplayMode('gameplay')}
          >
            <ThemedText style={styles.displayButtonText}>{t('gameplay')}</ThemedText>
          </TouchableOpacity>
        </View>

        {displayMode === 'display' ? (
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel} numberOfLines={1}>{t('sound')}</ThemedText>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleBackground}>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#F94444', true: 'red' }}
                    thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
                    style={styles.toggle}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>{t('vibration')}</ThemedText>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleBackground}>
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={setVibrationEnabled}
                    trackColor={{ false: '#F94444', true: 'red' }}
                    thumbColor={vibrationEnabled ? '#FFFFFF' : '#FFFFFF'}
                    style={styles.toggle}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel} numberOfLines={1}>{t('language')}</ThemedText>
              <View style={styles.languageButtonsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.languageButton,
                    currentLanguage === 'en' && styles.languageButtonActive
                  ]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <ThemedText style={styles.languageButtonText}>{t('en')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.languageButton,
                    currentLanguage === 'ru' && styles.languageButtonActive
                  ]}
                  onPress={() => handleLanguageChange('ru')}
                >
                  <ThemedText style={styles.languageButtonText}>{t('ru')}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.gameplayContainer}>
            <View style={styles.goalSection}>
              <ThemedText style={styles.sectionTitle}>{t('goal')}</ThemedText>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    (goalTarget === 3) && styles.gameplayButtonActive
                  ]}
                  onPress={() => { setGoalTarget(3); setGoalValue('3'); }}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    goalValue === '3' && styles.gameplayButtonTextActive
                  ]}>3</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    (goalTarget === 10) && styles.gameplayButtonActive
                  ]}
                  onPress={() => { setGoalTarget(10); setGoalValue('10'); }}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    goalValue === '10' && styles.gameplayButtonTextActive
                  ]}>10</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    (goalTarget === 15) && styles.gameplayButtonActive
                  ]}
                  onPress={() => { setGoalTarget(15); setGoalValue('15'); }}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    goalValue === '15' && styles.gameplayButtonTextActive
                  ]}>15</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timingSection}>
              <ThemedText style={styles.sectionTitle}>{t('timing')}</ThemedText>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    timingValue === '1' && styles.gameplayButtonActive
                  ]}
                  onPress={() => setTimingValue('1')}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    timingValue === '1' && styles.gameplayButtonTextActive
                  ]}>1</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    timingValue === '3' && styles.gameplayButtonActive
                  ]}
                  onPress={() => setTimingValue('3')}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    timingValue === '3' && styles.gameplayButtonTextActive
                  ]}>3</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.gameplayButton,
                    timingValue === '5' && styles.gameplayButtonActive
                  ]}
                  onPress={() => setTimingValue('5')}
                >
                  <ThemedText style={[
                    styles.gameplayButtonText,
                    timingValue === '5' && styles.gameplayButtonTextActive
                  ]}>5</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dotPattern: {
    position: 'absolute',
    top: -70 * scaleY,
    left: -47 * scaleX,
    opacity: 0.1,
  },
  dotGroup: {
    width: 454 * scaleX,
    height: 5.28 * scaleY,
    marginBottom: 33.43 * scaleY,
  },
  dot: {
    position: 'absolute',
    width: 5.28 * scaleX,
    height: 5.28 * scaleY,
    borderRadius: 2.64 * scaleX,
    backgroundColor: '#DDDDDD',
  },
  unionOverlay: {
    position: 'absolute',
    top: -176.71 * scaleY,
    left: -118.46 * scaleX,
    width: 572.72 * scaleX,
    height: 941.85 * scaleY,
    backgroundColor: 'transparent',
    opacity: 0.1,
  },
  backButton: {
    position: 'absolute',
    top: 38.85 * scaleY,
    left: 25 * scaleX,
    width: 46 * scaleX,
    height: 46 * scaleY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonBackground: {
    position: 'absolute',
    width: 46 * scaleX,
    height: 46 * scaleY,
    backgroundColor: '#F94444',
    borderRadius: 2 * scaleX,
  },
  backArrow: {
    position: 'absolute',
    top: 14.92 * scaleY,
    left: 10.22 * scaleX,
    width: 24.78 * scaleX,
    height: 14.49 * scaleY,
    backgroundColor: '#FFFFFF',
    borderRadius: 2 * scaleX,
  },
  titleSection: {
    position: 'absolute',
    top: 140 * scaleY,
    left: 38 * scaleX,
    right: 38 * scaleX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  displayButton: {
    width: 137 * scaleX,
    height: 44 * scaleY,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5 * scaleX,
    borderWidth: 1 * scaleX,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  displayButtonActive: {
    backgroundColor: '#318CFF',
    borderColor: '#318CFF',
  },
  displayButtonText: {
    fontSize: 12 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1 * scaleX,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  settingsContainer: {
    position: 'absolute',
    top: 242 * scaleY,
    left: 142 * scaleX,
    right: 142 * scaleX,
  },
  settingItem: {
    marginBottom: 70 * scaleY,
    alignItems: 'center',
  },
  settingLabel: {
    width: 150 * scaleX,
    fontSize: 22 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 11 * scaleY,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleBackground: {
    width: 53 * scaleX,
    height: 28.47 * scaleY,
    backgroundColor: '#EDEDED',
    borderRadius: 23.5 * scaleX,
    borderWidth: 3 * scaleX,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  languageButton: {
    width: 54 * scaleX,
    height: 29 * scaleY,
    backgroundColor: '#318CFF',
    borderRadius: 3 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#F94444',
  },
  languageButtonText: {
    fontSize: 14 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150 * scaleX,
    gap: 20 * scaleX,
  },
  gameplayContainer: {
    position: 'absolute',
    top: 100 * scaleY,
    left: 14 * scaleX,
    right: 14 * scaleX,
    height: 519 * scaleY,
    backgroundColor: '#0F407E',
    borderRadius: 8 * scaleX,
  },
  goalSection: {
    position: 'absolute',
    top: 200 * scaleY,
    left: 42 * scaleX,
    right: 42 * scaleX,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 11 * scaleY,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gameplayButton: {
    width: 74 * scaleX,
    height: 37 * scaleY,
    backgroundColor: '#FFFFFF',
    borderRadius: 2 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameplayButtonActive: {
    backgroundColor: '#F94444',
  },
  gameplayButtonText: {
    fontSize: 20 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#565656',
    textAlign: 'center',
  },
  gameplayButtonTextActive: {
    color: '#FFFFFF',
  },
  timingSection: {
    position: 'absolute',
    top: 320 * scaleY,
    left: 42 * scaleX,
    right: 42 * scaleX,
    alignItems: 'center',
  },
}); 