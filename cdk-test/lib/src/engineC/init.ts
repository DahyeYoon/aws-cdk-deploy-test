const INIT_TEXT = "hello,cdk-init"

export async function handler(event: any, context: any) {
  console.log(JSON.stringify(event, null, 2))

  return INIT_TEXT
}