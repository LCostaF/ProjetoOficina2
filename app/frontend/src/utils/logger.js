const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let currentLogLevel = LOG_LEVELS.DEBUG;

if (import.meta.env.PROD) {
  currentLogLevel = LOG_LEVELS.WARN;
}

const logger = {
  debug: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  info: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },

  warn: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },

  // Função especial para logs relacionados à autenticação
  auth: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[AUTH] ${message}`, ...args);
    }
  },

  // Função especial para logs relacionados à API
  api: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[API] ${message}`, ...args);
    }
  },

  setLogLevel: (level) => {
    if (Object.values(LOG_LEVELS).includes(level)) {
      currentLogLevel = level;
    } else {
      console.error(`Nível de log inválido: ${level}`);
    }
  },

  getLogLevel: () => {
    return Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === currentLogLevel);
  },
};

export default logger;
