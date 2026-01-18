// Função para gerar código PIX Copia e Cola (EMV)
export function generatePixPayload(pixKey: string, amount: number, name: string, city: string): string {
  // Remove caracteres especiais da chave
  const cleanKey = pixKey.trim()

  // Função auxiliar para criar campos EMV
  const createEMVField = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, "0")
    return `${id}${length}${value}`
  }

  // Merchant Account Information (26)
  const merchantAccountInfo = createEMVField("00", "BR.GOV.BCB.PIX") + createEMVField("01", cleanKey)

  // Transaction Amount (54)
  const transactionAmount = amount > 0 ? createEMVField("54", amount.toFixed(2)) : ""

  // Payload
  let payload =
    createEMVField("00", "01") + // Payload Format Indicator
    createEMVField("26", merchantAccountInfo) + // Merchant Account Information
    createEMVField("52", "0000") + // Merchant Category Code
    createEMVField("53", "986") + // Transaction Currency (986 = BRL)
    transactionAmount +
    createEMVField("58", "BR") + // Country Code
    createEMVField("59", name.substring(0, 25)) + // Merchant Name
    createEMVField("60", city.substring(0, 15)) // Merchant City

  // CRC16 (campo 63)
  payload += "6304"
  const crc = calculateCRC16(payload)
  payload += crc

  return payload
}

// Função para calcular CRC16 CCITT
function calculateCRC16(payload: string): string {
  let crc = 0xffff

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }

  crc = crc & 0xffff
  return crc.toString(16).toUpperCase().padStart(4, "0")
}
