import React, { useState } from 'react';
import { Button, Input, SelectBox } from '@abs-safety/lock-book-web-ui';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const OPTIONS = [
  {
    text: 'job_title_suggestions.architect',
    value: 'Architekt:in',
  },
  {
    text: 'job_title_suggestions.planner',
    value: 'Planer:in',
  },
  {
    text: 'job_title_suggestions.managing_director',
    value: 'Geschäftsführer:in',
  },
  {
    text: 'job_title_suggestions.metal_worker',
    value: 'Metallbauer:in',
  },
  {
    text: 'job_title_suggestions.office_worker',
    value: 'Sachbearbeiter:in',
  },
  {
    text: 'job_title_suggestions.mechanic',
    value: 'Monteur:in',
  },
  {
    text: 'job_title_suggestions.roof',
    value: 'Dachhandwerk:in',
  },
];

const S = {
  Container: styled.div`
    position: relative;

    button {
      position: absolute;
      top: -8px;
      right: 0;
    }
  `,
};

type JobTitleSelectionProps = {
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
};

type Mode = 'options' | 'free';

const getInitialMode = (value: string): Mode => {
  const isValueInOptions = OPTIONS.find((option) => option.value === value) !== undefined;
  const isValueEmpty = value.trim() === '';

  if (isValueEmpty || isValueInOptions) {
    return 'options';
  }

  return 'free';
};

const useJobTitleOptions = () => {
  const { t } = useTranslation();

  const baseOptions = OPTIONS.map((option) => ({
    ...option,
    text: t(option.text),
  })).sort((a, b) => a.text.localeCompare(b.text));

  return [
    ...baseOptions,
    {
      text: t('job_title_suggestions.not_in_list'),
      value: 'not_in_list',
    },
  ];
};

const JobTitleSelection: React.FC<JobTitleSelectionProps> = ({
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
}: JobTitleSelectionProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>(getInitialMode(value));
  const hasError = touched === true && error !== undefined;
  const options = useJobTitleOptions();

  if (mode === 'free') {
    return (
      <S.Container>
        <Input
          type="text"
          name="jobTitle"
          label={t('form.job_title')}
          // autoFocus={true}
          required={true}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          error={hasError}
          errorMessage={error}
        />
        <Button type="button" variant="text" size="small" onClick={() => setMode('options')}>
          {t('form.choose_from_suggestions')}
        </Button>
      </S.Container>
    );
  }

  return (
    <SelectBox
      enableSearch={false}
      error={hasError}
      errorMessage={error}
      options={options}
      value={value}
      label={t('form.job_title')}
      placeholder={placeholder}
      onChange={(optionValue) => {
        if (optionValue === 'not_in_list') {
          setMode('free');
          onChange('');

          return;
        }

        onChange(optionValue);
      }}
      onBlur={onBlur}
    />
  );
};

export default JobTitleSelection;
