import React from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-content">
          <h1>Política de Privacidade</h1>
          <p className="last-updated">Última atualização: {new Date().toLocaleDateString()}</p>

          <section className="privacy-section">
            <h2>1. Introdução</h2>
            <p>
              O Emprega Bem está comprometido em proteger sua privacidade. Esta política descreve como coletamos,
              usamos e protegemos suas informações pessoais ao usar nossa plataforma.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Informações que Coletamos</h2>
            <h3>2.1. Informações de Cadastro</h3>
            <p>Coletamos as seguintes informações quando você cria uma conta:</p>
            <ul>
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Senha (armazenada de forma criptografada)</li>
              <li>Currículo (para candidatos)</li>
              <li>Informações profissionais e acadêmicas</li>
              <li>Informações da empresa (para recrutadores)</li>
            </ul>

            <h3>2.2. Informações de Uso</h3>
            <p>Também coletamos dados sobre como você usa nossa plataforma:</p>
            <ul>
              <li>Vagas visualizadas</li>
              <li>Candidaturas realizadas</li>
              <li>Vagas salvas</li>
              <li>Interações com outros usuários</li>
              <li>Endereço IP e dados do dispositivo</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Criar e gerenciar sua conta</li>
              <li>Conectar candidatos com oportunidades de emprego</li>
              <li>Permitir que recrutadores encontrem candidatos qualificados</li>
              <li>Melhorar nossos serviços</li>
              <li>Enviar comunicações relevantes</li>
              <li>Garantir a segurança da plataforma</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Compartilhamento de Informações</h2>
            <h3>4.1. Com Outros Usuários</h3>
            <p>
              Para candidatos, seu perfil e currículo podem ser visíveis para recrutadores.
              Para recrutadores, informações da empresa e vagas publicadas são visíveis para candidatos.
            </p>

            <h3>4.2. Com Terceiros</h3>
            <p>Podemos compartilhar dados com:</p>
            <ul>
              <li>Provedores de serviços que nos ajudam a operar a plataforma</li>
              <li>Parceiros de análise para melhorar nossos serviços</li>
              <li>Autoridades quando legalmente exigido</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>5. Proteção de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
            </p>
            <ul>
              <li>Criptografia de dados sensíveis</li>
              <li>Firewalls e sistemas de segurança</li>
              <li>Acesso restrito a dados pessoais</li>
              <li>Monitoramento regular de segurança</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. Seus Direitos</h2>
            <p>Você tem direito a:</p>
            <ul>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações imprecisas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Exportar seus dados</li>
              <li>Retirar consentimentos previamente fornecidos</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. Cookies e Tecnologias Similares</h2>
            <p>
              Usamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas preferências
              e entender como nossa plataforma é utilizada.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Alterações na Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas
              através de nosso site ou por e-mail.
            </p>
          </section>

          <div className="privacy-footer">
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato através do e-mail:{' '}
              <a href="mailto:privacidade@empregabem.com">privacidade@empregabem.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 