/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */

export const envOrDefault = (key: string, defaultValue: string): string => {
    return process.env[key] || defaultValue;
}