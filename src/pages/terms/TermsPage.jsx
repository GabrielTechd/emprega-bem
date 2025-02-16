import React from 'react';
import './TermsPage.css';

const TermsPage = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-content">
          <h1>Termos de Uso</h1>
          <p className="last-updated">Última atualização: {new Date().toLocaleDateString()}</p>

          <section className="terms-section">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Emprega Bem, você concorda em cumprir e estar vinculado aos seguintes termos e condições.
              Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Elegibilidade</h2>
            <p>
              Para usar o Emprega Bem, você deve ter pelo menos 18 anos de idade e capacidade legal para celebrar contratos.
              Ao criar uma conta, você confirma que atende a estes requisitos.
            </p>
          </section>

          <section className="terms-section">
            <h2>3. Contas de Usuário</h2>
            <h3>3.1. Tipos de Conta</h3>
            <p>
              Oferecemos dois tipos de contas:
            </p>
            <ul>
              <li>
                <strong>Candidatos:</strong> Para pessoas que buscam oportunidades de emprego.
              </li>
              <li>
                <strong>Recrutadores:</strong> Para empresas e profissionais que desejam publicar vagas.
              </li>
            </ul>

            <h3>3.2. Responsabilidades da Conta</h3>
            <p>
              Você é responsável por:
            </p>
            <ul>
              <li>Manter a confidencialidade de sua senha</li>
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Todas as atividades que ocorrem em sua conta</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Uso do Serviço</h2>
            <h3>4.1. Conduta do Usuário</h3>
            <p>
              Ao usar o Emprega Bem, você concorda em não:
            </p>
            <ul>
              <li>Publicar conteúdo falso, enganoso ou fraudulento</li>
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Assediar ou discriminar outros usuários</li>
              <li>Usar o serviço para fins ilegais ou não autorizados</li>
            </ul>

            <h3>4.2. Conteúdo do Usuário</h3>
            <p>
              Você mantém os direitos sobre o conteúdo que publica, mas concede ao Emprega Bem uma licença para usar,
              modificar e exibir esse conteúdo em conexão com o serviço.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Vagas de Emprego</h2>
            <h3>5.1. Para Recrutadores</h3>
            <p>
              Ao publicar vagas, você concorda em:
            </p>
            <ul>
              <li>Fornecer informações precisas sobre a vaga e a empresa</li>
              <li>Cumprir todas as leis trabalhistas aplicáveis</li>
              <li>Não discriminar candidatos ilegalmente</li>
              <li>Responder aos candidatos em tempo hábil</li>
            </ul>

            <h3>5.2. Para Candidatos</h3>
            <p>
              Ao se candidatar a vagas, você concorda em:
            </p>
            <ul>
              <li>Fornecer informações verdadeiras em seu currículo</li>
              <li>Não se candidatar a vagas de má fé</li>
              <li>Manter suas informações atualizadas</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              O Emprega Bem não garante a precisão das informações postadas por usuários ou o sucesso na obtenção de emprego.
              Não nos responsabilizamos por:
            </p>
            <ul>
              <li>Decisões de contratação das empresas</li>
              <li>Condutas dos usuários</li>
              <li>Perdas ou danos resultantes do uso do serviço</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão
              notificadas aos usuários. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Encerramento</h2>
            <p>
              Podemos encerrar ou suspender sua conta por violações destes termos ou por qualquer outro motivo justificável.
              Você pode encerrar sua conta a qualquer momento.
            </p>
          </section>

          <div className="terms-footer">
            <p>
              Para dúvidas sobre estes termos, entre em contato conosco através do e-mail:{' '}
              <a href="mailto:termos@empregabem.com">termos@empregabem.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 