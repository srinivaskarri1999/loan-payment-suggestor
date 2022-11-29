import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [data, setData] = useState(initialValue)

  useEffect(() => {
    try {
      const localData = localStorage.getItem(key)
      if (localData) {
        setData(JSON.parse(localData))
      }
    } catch (e) {
      console.log(e)
    }
  }, [key])

  const setLocal = (data) => {
    try {
      setData(data)
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  }

  return [data, setLocal]
}
