import { useState } from 'react';

import { Input } from '@/components/ui/input';

type NameFieldProps = {
  value: string;
  onCommit: (value: string) => void;
  accessibilityLabel: string;
};

export function NameField({ value, onCommit, accessibilityLabel }: NameFieldProps) {
  const [text, setText] = useState(value);

  return (
    <Input
      value={text}
      onChangeText={setText}
      onEndEditing={(event) => {
        const next = event.nativeEvent.text;
        onCommit(next);
        if (next.trim() === '') {
          setText(value);
        }
      }}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
