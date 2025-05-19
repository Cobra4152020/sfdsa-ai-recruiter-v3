import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import { getServiceSupabase } from '@/lib/supabase/server';

const rpName = 'SFDSA Recruiter';
const rpID = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
const origin = process.env.NEXT_PUBLIC_ORIGIN || `https://${rpID}`;

export class WebAuthnService {
  private supabase = getServiceSupabase();

  // Get authenticator devices for a user
  async getUserDevices(userId: string): Promise<AuthenticatorDevice[]> {
    const { data, error } = await this.supabase
      .from('user_authenticators')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  // Generate registration options
  async generateRegistration(userId: string, username: string) {
    const userDevices = await this.getUserDevices(userId);
    
    const options: GenerateRegistrationOptionsOpts = {
      rpName,
      rpID,
      userID: userId,
      userName: username,
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
      excludeCredentials: userDevices.map(dev => ({
        id: dev.credentialID,
        type: 'public-key',
        transports: dev.transports,
      })),
    };

    const regOptions = await generateRegistrationOptions(options);

    // Save challenge to verify later
    await this.supabase.from('webauthn_challenges').insert({
      user_id: userId,
      challenge: regOptions.challenge,
      type: 'registration',
      expires_at: new Date(Date.now() + 60000).toISOString(),
    });

    return regOptions;
  }

  // Verify registration response
  async verifyRegistration(
    userId: string,
    response: RegistrationResponseJSON,
  ) {
    // Get saved challenge
    const { data: challengeData, error: challengeError } = await this.supabase
      .from('webauthn_challenges')
      .select('challenge')
      .eq('user_id', userId)
      .eq('type', 'registration')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (challengeError || !challengeData) {
      throw new Error('Invalid or expired challenge');
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (verification.verified) {
      const { credentialID, credentialPublicKey, counter } = verification.registrationInfo!;

      // Save the new device
      await this.supabase.from('user_authenticators').insert({
        user_id: userId,
        credential_id: credentialID,
        public_key: credentialPublicKey,
        counter,
        transports: response.response.transports,
      });

      // Clean up the challenge
      await this.supabase
        .from('webauthn_challenges')
        .delete()
        .eq('user_id', userId)
        .eq('type', 'registration');
    }

    return verification;
  }

  // Generate authentication options
  async generateAuthentication(userId: string) {
    const userDevices = await this.getUserDevices(userId);

    if (userDevices.length === 0) {
      throw new Error('No registered authenticators');
    }

    const options: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      allowCredentials: userDevices.map(dev => ({
        id: dev.credentialID,
        type: 'public-key',
        transports: dev.transports,
      })),
      userVerification: 'preferred',
      rpID,
    };

    const authOptions = await generateAuthenticationOptions(options);

    // Save challenge
    await this.supabase.from('webauthn_challenges').insert({
      user_id: userId,
      challenge: authOptions.challenge,
      type: 'authentication',
      expires_at: new Date(Date.now() + 60000).toISOString(),
    });

    return authOptions;
  }

  // Verify authentication response
  async verifyAuthentication(
    userId: string,
    response: AuthenticationResponseJSON,
  ) {
    // Get saved challenge
    const { data: challengeData, error: challengeError } = await this.supabase
      .from('webauthn_challenges')
      .select('challenge')
      .eq('user_id', userId)
      .eq('type', 'authentication')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (challengeError || !challengeData) {
      throw new Error('Invalid or expired challenge');
    }

    // Get authenticator
    const { data: authenticator, error: authError } = await this.supabase
      .from('user_authenticators')
      .select('*')
      .eq('credential_id', response.id)
      .single();

    if (authError || !authenticator) {
      throw new Error('Authenticator not found');
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: authenticator.credential_id,
        credentialPublicKey: authenticator.public_key,
        counter: authenticator.counter,
      },
      requireUserVerification: true,
    });

    if (verification.verified) {
      // Update the authenticator's counter
      await this.supabase
        .from('user_authenticators')
        .update({ counter: verification.authenticationInfo.newCounter })
        .eq('credential_id', response.id);

      // Clean up the challenge
      await this.supabase
        .from('webauthn_challenges')
        .delete()
        .eq('user_id', userId)
        .eq('type', 'authentication');
    }

    return verification;
  }
} 