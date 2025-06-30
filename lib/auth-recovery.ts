import { createClient } from "@/lib/supabase";

/**
 * Handles authentication recovery when refresh tokens are invalid
 */
export class AuthRecovery {
  private static instance: AuthRecovery;
  
  public static getInstance(): AuthRecovery {
    if (!AuthRecovery.instance) {
      AuthRecovery.instance = new AuthRecovery();
    }
    return AuthRecovery.instance;
  }

  /**
   * Clear all authentication-related data from localStorage
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    const keysToRemove = [
      'sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token',
      'supabase.auth.token',
      'sfdsa_auth_token',
      'sb-auth-token',
    ];

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove auth key:', key, error);
      }
    });

    // Clear all Supabase-related keys (they typically start with 'sb-')
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Failed to clear Supabase keys:', error);
    }
  }

  /**
   * Handle invalid refresh token error
   */
  public async handleInvalidRefreshToken(): Promise<void> {
    console.log('🔧 Handling invalid refresh token error...');
    
    try {
      // Clear corrupted auth data
      this.clearAuthData();
      
      // Sign out from Supabase to clear server-side session
      const supabase = createClient();
      await supabase.auth.signOut();
      
      console.log('✅ Auth data cleared successfully');
      
      // Reload the page to reset auth state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Failed to handle auth recovery:', error);
      
      // Force page reload as fallback
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  /**
   * Check if an error is related to invalid refresh token
   */
  public isInvalidRefreshTokenError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message || error.error_description || '';
    const errorName = error.name || '';
    
    return (
      errorMessage.includes('Invalid Refresh Token') ||
      errorMessage.includes('Refresh Token Not Found') ||
      errorMessage.includes('refresh_token_not_found') ||
      errorName === 'AuthApiError'
    );
  }

  /**
   * Wrap async functions to automatically handle auth errors
   */
  public wrapWithAuthRecovery<T extends (...args: any[]) => Promise<any>>(
    fn: T
  ): T {
    return ((...args: any[]) => {
      return fn(...args).catch((error: any) => {
        if (this.isInvalidRefreshTokenError(error)) {
          console.log('🔄 Auto-recovering from auth error...');
          this.handleInvalidRefreshToken();
          throw new Error('Authentication expired. Please refresh the page.');
        }
        throw error;
      });
    }) as T;
  }

  /**
   * Initialize auth recovery error handlers
   */
  public initializeGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isInvalidRefreshTokenError(event.reason)) {
        console.log('🔄 Caught unhandled auth error, recovering...');
        event.preventDefault();
        this.handleInvalidRefreshToken();
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (this.isInvalidRefreshTokenError(event.error)) {
        console.log('🔄 Caught global auth error, recovering...');
        event.preventDefault();
        this.handleInvalidRefreshToken();
      }
    });
  }
}

// Export singleton instance
export const authRecovery = AuthRecovery.getInstance(); 