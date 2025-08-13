import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalization } from './i18n/hooks';

const { width, height } = Dimensions.get('window');

// Calculate scale factors based on Figma design (360x640)
const scaleX = width / 360;
const scaleY = height / 640;

export default function GameplayScreen() {
  const { t } = useLocalization();

  const handlePlay = () => {
    router.push('/gameplay');
  };

  const handleSettings = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={['#0b191e', '#0f2a35']}
          style={styles.backgroundGradient}
        />
        <LinearGradient
          colors={['#14faab', '#0b191e']}
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

        <View style={styles.logoContainer}>
          <View style={styles.logoPlate}>
            <View style={styles.plateBase} />
            <LinearGradient
              colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.plateHighlight}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.plateEdge}
            />
          </View>
          <View style={styles.logoContent}>
            <View style={styles.impactAirContainer}>
              <ThemedText style={styles.impactAirText}>Impact Air</ThemedText>
            </View>
            <View style={styles.hockeyContainer}>
              <ThemedText style={styles.hockeyText}>Hockey</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <ThemedText style={styles.buttonText}>{t('play')}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <ThemedText style={styles.buttonText}>{t('settings')}</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.gamePucks}>
          <View style={styles.redPuck}>
            <View style={styles.puckOuterRed} />
            <View style={styles.puckInnerRed} />
            <View style={styles.puckStrokeRed} />
          </View>
          <View style={styles.greenPuck}>
            <View style={styles.puckOuterGreen} />
            <View style={styles.puckInnerGreen} />
            <View style={styles.puckStrokeGreen} />
          </View>
        </View>
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
  logoContainer: {
    position: 'absolute',
    top: 144 * scaleY,
    left: 33 * scaleX,
    width: 294 * scaleX,
    height: 108.84 * scaleY,
  },
  logoPlate: {
    position: 'absolute',
    bottom: 0,
    width: 294 * scaleX,
    height: 25.82 * scaleY,
    borderRadius: (25.82 * scaleY) / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  plateBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.12,
  },
  plateHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  plateEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContent: {
    position: 'absolute',
    top: 0,
    left: 17.52 * scaleX,
    width: 260.6 * scaleX,
    height: 83.02 * scaleY,
  },
  impactAirContainer: {
    width: 260.6 * scaleX,
    height: 36.04 * scaleY,
  },
  impactAirText: {
    fontSize: 40 * Math.min(scaleX, scaleY),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44 * scaleY,
    textTransform: 'uppercase',
    letterSpacing: 2 * scaleX,
    textShadowColor: '#14faab',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  hockeyContainer: {
    marginTop: 12.13 * scaleY,
    width: 261.67 * scaleX,
    height: 45.73 * scaleY,
  },
  hockeyText: {
    fontSize: 48 * Math.min(scaleX, scaleY),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 54 * scaleY,
    textTransform: 'uppercase',
    letterSpacing: 3 * scaleX,
    textShadowColor: '#14faab',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  buttonContainer: {
    position: 'absolute',
    top: 308 * scaleY,
    left: 74 * scaleX,
    width: 213 * scaleX,
  },
  playButton: {
    width: 213 * scaleX,
    height: 46 * scaleY,
    backgroundColor: '#14faab',
    borderRadius: 2 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 21 * scaleY,
  },
  settingsButton: {
    width: 213 * scaleX,
    height: 45 * scaleY,
    backgroundColor: '#14faab',
    borderRadius: 2 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0b191e',
    fontSize: 14 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1 * scaleX,
  },
  gamePucks: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  redPuck: {
    position: 'absolute',
    top: -70 * scaleY,
    right: -76 * scaleX,
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.37,
    shadowRadius: 6 * scaleX,
    elevation: 8,
  },
  puckOuterRed: {
    position: 'absolute',
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    borderRadius: 85.5 * Math.min(scaleX, scaleY),
    backgroundColor: '#14faab',
  },
  puckInnerRed: {
    position: 'absolute',
    top: 40.71 * Math.min(scaleX, scaleY),
    left: 40.71 * Math.min(scaleX, scaleY),
    width: 89.57 * Math.min(scaleX, scaleY),
    height: 89.57 * Math.min(scaleX, scaleY),
    borderRadius: 44.785 * Math.min(scaleX, scaleY),
    backgroundColor: '#0b191e',
  },
  puckStrokeRed: {
    position: 'absolute',
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    borderRadius: 85.5 * Math.min(scaleX, scaleY),
    borderWidth: 2 * scaleX,
    borderColor: '#14faab',
  },
  greenPuck: {
    position: 'absolute',
    bottom: -74 * scaleY,
    left: -72 * scaleX,
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.37,
    shadowRadius: 6 * scaleX,
    elevation: 8,
  },
  puckOuterGreen: {
    position: 'absolute',
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    borderRadius: 85.5 * Math.min(scaleX, scaleY),
    backgroundColor: '#0b191e',
  },
  puckInnerGreen: {
    position: 'absolute',
    top: 40.71 * Math.min(scaleX, scaleY),
    left: 40.71 * Math.min(scaleX, scaleY),
    width: 89.57 * Math.min(scaleX, scaleY),
    height: 89.57 * Math.min(scaleX, scaleY),
    borderRadius: 44.785 * Math.min(scaleX, scaleY),
    backgroundColor: '#14faab',
  },
  puckStrokeGreen: {
    position: 'absolute',
    width: 171 * Math.min(scaleX, scaleY),
    height: 171 * Math.min(scaleX, scaleY),
    borderRadius: 85.5 * Math.min(scaleX, scaleY),
    borderWidth: 2 * scaleX,
    borderColor: '#0b191e',
  },
}); 