const CLOSE_TEXT = "hello,cdk-close"

export async function handler(event: any, context: any) {
  console.log(JSON.stringify(event, null, 2))

  return CLOSE_TEXT
}