import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('Medium');

  const playerStats = {
    gamesPlayed: 42,
    gamesWon: 28,
    winRate: '67%',
    bestScore: 15,
    totalGoals: 156,
  };

  const achievements = [
    { name: 'First Win', description: 'Win your first game', unlocked: true },
    { name: 'Goal Scorer', description: 'Score 50 goals', unlocked: true },
    { name: 'Unstoppable', description: 'Win 10 games in a row', unlocked: false },
    { name: 'Perfect Game', description: 'Win without conceding', unlocked: false },
  ];

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ThemedText style={styles.backButtonText}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>Player Profile</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{playerStats.gamesPlayed}</ThemedText>
                <ThemedText style={styles.statLabel}>Games Played</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{playerStats.gamesWon}</ThemedText>
                <ThemedText style={styles.statLabel}>Games Won</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{playerStats.winRate}</ThemedText>
                <ThemedText style={styles.statLabel}>Win Rate</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{playerStats.bestScore}</ThemedText>
                <ThemedText style={styles.statLabel}>Best Score</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={soundEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Vibration</ThemedText>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={vibrationEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Difficulty</ThemedText>
              <TouchableOpacity style={styles.difficultyButton}>
                <ThemedText style={styles.difficultyText}>{difficulty}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <ThemedText style={styles.achievementIconText}>
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </ThemedText>
                </View>
                <View style={styles.achievementContent}>
                  <ThemedText style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.achievementLocked
                  ]}>
                    {achievement.name}
                  </ThemedText>
                  <ThemedText style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementLocked
                  ]}>
                    {achievement.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton}>
              <ThemedText style={styles.resetButtonText}>Reset Progress</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',
  },
  difficultyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  difficultyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 15,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  resetButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 