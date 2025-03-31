export enum VERIFICATION_TYPES {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export type TVerificationTypes = keyof typeof VERIFICATION_TYPES;
