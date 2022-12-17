import { useEffect, useState } from 'react'

export function useLocalStorage<T, T1>(
  key: string,
  initialValue: T,
  format?: (data: T1) => T
): [T, (data: T) => void] {
  const [data, setData] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const localDataString = localStorage.getItem(key)
      if (localDataString) {
        let localData = JSON.parse(localDataString)
        if (!!format) {
          localData = format(localData)
        }
        setData(localData)
      }
    } catch (e) {
      console.log(e)
    }
  }, [key])

  const setLocal = (data: T) => {
    try {
      setData(data)
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  }

  return [data, setLocal]
}
