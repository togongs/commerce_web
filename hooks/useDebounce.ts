import React from 'react'

const useDebounce = <T = any>(value: T, delay = 600) => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(() => value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])

  return debouncedValue
}

export default useDebounce
