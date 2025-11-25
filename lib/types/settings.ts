/**
 * Logo settings type
 */
export interface LogoSettings {
  visible: boolean;           // Whether logo is visible
  texts: string[];            // Dynamic text list
}

/**
 * Global application settings type
 */
export interface AppSettings {
  logo: LogoSettings;
  // Extensible for future settings
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: AppSettings = {
  logo: {
    visible: true,
    texts: ['GUGUGAGA !!!', 'MYGO !!!']
  }
};
