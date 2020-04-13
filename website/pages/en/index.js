/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade banner">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <div>
        <div className="projectTitle title">
          NDD
        </div>
        <div className="projectTitle titlePrimary">
          Extreme
        </div>
        <div className="projectTitle titleSecondary">
          Programming
        </div>
        <div className="projectTitle titleDesc">          
        {siteConfig.tagline}
        </div>
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="buttonBanner" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo projectLogoCustom">
        <img src={props.img_src} className="banner-Logo" alt="Project Logo" />
      </div>
    );

    return (
      <SplashContainer>
        <div className="nav-banner">          
          <div className="row nav-banner__item">
            <PromoSection>
              <ProjectTitle siteConfig={siteConfig} />                         
            </PromoSection>
          </div>
        </div>
        <Logo img_src={`${baseUrl}img/pc-nxp.svg`} />
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          contents={props.children}
          layout={props.layout}
        />        
      </Container>
    );          

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content: 'Como forma de manter a gestão de conteúdo do Blog, foi criado um processo de Pull Request dentro do Projeto NXP. Isso permitirá a revisão do conteúdo antes da publicação, enriquecendo o processo de compartilhamento e evitando possíveis quebras de funcionamento do Blog. [Saiba mais](/docs/get-started)',
            image: `${baseUrl}img/pull-request-detail.png`,
            imageAlign: 'right',
            title: 'Como Contribuir no Blog',
          },
        ]}
      </Block>
    );

    const Initiatives = () => (
      <div className="productShowcaseSection paddingBottom lightBackground initiativesNdd">
      <h2 className="titleInitiatives">CONHEÇA OUTRAS INICIATIVAS</h2>
      <Block layout="fourColumn">
        {
          [
          {
            content: 'Um canal criado para compartilhar conteúdos de User Experience e disseminar a cultura de design dentro da NDD. <a href="http://ndx.nddigital.local/" target="_blank">Saiba mais</a>',
            image: `${baseUrl}img/logo-ndx.png`,
            imageAlign: 'top',
            title: 'NDD Design Experience',        
          },
          {
            content: 'Criado com o intuito de reunir e disponibilizar os conceitos e especificações visuais das interfaces nos produtos da NDD. <a href="http://nds.nddigital.local/" target="_blank">Saiba mais</a>',
            image: `${baseUrl}img/logo-ndg.png`,
            imageAlign: 'top',
            title: 'NDD Design System',
          },
          {
            content: 'Criado com o objetivo de garantir a padronização, comunicação e integração dos trabalhos desenvolvidos em diferentes times da NDD. <a href="http://ndk.nddigital.local/" target="_blank">Saiba mais</a>',
            image: `${baseUrl}img/logo-ndk.png`,
            imageAlign: 'top',
            title: 'NDD Development Kit',
          },
        ]}
      </Block>
      </div>
    );   

    const AutomatedTest = () => {
         
      return (
        <div className="productShowcaseSection paddingBottom">
          <h2 className="titleFeature">AUTOMAÇÃO DE TESTES</h2>
          <p>Teremos como base a definição de um perfil de investimento em testes automatizados, no qual considera-se o esforço ideal e viável para cada um dos tipos de testes, contribuindo para a cultura de testes na NDD.</p>          
          <div className="more-users">
            <img src="img/automated-test.png" />
          </div>
        </div>
      );
    };

    const Architecture = () => {
         
      return (
        <div className="productShowcaseSection paddingBottom lightBackground">
          <h2 className="titleFeature">PADRÕES DE ARQUITETURA</h2>
          <p>Este projeto busca a colaboração constante de ideias e boas práticas de arquitetura, que serão apresentadas e compartilhadas entre todos os times de engenharia da NDD.</p>          
          <div className="more-users">
            <img src="img/clean-arch.png" />
          </div>
        </div>
      );
    };

    const DevOps = () => {
         
      return (
        <div className="productShowcaseSection paddingBottom">
          <h2 className="titleFeature">PRÁTICAS DEVOPS</h2>
          <p>Incentivar e divulgar como as práticas de DevOps ajudam a aumentar a velocidade das inovações e a agilidade dos negócios dentro da NDD.</p>          
          <div className="more-users">
            <img src="img/devops.png" />
          </div>
        </div>
      );
    };    
    

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">          
          <AutomatedTest />
          <Architecture />
          <DevOps />
          <Initiatives />          
        </div>
      </div>
    );
  }
}

module.exports = Index;
