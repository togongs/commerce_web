import { useState, useRef } from 'react'
import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
} from '@mantine/core'

interface CountProps {
  quantity: number
  setQuantity: any
}

export default function CountControl({ quantity, setQuantity }: CountProps) {
  const [value, setValue] = useState<number>(0)
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
        onChange={(val) => setValue(Number(val))}
        handlersRef={handlers}
        max={200}
        min={0}
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
