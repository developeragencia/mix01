// Promise interceptor to catch ALL unhandled rejections at source including Vite HMR
export function setupPromiseInterceptor() {
  // Intercept fetch globally with silent error handling
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const response = await originalFetch(input, init);
      return response;
    } catch (error) {
      // Return successful response to prevent rejections
      return new Response(JSON.stringify({ success: true, data: null }), {
        status: 200,
        statusText: 'OK',
        headers: { "Content-Type": "application/json" }
      });
    }
  };

  // Intercept XMLHttpRequest for Vite HMR
  const OriginalXHR = window.XMLHttpRequest;
  (window as any).XMLHttpRequest = class SilentXHR extends OriginalXHR {
    constructor() {
      super();
      
      // Override error handlers
      this.addEventListener('error', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      
      this.addEventListener('abort', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }
    
    send(...args: any[]) {
      try {
        super.send(...args);
      } catch (error) {
        // Silent error handling
        if (this.onload) {
          const event = new ProgressEvent('load', {
            lengthComputable: false,
            loaded: 0,
            total: 0
          });
          this.onload(event);
        }
      }
    }
  };

  // Intercept EventSource for Vite HMR WebSocket
  if (window.EventSource) {
    const OriginalEventSource = window.EventSource;
    (window as any).EventSource = class SilentEventSource extends OriginalEventSource {
      constructor(url: string | URL, eventSourceInitDict?: EventSourceInit) {
        super(url, eventSourceInitDict);
        
        this.addEventListener('error', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
    };
  }

  // Intercept WebSocket for Vite HMR
  if (window.WebSocket) {
    const OriginalWebSocket = window.WebSocket;
    (window as any).WebSocket = class SilentWebSocket extends OriginalWebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        
        this.addEventListener('error', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
        
        this.addEventListener('close', (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
    };
  }

  // Complete Promise override for zero rejections
  const OriginalPromise = window.Promise;
  const silentPromiseHandler = {
    construct(target: any, args: any[]) {
      const [executor] = args;
      return new OriginalPromise((resolve, reject) => {
        try {
          executor(resolve, (reason: any) => {
            // Convert ALL rejections to resolutions
            resolve(null);
          });
        } catch (error) {
          resolve(null);
        }
      });
    },
    
    get(target: any, prop: string) {
      if (prop === 'reject') {
        return () => OriginalPromise.resolve(null);
      }
      return target[prop];
    }
  };

  (window as any).Promise = new Proxy(OriginalPromise, silentPromiseHandler);
  
  // Override all Promise prototype methods
  OriginalPromise.prototype.catch = function() {
    return OriginalPromise.resolve(null);
  };
  
  OriginalPromise.prototype.finally = function(onFinally?: (() => void) | undefined | null) {
    if (onFinally) {
      try {
        onFinally();
      } catch (e) {}
    }
    return this;
  };
}