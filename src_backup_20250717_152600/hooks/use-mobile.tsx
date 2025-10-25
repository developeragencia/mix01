import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < 1024)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
