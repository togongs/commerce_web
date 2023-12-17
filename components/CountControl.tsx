import { useState, useRef, Dispatch, SetStateAction } from 'react'
import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
} from '@mantine/core'

interface CountProps {
  value: number
  setValue: any
}

export default function CountControl({ value, setValue }: CountProps) {
  const handlers = useRef<NumberInputHandlers>()

  return (
    <Group>
      <ActionIcon
        size={42}
        variant="default"
        onClick={() => handlers.current?.decrement()}
      >
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={setValue}
        handlersRef={handlers}
        max={200}
        min={1}
        step={1}
        readOnly
        styles={{ input: { width: 54, textAlign: 'center' } }}
      />

      <ActionIcon
        size={42}
        variant="default"
        onClick={() => handlers.current?.increment()}
      >
        +
      </ActionIcon>
    </Group>
  )
}
