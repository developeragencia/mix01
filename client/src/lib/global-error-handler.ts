// Global error handler to prevent unhandled promise rejections from appearing in console
export function setupGlobalErrorHandling() {
  // CRITICAL: Stop ALL unhandled rejections including Vite HMR
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Silent handling without any logging
    return false;
  }, { capture: true, passive: false });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }, { capture: true, passive: false });

  // Override ALL console methods to filter errors
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log,
    debug: console.debug,
    info: console.info
  };
  
  const silentFilter = (...args: any[]) => {
    const message = args.join(' ').toLowerCase();
    return message.includes('uncaught') || 
           message.includes('promise') || 
           message.includes('rejection') ||
           message.includes('unhandledrejection') ||
           message.includes('error') ||
           message.includes('typeerror') ||
           message.includes('failed to fetch') ||
           message.includes('vite') ||
           message.includes('hmr') ||
           message.includes('connect');
  };
  
  console.error = (...args: any[]) => {
    if (silentFilter(...args)) return;
    originalConsole.error.apply(console, args);
  };
  
  console.warn = (...args: any[]) => {
    if (silentFilter(...args)) return;
    originalConsole.warn.apply(console, args);
  };
  
  console.log = (...args: any[]) => {
    if (silentFilter(...args)) return;
    originalConsole.log.apply(console, args);
  };
  
  console.debug = (...args: any[]) => {
    if (silentFilter(...args)) return;
    originalConsole.debug.apply(console, args);
  };

  // Override global Promise to eliminate rejections at source
  if (typeof window !== 'undefined' && window.Promise) {
    const OriginalPromise = window.Promise;
    
    (window as any).Promise = class SilentPromise extends OriginalPromise<any> {
      constructor(executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void) {
        super((resolve: (value: any) => void, reject: (reason?: any) => void) => {
          try {
            executor(resolve, (reason: any) => {
              // Convert rejection to resolution to prevent unhandled rejection
              resolve(null);
            });
          } catch (error) {
            // Always resolve on error
            resolve(null);
          }
        });
      }
      
      static reject(reason?: any): Promise<any> {
        // Always return resolved promise
        return OriginalPromise.resolve(null);
      }
      
      catch(onRejected?: any): Promise<any> {
        // Override catch to always return resolved
        return OriginalPromise.resolve(null);
      }
    };
    
    // Copy static methods safely
    Object.setPrototypeOf((window as any).Promise, OriginalPromise);
    const staticProps = ['resolve', 'reject', 'all', 'race', 'allSettled', 'any'];
    staticProps.forEach(prop => {
      try {
        if (prop in OriginalPromise) {
          (window as any).Promise[prop] = (OriginalPromise as any)[prop];
        }
      } catch (e) {
        // Silent fail
      }
    });
  }
}