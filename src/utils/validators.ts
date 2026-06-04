export const validateRequired = (field: string, value: string): void => {
  if (!value.trim()) {
    throw new Error(`${field} is required`);
  }
};
