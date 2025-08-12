import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

import { useLocalization } from '../app/i18n/hooks';

interface LanguageSwitcherProps {
  style?: any;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
  const { t, changeLanguage, currentLanguage } = useLocalization();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={[
          styles.languageButton,
          currentLanguage === 'en' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('en')}
      >
        <ThemedText style={styles.languageButtonText}>{t('en')}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.languageButton,
          currentLanguage === 'ru' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('ru')}
      >
        <ThemedText style={styles.languageButtonText}>{t('ru')}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#318CFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#F94444',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
}); 