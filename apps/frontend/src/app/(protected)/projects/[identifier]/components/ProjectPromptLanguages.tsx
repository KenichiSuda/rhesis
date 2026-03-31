'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import { Project } from '@/utils/api-client/interfaces/project';
import { useNotifications } from '@/components/common/NotificationContext';

// Supported languages for prompt generation
const SUPPORTED_PROMPT_LANGUAGES = [
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

interface ProjectPromptLanguagesProps {
  project: Project;
  sessionToken: string;
  onProjectUpdate: (updatedProject: Partial<Project>) => Promise<void>;
}

export default function ProjectPromptLanguages({
  project,
  onProjectUpdate,
}: ProjectPromptLanguagesProps) {
  const notifications = useNotifications();

  // Current languages from project.attributes
  const currentLanguages: string[] =
    (project.attributes?.prompt_languages as string[] | undefined) ?? [];

  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Languages not yet added
  const availableLanguages = SUPPORTED_PROMPT_LANGUAGES.filter(
    l => !currentLanguages.includes(l.code)
  );

  const handleAdd = useCallback(
    async (code: string) => {
      if (currentLanguages.includes(code)) return;

      setSaving(true);
      try {
        const newLanguages = [...currentLanguages, code];
        await onProjectUpdate({
          attributes: {
            ...(project.attributes || {}),
            prompt_languages: newLanguages,
          },
        });
        notifications.show('Language added', { severity: 'success' });
      } catch (err) {
        notifications.show(
          err instanceof Error ? err.message : 'Failed to add language',
          { severity: 'error' }
        );
      } finally {
        setSaving(false);
        setAdding(false);
      }
    },
    [currentLanguages, project.attributes, onProjectUpdate, notifications]
  );

  const handleRemove = useCallback(
    async (code: string) => {
      if (currentLanguages.length <= 1 && currentLanguages.includes(code)) {
        notifications.show('At least one language must remain', {
          severity: 'warning',
        });
        return;
      }

      setSaving(true);
      try {
        const newLanguages = currentLanguages.filter(l => l !== code);
        await onProjectUpdate({
          attributes: {
            ...(project.attributes || {}),
            prompt_languages: newLanguages,
          },
        });
        notifications.show('Language removed', { severity: 'success' });
      } catch (err) {
        notifications.show(
          err instanceof Error ? err.message : 'Failed to remove language',
          { severity: 'error' }
        );
      } finally {
        setSaving(false);
      }
    },
    [currentLanguages, project.attributes, onProjectUpdate, notifications]
  );

  return (
    <Box>
      {/* Currently configured languages */}
      {currentLanguages.length === 0 ? (
        <Box
          sx={{
            py: 4,
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: theme => theme.shape.borderRadius,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <TranslateIcon
            sx={{
              fontSize: theme => theme.typography.h3.fontSize,
              color: 'text.disabled',
              mb: 1,
              opacity: 0.5,
            }}
          />
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            No prompt languages configured. Generated test prompts will default
            to English.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setAdding(true)}
            disabled={saving}
          >
            Add Language
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Add Language button — top right */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={saving ? <CircularProgress size={14} /> : <AddIcon />}
              onClick={() => setAdding(v => !v)}
              disabled={saving || availableLanguages.length === 0}
            >
              Add Language
            </Button>
          </Box>

          {/* Active language chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentLanguages.map(code => {
              const lang = SUPPORTED_PROMPT_LANGUAGES.find(
                l => l.code === code
              );
              return (
                <Chip
                  key={code}
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.25 }}>
                      <Typography variant="caption" fontWeight={500} lineHeight={1.2}>
                        {lang?.nativeLabel ?? code}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>
                        {lang?.label ?? code}
                      </Typography>
                    </Box>
                  }
                  onDelete={
                    currentLanguages.length > 1
                      ? () => handleRemove(code)
                      : undefined
                  }
                  deleteIcon={<CloseIcon fontSize="small" />}
                  color="primary"
                  variant="filled"
                  disabled={saving}
                  sx={{ height: 'auto', px: 1, py: 0.5, borderRadius: 2 }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Language picker — shown when Add Language is clicked */}
      {adding && availableLanguages.length > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: theme => theme.shape.borderRadius,
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Select a language to add:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableLanguages.map(lang => (
              <Chip
                key={lang.code}
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.25 }}>
                    <Typography variant="caption" fontWeight={500} lineHeight={1.2}>
                      {lang.nativeLabel}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>
                      {lang.label}
                    </Typography>
                  </Box>
                }
                onClick={() => handleAdd(lang.code)}
                variant="outlined"
                disabled={saving}
                sx={{
                  height: 'auto',
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-1px)' },
                  transition: 'all 0.15s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
