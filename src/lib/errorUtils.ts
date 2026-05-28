export function getErrorMessage(error: unknown): string {
  const err = error as {
    message?: string
    errors?: string[]
  }

  if (err.errors && err.errors.length > 0) {
    return err.errors.join("\n")
  }

  return err.message || "Something went wrong"
}
