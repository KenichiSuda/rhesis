'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Translate as TranslateIcon } from '@mui/icons-material';
import { ApiClientFactory } from '@/utils/api-client/client-factory';
import { UserSettings } from '@/utils/api-client/interfaces/user';
import { useNotifications } from '@/components/common/NotificationContext';

// Supported languages for prompt generation
export const SUPPORTED_PROMPT_LANGUAGES: { code: string; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
];

interface PromptLanguageFormProps {
  userSettings: UserSettings | null;
  sessionToken: string;
  onUpdate?: (updatedSettings: UserSettings) => void;
}

export default function PromptLanguageForm({
  userSettings,
  sessionToken,
  onUpdate,
}: PromptLanguageFormProps) {
  const notifications = useNotifications();

  const initialLanguages =
    userSettings?.localization?.prompt_languages ?? ['en'];

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialLanguages);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges =
    JSON.stringify([...selectedLanguages].sort()) !==
    JSON.stringify([...initialLanguages].sort());

  const toggleLanguage = (code: string) => {
    setError(null);
    setSelectedLanguages(prev => {
      if (prev.includes(code)) {
        // Prevent deselecting the last language
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== code);
      }
      return [...prev, code];
    });
  };

  const handleSave = async () => {
    if (selectedLanguages.length === 0) {
      setError('At least one language must be selected.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const apiFactory = new ApiClientFactory(sessionToken);
      const usersClient = apiFactory.getUsersClient();

      const updated = await usersClient.updateUserSettings({
        localization: {
          ...userSettings?.localization,
          prompt_languages: selectedLanguages,
        },
      });

      notifications.show('Prompt language settings saved.', { severity: 'success' });
      onUpdate?.(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save settings.';
      setError(message);
      notifications.show(message, { severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <TranslateIcon color="action" fontSize="small" />
        <Typography variant="h6" fontWeight={500}>
          Prompt Generation Languages
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Select the language(s) you want generated test prompts to be written in. When multiple
        languages are selected, tests are distributed evenly across all chosen languages.
        At least one language must be selected.
      </Typography>

      <Divider sx={{ mb: 2.5 }} />

      {/* Language chip grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {SUPPORTED_PROMPT_LANGUAGES.map(lang => {
          const isSelected = selectedLanguages.includes(lang.code);
          const isLastSelected = isSelected && selectedLanguages.length === 1;

          return (
            <Chip
              key={lang.code}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.25 }}>
                  <Typography variant="caption" fontWeight={500} lineHeight={1.2}>
                    {lang.nativeLabel}
                  </Typography>
                  <Typography variant="caption" color="inherit" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>
                    {lang.label}
                  </Typography>
                </Box>
              }
              onClick={() => toggleLanguage(lang.code)}
              disabled={isLastSelected}
              variant={isSelected ? 'filled' : 'outlined'}
              color={isSelected ? 'primary' : 'default'}
              sx={{
                height: 'auto',
                px: 1,
                py: 0.5,
                borderRadius: 2,
                cursor: isLastSelected ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  transform: isLastSelected ? 'none' : 'translateY(-1px)',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Selection summary */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {selectedLanguages.length === 1
          ? `Prompts will be generated in ${
              SUPPORTED_PROMPT_LANGUAGES.find(l => l.code === selectedLanguages[0])?.label ??
              selectedLanguages[0]
            }.`
          : `Prompts will be generated in ${selectedLanguages.length} languages: ${selectedLanguages
              .map(
                code =>
                  SUPPORTED_PROMPT_LANGUAGES.find(l => l.code === code)?.label ?? code
              )
              .join(', ')}.`}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>
    </Paper>
  );
}
