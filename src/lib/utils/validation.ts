export const validation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 6 && email.length <= 32;
  },

  isValidPassword: (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
  },

  isValidDisplayName: (displayName: string): boolean => {
    const displayNameRegex = /^[a-zA-Z0-9_]+$/;
    return displayNameRegex.test(displayName) && displayName.length >= 3 && displayName.length <= 32;
  },
  
  isValidCommand: (command: string): boolean => {
    const commandRegex = /^[a-z]+\d*[a-z0-9]*$/;
    return commandRegex.test(command);
  },
  
  isValidTag: (tag: string): boolean => {
    const tagRegex = /^[a-z]+(?:-[a-z0-9]+)*$/;
    return tagRegex.test(tag);
  },
  
  isValidArguments: (args: string): boolean => {
    return args.length > 0 && args.length <= 1000; 
  },
  
  isValidNote: (note: Record<string, unknown>): boolean => {
    return typeof note === 'object' && note !== null;
  },
};

export const getPasswordRequirements = () => [
  'At least 8 characters long',
  'At most 16 characters long',
  'Contains at least one lowercase letter',
  'Contains at least one uppercase letter',
  'Contains at least one digit',
  'Contains at least one special character (@$!%*?&)',
];

export const getDisplayNameRequirements = () => [
  '3-32 characters long',
  'Only letters, numbers, and underscores allowed',
];

export const getCommandRequirements = () => [
  'Lowercase letters only',
  'Can include numbers',
  'No special characters except letters and numbers',
];

export const getTagRequirements = () => [
  'Lowercase letters only',
  'Can include hyphens and numbers',
  'Must start with a letter',
];
