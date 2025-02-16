import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>Sobre o Emprega Bem</h1>
          <p className="hero-subtitle">Conectando talentos às melhores oportunidades do mercado</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <h2>Nossa Missão</h2>
          <p>
            O Emprega Bem nasceu com o propósito de transformar a maneira como as pessoas encontram
            oportunidades profissionais. Nossa missão é conectar talentos às empresas de forma
            eficiente e transparente, contribuindo para o desenvolvimento profissional e o
            crescimento do mercado de trabalho brasileiro.
          </p>
        </section>

        <section className="about-grid">
          <div className="about-card">
            <h3>Para Candidatos</h3>
            <ul>
              <li>Acesso a milhares de vagas atualizadas</li>
              <li>Processo de candidatura simplificado</li>
              <li>Acompanhamento do status das candidaturas</li>
              <li>Recomendações personalizadas de vagas</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>Para Empresas</h3>
            <ul>
              <li>Publicação ilimitada de vagas</li>
              <li>Ferramentas de gestão de candidatos</li>
              <li>Analytics e relatórios detalhados</li>
              <li>Suporte dedicado</li>
            </ul>
          </div>
        </section>

        <section className="about-section">
          <h2>Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>Transparência</h4>
              <p>Compromisso com informações claras e processos transparentes</p>
            </div>
            <div className="value-item">
              <h4>Inovação</h4>
              <p>Busca constante por soluções tecnológicas inovadoras</p>
            </div>
            <div className="value-item">
              <h4>Inclusão</h4>
              <p>Promoção da diversidade e igualdade de oportunidades</p>
            </div>
            <div className="value-item">
              <h4>Excelência</h4>
              <p>Compromisso com a qualidade em todos os aspectos</p>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>Entre em Contato</h2>
          <p>
            Tem alguma dúvida ou sugestão? Estamos sempre à disposição para ajudar.
          </p>
          <div className="contact-buttons">
            <a href="mailto:contato@empregabem.com" className="btn-primary">
              Enviar E-mail
            </a>
            <a href="/faq" className="btn-secondary">
              Ver FAQ
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
