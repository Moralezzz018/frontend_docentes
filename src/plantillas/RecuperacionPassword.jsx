import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export const RecuperacionPasswordEmail = ({ pin = '123456', nombreUsuario = 'Usuario' }) => {
  return (
    <Html>
      <Head />
      <Preview>Verificación de identidad - Código de recuperación</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo y marca */}
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logoCircle}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="4" fill="white" />
                  <path d="M8 8h4v4H8V8zm6 0h4v4h-4V8zm6 0h4v4h-4V8zM8 14h4v4H8v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM8 20h4v4H8v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="#1a73e8" />
                </svg>
              </div>
            </div>
          </Section>

          {/* Decoración superior */}
          <Section style={dotsContainer}>
            <span style={dot}>·</span>
            <span style={{...dot, fontSize: '20px'}}>·</span>
            <span style={{...dot, opacity: 0.4, fontSize: '16px'}}>·</span>
          </Section>

          {/* Título principal */}
          <Section style={titleSection}>
            <Text style={verifyText}>VERIFICA TU IDENTIDAD</Text>
            <Heading style={heading}>
              Ingresa el siguiente código para restablecer tu contraseña.
            </Heading>
          </Section>

          {/* Código PIN */}
          <Section style={pinSection}>
            <Text style={pinCode}>{pin}</Text>
          </Section>

          {/* Texto de ayuda */}
          <Section style={helpSection}>
            <Text style={helpText}>
              ¿No esperabas este correo?
            </Text>
            <Text style={helpText}>
              Contacta a{' '}
              <Link href="mailto:soporte@sistema.edu" style={link}>
                soporte@sistema.edu
              </Link>
              {' '}si no solicitaste este código.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              PROTEGIDO DE FORMA SEGURA POR SISTEMA EDUCATIVO.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default RecuperacionPasswordEmail;

// Estilos
const main = {
  backgroundColor: '#f0f0f0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const header = {
  textAlign: 'center',
  marginBottom: '20px',
};

const logoContainer = {
  display: 'inline-block',
};

const logoCircle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  border: '1px solid #e9ecef',
};

const dotsContainer = {
  textAlign: 'center',
  marginBottom: '30px',
  fontSize: '24px',
  color: '#1a73e8',
  letterSpacing: '8px',
};

const dot = {
  opacity: 1,
};

const titleSection = {
  textAlign: 'center',
  marginBottom: '30px',
};

const verifyText = {
  color: '#1a73e8',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '1.5px',
  marginBottom: '16px',
};

const heading = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '1.5',
  margin: '0',
  padding: '0 40px',
};

const pinSection = {
  backgroundColor: '#f8f9fa',
  padding: '32px',
  margin: '30px 0',
  borderRadius: '8px',
  textAlign: 'center',
};

const pinCode = {
  fontSize: '36px',
  fontWeight: '600',
  letterSpacing: '8px',
  color: '#1a1a1a',
  margin: '0',
  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
};

const helpSection = {
  textAlign: 'center',
  marginTop: '30px',
};

const helpText = {
  color: '#6c757d',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '4px 0',
};

const link = {
  color: '#1a73e8',
  textDecoration: 'none',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e9ecef',
  margin: '30px 0',
};

const footer = {
  textAlign: 'center',
};

const footerText = {
  color: '#6c757d',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '1px',
  margin: '0',
};
