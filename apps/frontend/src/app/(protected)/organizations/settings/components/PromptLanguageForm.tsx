'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Translate as TranslateIcon } from '@mui/icons-material';

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

interface PromptLanguageSelectorProps {
  /** Current selected language codes (e.g. ['en', 'ja']) */
  value: string[];
  /** Called whenever the selection changes */
  onChange: (languages: string[]) => void;
}

/**
 * Inline language chip selector for use inside a form/drawer.
 * Does NOT save to the API itself — the parent is responsible for saving.
 */
export default function PromptLanguageSelector({
  value,
  onChange,
}: PromptLanguageSelectorProps) {
  const toggle = (code: string) => {
    if (value.includes(code)) {
      // Prevent deselecting the last language
      if (value.length === 1) return;
      onChange(value.filter(l => l !== code));
    } else {
      onChange([...value, code]);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TranslateIcon color="action" fontSize="small" />
        <Typography variant="subtitle2" fontWeight={500}>
          Prompt Generation Languages
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Select the language(s) for generated test prompts. At least one is required.
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      {/* Language chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        {SUPPORTED_PROMPT_LANGUAGES.map(lang => {
          const isSelected = value.includes(lang.code);
          const isLastSelected = isSelected && value.length === 1;

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
              onClick={() => toggle(lang.code)}
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

      {/* Summary text */}
      <Typography variant="body2" color="text.secondary">
        {value.length === 1
          ? `Prompts will be generated in ${
              SUPPORTED_PROMPT_LANGUAGES.find(l => l.code === value[0])?.label ?? value[0]
            }.`
          : `Prompts will be generated in ${value.length} languages: ${value
              .map(code => SUPPORTED_PROMPT_LANGUAGES.find(l => l.code === code)?.label ?? code)
              .join(', ')}.`}
      </Typography>
    </Box>
  );
}
