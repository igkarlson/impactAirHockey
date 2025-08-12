# Localization Guide

This app supports English and Russian languages using the `react-i18next` library.

## Features

- **Two Languages**: English (en) and Russian (ru)
- **Dynamic Language Switching**: Change language on the fly without app restart
- **Persistent Language Selection**: Language choice is remembered across app sessions
- **Comprehensive Coverage**: All UI text is localized

## How to Use

### 1. Using the Localization Hook

```typescript
import { useLocalization } from '@/app/i18n/hooks';

function MyComponent() {
  const { t, changeLanguage, currentLanguage } = useLocalization();
  
  return (
    <View>
      <Text>{t('hello')}</Text>
      <Button onPress={() => changeLanguage('ru')} title="Switch to Russian" />
    </View>
  );
}
```

### 2. Available Functions

- `t(key)`: Translate text using the current language
- `changeLanguage(lang)`: Switch to a different language ('en' or 'ru')
- `currentLanguage`: Get the current active language
- `getCurrentLanguage()`: Function to get current language

### 3. Adding New Text

1. Add the English text to `app/i18n/en.ts`:
```typescript
export default {
  // ... existing translations
  newFeature: 'New Feature',
};
```

2. Add the Russian translation to `app/i18n/ru.ts`:
```typescript
export default {
  // ... existing translations
  newFeature: 'Новая функция',
};
```

3. Use it in your component:
```typescript
<Text>{t('newFeature')}</Text>
```

## Language Switching

Users can change the language in the Settings screen:
1. Go to Settings → DISPLAY
2. Tap on LANGUAGE
3. Choose between EN (English) and RU (Russian)

## File Structure

```
app/i18n/
├── index.ts          # Main i18n configuration
├── hooks.ts          # Custom hook for easy usage
├── en.ts             # English translations
└── ru.ts             # Russian translations
```

## Best Practices

1. **Always use the `t()` function** for user-facing text
2. **Keep translation keys descriptive** and organized by feature
3. **Test both languages** to ensure proper text fitting
4. **Use interpolation** for dynamic content when needed
5. **Group related translations** together in the language files

## Example Usage

```typescript
// Good - organized by feature
export default {
  // Main Menu
  play: 'PLAY',
  settings: 'SETTINGS',
  
  // Game Settings
  sound: 'SOUND',
  vibration: 'VIBRATION',
  
  // Player Names
  player1: 'Player 1',
  player2: 'Bot Eliot',
};
```

## Troubleshooting

- **Text not showing**: Make sure the translation key exists in both language files
- **Language not switching**: Check that `changeLanguage()` is being called correctly
- **Import errors**: Verify the path to `@/app/i18n/hooks` is correct 