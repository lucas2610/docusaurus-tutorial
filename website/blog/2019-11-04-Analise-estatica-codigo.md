---
title: Análise estática de Código com SonarQube
author: Ismael dos Santos
---


![abc](https://i.ibb.co/wL2FX32/capa.png)

## Motivação
Inspeções rotineiras e simples além de maçantes acabam tirando o tempo do desenvolvedor, delegar este tipo de trabalho rotineiro a uma ferramenta, que faz as verificações básicas, auxilia na conservação de um código saudável e mantém o foco do desenvolvedor para pontos mais importantes. 
Atualmente, temos disponíveis várias práticas e ferramentas para melhorar a qualidade dos nossos códigos e consequentemente do produto final.
<!--truncate-->
Análise Estática de Código é uma dessas práticas que auxiliam na criação de um código fonte mais padronizado, fácil de manter e com menos bugs. Basicamente o que uma ferramenta de análise de estática de código faz é analisar o código fonte em busca de inconsistências. 
Essas inconsistências são classificadas em três tipos: 

**Estilo**: Verifica se o código está em um estilo pré-definido, leva em conta itens como indentação, comentários, números mágicos, quantidade de parâmetros. o objetivo é tornar o código mais legível e organizado. 

**Boas práticas**: Verifica se boas práticas estão sendo utilizadas, como variáveis não usadas ou desnecessários, complexidade de métodos e classes. Objetivo é fazer inspeção continua para ter um código saudável. 

**Bugs**: Verifica se o código tem alguma inconsistência que possa causar um potencial bug, situações como acesso a variáveis nulas, laços de repetição infinitos podem ser detectados com uma ferramenta de análise estática de código. 

##  SonarQube

O objetivo deste artigo é apresentar os conceitos de Análise estática de código na prática, para isso será utilizado a ferramenta SonarQube, alguns times da ndd já estão utilizando esta ferramenta. 
Principais características para escolha desta ferramenta foram variedade de linguagens que podem ser analisadas, facilidade de instalação e facilidade de integração no build do TFS como será demonstrado no decorrer do artigo. 

## Colocando SonarQube no CI do TFS
Colocar o SonarQube como um dos passos do build no TFS é bastante simples, basta inserir um token gerado a partir do servidor do SonarQube e criar um endpoint do tipo SonarQube no TFS, este processo precisa ser feito apenas uma vez. Na documentação do SonarQube existe um tutorial de como [gerar o token](https://docs.sonarqube.org/latest/user-guide/user-token/). 
No TFS para criar um endpoint o caminho é settings do projeto, services, endpoints, conforme imagem abaixo:

![endpoint-tfs.png](https://i.ibb.co/7G4vxXG/endpoint-tfs.png)


### Tasks de build

Após a configuração do endpoint já é possível adicionar a análise do SonarQube no processo de build, são necessárias as Tasks de Build: 

**Prepare Analysis Configuration**: deve ser colocada antes do build da solução, conforme a imagem acima.  
**Run Code Analysis**: deve ser colocada após o build da solução para que resultados de testes, análise de cobertura sejam coletados e também caso o build da solução falhe o SonarQube nem tente fazer uma análise em cima de um código que não esta compilando.  
**Publish Quality Gate Result**: opcionalmente pode se colocar uma task para publicar no SonarQube se o build passou no padrão de qualidade definido para o projeto. 

exemplo na imagem abaixo: 

![enter image description here](https://i.ibb.co/HgtJkWp/build-config.png)

Assim que o build é concluído com sucesso já é possível visualizar os dados da análise, acessando a página do SonarQube e encontrando o registro do projeto analisado: 

![sonar-projects.png](https://i.ibb.co/G9FY9TH/sonar-projects.png) 

## Métricas 
O SonarQube apresenta um dashboard com as principais métricas do projeto e também já atribui alguns conceitos de qualidade para vários aspectos, como Bugs, Vulnerabilidades, Code Smells, Cobertura de código, duplicação de código; tendência se uma determina métrica está aumentando ou diminuindo. 

![sonardashboard.png](https://i.ibb.co/b7gLZPp/sonardashboard.png)

## Análises 

### Issues
São pontos que a análise encontrou que requerem atenção, são classificados de acordo com seu grau de severidade, da mais leve para mais crítica: Info, Minor, Major, Critical e Blocker. 
Como boa prática recomenda-se não liberar nenhum produto com issues de Blocker e Critical, no entanto, as demais também devem ser analisada. 

## Alguns exemplos
*(alguns forçados, outros extraídos dos projetos que já estão sob análise)*

Situações classificadas como blocker: 
- Identificando situações mandatórias de algum componente

![blocker-webclient.png](https://i.ibb.co/6XBhXdt/blocker-webclient.png)

- Identificando senhas fixas no código

![blocker-Password.png](https://i.ibb.co/wQTg1n2/blocker-Password.png)

Situações classificadas como Critical:

- Prevenindo um acesso a variáveis nulas

![sonar-erro-acesso-null.png](https://i.ibb.co/b5km8yB/sonar-erro-acesso-null.png)

- Alertando para um método muito complexo. Este valor é atribuído através da complexidade cognitiva, que é uma evolução da complexidade ciclomática, o objetivo é manter o método fácil de entender e fácil de testar. 

![complexidade.png](https://i.ibb.co/RhhJDRL/Complexidade.png)

- Dicas de boas práticas

![good-practice.png](https://i.ibb.co/ZWZCyR8/good-practice.png)

![good-practice2.png](https://i.ibb.co/J2fFTng/good-practice2.png)

# Considerações

Análise estática de código não deve substituir práticas como code review e programação pareada, na verdade ela deve ser usada para fortalecer essas práticas, pois possibilita padronizações e códigos fáceis de manter.

Quando começamos a utilizar a ferramenta do SonarQube, aplicamos a análise em códigos legados, identificamos bugs que ainda não tinham acontecido, mas que iriam acontecer em algum momento, assim nos possibilitou uma correção proativa.
As métricas que o SonarQube fornece vem bem de encontro a gestão de desempenho, para que o time possa trabalhar com metas quantitativas de qualidade. 

Existem vários aspectos a serem explorados em uma ferramenta de análise de código como o SonarQube, seria interessante colocarmos nossos projetos para serem analisados e fazer uma avaliação dos pontos que são importantes para serem melhorados.  
Vamos estar trabalhando junto com o setor de P&Di para termos um servidor centralizado para toda empresa, para quem já quiser experimentar tem um servidor no endereço [http://lgs1-srv-bld06:9000](http://lgs1-srv-bld06:9000). 

Qualquer dúvida estou à disposição. 


# Referências

[https://docs.sonarqube.org/latest](https://docs.sonarqube.org/latest)

[https://www.sonarsource.com/resources/white-papers/cognitive-complexity.html](https://www.sonarsource.com/resources/white-papers/cognitive-complexity.html)

[https://www.infobip.com/pt/desenvolvedor/melhorando-a-qualidade-do-codigo-com-sonarqube](https://www.infobip.com/pt/desenvolvedor/melhorando-a-qualidade-do-codigo-com-sonarqube)

[https://medium.com/@jeanmorais/adicionando-code-analysis-ao-seu-pipeline-com-sonarqube-e-gitlab-ci-1dab39aa3f75](https://medium.com/@jeanmorais/adicionando-code-analysis-ao-seu-pipeline-com-sonarqube-e-gitlab-ci-1dab39aa3f75)

[https://www.youtube.com/watch?v=e_A8NyNMjIM](https://www.youtube.com/watch?v=e_A8NyNMjIM)


