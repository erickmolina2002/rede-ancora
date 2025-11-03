import { NextResponse } from "next/server"

const SSO_URL = "https://sso-catalogo.redeancora.com.br"
const CLIENT_ID = "65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx"
const CLIENT_SECRET = "9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn"

export async function POST() {
  try {
    console.log("[v0] Attempting to authenticate with SSO...")
    console.log("[v0] Using client_id:", CLIENT_ID)

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")

    const formData = new URLSearchParams()
    formData.append("grant_type", "client_credentials")

    const response = await fetch(`${SSO_URL}/connect/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: formData,
    })

    console.log("[v0] SSO Response status:", response.status)

    const text = await response.text()
    console.log("[v0] SSO Response text:", text)

    if (!response.ok && text.includes("invalid_client")) {
      console.log("[v0] Basic Auth failed, trying with credentials in body...")

      const formDataWithCreds = new URLSearchParams()
      formDataWithCreds.append("client_id", CLIENT_ID)
      formDataWithCreds.append("client_secret", CLIENT_SECRET)
      formDataWithCreds.append("grant_type", "client_credentials")

      const response2 = await fetch(`${SSO_URL}/connect/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formDataWithCreds,
      })

      const text2 = await response2.text()
      console.log("[v0] Second attempt status:", response2.status)
      console.log("[v0] Second attempt response:", text2)

      if (!response2.ok) {
        console.error("[v0] Both authentication methods failed")
        throw new Error(`Authentication failed: ${response2.status} - ${text2}`)
      }

      const data2 = JSON.parse(text2)
      console.log("[v0] Successfully authenticated with body credentials")
      return NextResponse.json(data2)
    }

    if (!response.ok) {
      console.error("[v0] SSO authentication failed:", text)
      throw new Error(`Authentication failed: ${response.status} - ${text}`)
    }

    if (!text) {
      throw new Error("Empty response from SSO")
    }

    const data = JSON.parse(text)
    console.log("[v0] Successfully authenticated with Basic Auth")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return NextResponse.json(
      {
        error: "Failed to authenticate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
