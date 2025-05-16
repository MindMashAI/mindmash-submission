import { QRCodeSVG } from "qrcode.react"

interface QrCodeProps {
  value: string
  size?: number
  className?: string
}

export function QrCode({ value, size = 180, className = "" }: QrCodeProps) {
  if (!value) return null

  return <QRCodeSVG value={value} size={size} bgColor="#FFFFFF" fgColor="#000000" level="L" className={className} />
}
