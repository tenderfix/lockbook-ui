import React, { useState } from 'react';
import { Button, Input, SelectBox } from '@abs-safety/lock-book-web-ui';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const OPTIONS = [
  {
    text: 'industry_suggestions.architecture',
    value: 'Architekturbüro',
  },
  {
    text: 'industry_suggestions.engineering',
    value: 'Ingenieurbüro',
  },
  {
    text: 'industry_suggestions.roofing',
    value: 'Dachdeckerei',
  },
  {
    text: 'industry_suggestions.metal_construction',
    value: 'Metallbau',
  },
  {
    text: 'industry_suggestions.carpentry',
    value: 'Zimmerei',
  },
  {
    text: 'industry_suggestions.structural',
    value: 'Statiker',
  },
  {
    text: 'industry_suggestions.interior',
    value: 'Innenausbau',
  },
  {
    text: 'industry_suggestions.renewables',
    value: 'Erneuerbare Energien',
  },
  {
    text: 'industry_suggestions.maintenance',
    value: 'Wartung und Instandhaltung',
  },
  {
    text: 'industry_suggestions.trader',
    value: 'Baustoffhandel',
  },
  {
    text: 'industry_suggestions.manufacturer',
    value: 'Baustoffhersteller',
  },
  {
    text: 'industry_suggestions.climber',
    value: 'Industrie-/Höhenkletterer',
  },
  {
    text: 'industry_suggestions.facility_management',
    value: 'Facility Management',
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

type IndustrySelectionProps = {
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

const useIndustryOptions = () => {
  const { t } = useTranslation();

  const baseOptions = OPTIONS.map((option) => ({
    ...option,
    text: t(option.text),
  })).sort((a, b) => a.text.localeCompare(b.text));

  return [
    ...baseOptions,
    {
      text: t('industry_suggestions.not_in_list'),
      value: 'not_in_list',
    },
  ];
};

const IndustrySelection: React.FC<IndustrySelectionProps> = ({
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
}: IndustrySelectionProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>(getInitialMode(value));
  const hasError = touched === true && error !== undefined;
  const options = useIndustryOptions();

  if (mode === 'free') {
    return (
      <S.Container>
        <Input
          type="text"
          name="industry"
          label={t('form.industry')}
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
      label={t('form.industry')}
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

export default IndustrySelection;
