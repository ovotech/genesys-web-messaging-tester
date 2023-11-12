export async function waitForMs(interval: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, interval));
}
