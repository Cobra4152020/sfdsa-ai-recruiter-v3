import { getServiceSupabase } from '@/lib/supabase/server';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'api_access' | 'admin_action' | 'data_modification';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  metadata: Record<string, any>;
}

export class SecurityMonitoringService {
  private supabase = getServiceSupabase();
  private realtimeChannel?: RealtimeChannel;
  private alertHandlers: ((alert: SecurityAlert) => void)[] = [];

  // Initialize real-time monitoring
  async initialize() {
    // Subscribe to security events
    this.realtimeChannel = this.supabase
      .channel('security_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events',
        },
        (payload) => this.handleSecurityEvent(payload.new as SecurityEvent)
      )
      .subscribe();

    // Start anomaly detection
    this.startAnomalyDetection();
  }

  // Add alert handler
  onAlert(handler: (alert: SecurityAlert) => void) {
    this.alertHandlers.push(handler);
  }

  // Remove alert handler
  offAlert(handler: (alert: SecurityAlert) => void) {
    this.alertHandlers = this.alertHandlers.filter(h => h !== handler);
  }

  // Log security event
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>) {
    const { data, error } = await this.supabase
      .from('security_events')
      .insert({
        ...event,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Handle security event
  private async handleSecurityEvent(event: SecurityEvent) {
    // Check for suspicious patterns
    const alerts = await this.detectThreats(event);
    
    // Process and store alerts
    for (const alert of alerts) {
      await this.processAlert(alert);
    }
  }

  // Start anomaly detection
  private async startAnomalyDetection() {
    setInterval(async () => {
      await this.detectAnomalies();
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  // Detect threats from a security event
  private async detectThreats(event: SecurityEvent): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];

    // Check for rapid login attempts
    if (event.type === 'login_attempt') {
      const recentAttempts = await this.getRecentLoginAttempts(event.ipAddress);
      if (recentAttempts.length >= 5) {
        alerts.push({
          id: crypto.randomUUID(),
          eventId: event.id,
          type: 'brute_force_attempt',
          message: `Multiple login attempts detected from IP ${event.ipAddress}`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          metadata: {
            attempts: recentAttempts.length,
            timeWindow: '5 minutes',
          },
        });
      }
    }

    // Check for suspicious admin actions
    if (event.type === 'admin_action') {
      const recentAdminActions = await this.getRecentAdminActions(event.userId!);
      if (recentAdminActions.length >= 10) {
        alerts.push({
          id: crypto.randomUUID(),
          eventId: event.id,
          type: 'suspicious_admin_activity',
          message: `High frequency of admin actions detected`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          metadata: {
            actions: recentAdminActions.length,
            timeWindow: '5 minutes',
          },
        });
      }
    }

    // Check for unusual API access patterns
    if (event.type === 'api_access') {
      const recentApiCalls = await this.getRecentApiCalls(event.ipAddress);
      if (recentApiCalls.length >= 100) {
        alerts.push({
          id: crypto.randomUUID(),
          eventId: event.id,
          type: 'api_abuse',
          message: `High API usage detected from IP ${event.ipAddress}`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          metadata: {
            calls: recentApiCalls.length,
            timeWindow: '1 minute',
          },
        });
      }
    }

    return alerts;
  }

  // Detect anomalies in security events
  private async detectAnomalies() {
    const timeWindow = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    // Get recent security events
    const { data: events } = await this.supabase
      .from('security_events')
      .select('*')
      .gt('timestamp', timeWindow);

    if (!events) return;

    // Analyze event patterns
    const patterns = this.analyzeEventPatterns(events);

    // Generate alerts for anomalies
    const alerts = this.detectAnomalousPatterns(patterns);

    // Process alerts
    for (const alert of alerts) {
      await this.processAlert(alert);
    }
  }

  // Process and store security alert
  private async processAlert(alert: SecurityAlert) {
    // Store alert
    const { error } = await this.supabase
      .from('security_alerts')
      .insert(alert);

    if (error) {
      console.error('Failed to store security alert:', error);
      return;
    }

    // Notify handlers
    this.alertHandlers.forEach(handler => handler(alert));

    // Take automated actions based on severity
    await this.handleAlert(alert);
  }

  // Handle security alert
  private async handleAlert(alert: SecurityAlert) {
    switch (alert.severity) {
      case 'critical':
        // Block IP immediately
        if (alert.metadata.ipAddress) {
          await this.blockIP(alert.metadata.ipAddress);
        }
        // Notify security team
        await this.notifySecurityTeam(alert);
        break;
      
      case 'high':
        // Increase monitoring
        await this.increaseSurveillance(alert.metadata.ipAddress);
        break;
      
      case 'medium':
        // Log for review
        await this.logForReview(alert);
        break;
    }
  }

  // Helper methods for threat detection
  private async getRecentLoginAttempts(ipAddress: string) {
    const { data } = await this.supabase
      .from('security_events')
      .select('*')
      .eq('type', 'login_attempt')
      .eq('ipAddress', ipAddress)
      .gt('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    return data || [];
  }

  private async getRecentAdminActions(userId: string) {
    const { data } = await this.supabase
      .from('security_events')
      .select('*')
      .eq('type', 'admin_action')
      .eq('userId', userId)
      .gt('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    return data || [];
  }

  private async getRecentApiCalls(ipAddress: string) {
    const { data } = await this.supabase
      .from('security_events')
      .select('*')
      .eq('type', 'api_access')
      .eq('ipAddress', ipAddress)
      .gt('timestamp', new Date(Date.now() - 60 * 1000).toISOString());
    return data || [];
  }

  // Helper methods for anomaly detection
  private analyzeEventPatterns(events: SecurityEvent[]) {
    // Group events by type and calculate frequencies
    const patterns = events.reduce((acc, event) => {
      const key = `${event.type}_${event.ipAddress}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return patterns;
  }

  private detectAnomalousPatterns(patterns: Record<string, number>): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];
    
    // Check for unusual patterns
    for (const [key, count] of Object.entries(patterns)) {
      const [type, ipAddress] = key.split('_');
      
      // Define thresholds for different event types
      const thresholds = {
        login_attempt: 10,
        api_access: 200,
        admin_action: 20,
        data_modification: 50,
      };

      if (count > thresholds[type as keyof typeof thresholds]) {
        alerts.push({
          id: crypto.randomUUID(),
          eventId: '', // No specific event
          type: 'anomalous_activity',
          message: `Unusual ${type} activity detected from IP ${ipAddress}`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          metadata: {
            eventType: type,
            count,
            ipAddress,
            threshold: thresholds[type as keyof typeof thresholds],
          },
        });
      }
    }

    return alerts;
  }

  // Action methods
  private async blockIP(ipAddress: string) {
    // Implement IP blocking logic
    await this.supabase.from('blocked_ips').insert({
      ip_address: ipAddress,
      blocked_at: new Date().toISOString(),
      reason: 'Automated security response',
    });
  }

  private async increaseSurveillance(ipAddress: string) {
    // Implement increased monitoring logic
    await this.supabase.from('monitored_ips').insert({
      ip_address: ipAddress,
      monitoring_level: 'high',
      started_at: new Date().toISOString(),
    });
  }

  private async notifySecurityTeam(alert: SecurityAlert) {
    // Implement security team notification logic
    await this.supabase.from('security_notifications').insert({
      alert_id: alert.id,
      severity: alert.severity,
      message: alert.message,
      created_at: new Date().toISOString(),
    });
  }

  private async logForReview(alert: SecurityAlert) {
    // Implement logging logic
    await this.supabase.from('security_review_queue').insert({
      alert_id: alert.id,
      severity: alert.severity,
      message: alert.message,
      created_at: new Date().toISOString(),
    });
  }

  // Cleanup
  destroy() {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
  }
} 