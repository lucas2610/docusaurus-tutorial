---
title: Integração Contínua
author: Hugo Estevam Longo
authorURL: http://twitter.com/hugoestevam
authorFBID: 100000388917811
---

![abc](https://i.ibb.co/DVNCfPD/undraw-version-control-9bpv.png)

**Melhore a agilidade da sua equipe com feedback mais rápido. Porque você só conseguirá se mover rápido, se os seus testes deixarem.**

<!--truncate-->

Por muitas vezes, quando o assunto é agilidade, trata-se com maior importância aspectos de gestão de times (cerimônias, papéis, sprints, etc.) e por conta disso práticas ágeis essenciais como a Integração Contínua (CI) são deixadas em segundo plano. Isso pode parecer ameaçador (especialmente se a equipe ainda não está usando CI), mas as notícias são boas. Independentemente das tecnologias que uma equipe usa, há muitas chances de haver uma integração contínua e uma estrutura de testes automatizados que funcionarão de acordo com a base de código.

## Integração contínua

Integração contínua é a prática de integrar, rotineiramente, alterações de código na *branch* principal de um repositório e testar as alterações, o mais cedo e frequente possível. Idealmente, os desenvolvedores integrarão seus códigos diariamente, se não várias vezes ao dia.

## Proteja a qualidade com compilações contínuas e automação de teste

Quantos de nós já baixou o código fonte mais recente, alterado por algum colega de time e percebeu que o código não compilava ou tinha um erro significativo? Isso destrói a produtividade!

Duas práticas podem nos manter longe dessa situação:

**Compilações contínuas:** compilar o projeto assim que uma alteração for feita. Idealmente, cada compilação deve ser um conjunto de alterações referentes a um único problema ou nova funcionalidade.

**Automação de teste:** validação programática do software para garantir a qualidade. Os testes podem iniciar ações no software a partir da UI (falaremos mais sobre isso em breve) ou de uma camada de serviços de back-end.

Pense nessas duas práticas como queijo e goiabada: são bons separadamente e melhor juntos! A integração contínua unifica compilações contínuas com automação de teste para garantir que cada compilação também avalie a qualidade da base de código.

E lembre-se: para aproveitar os benefícios, a equipe também deve ter disciplina para pausar o desenvolvimento e abordar os obstáculos imediatamente. A energia que a equipe investe (e não se engane: é um investimento) ao escrever testes e configurar a automação será em vão se as compilações forem deixadas para trás. Proteger o investimento em CI e a qualidade da base de código é a mesma coisa.

## Benefícios da integração contínua

Investir em CI resulta em feedback rápido sobre as alterações de código. Tão rápido quanto "em minutos". Martin Fowler escreveu em seu artigo [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) que o processo de build não deve exceder 10 minutos. Com isso, as equipes ágeis conseguem entregar softwares de qualidade rapidamente, sem precisar de esforços desnecessários. É a CI que torna isso possível.

> A simple example of this is a two stage deployment pipeline. The first stage would do the compilation and run tests that are more localized unit tests with the database  completely stubbed out. Such tests can run very fast, keeping within the ten minute guideline. However any bugs that involve larger scale interactions, particularly those involving the real database, won't be found. The second stage build runs a different suite of tests that do hit the real database and involve more end-to-end behavior. This suite might take a couple of hours to run. (Martin Fowler)

Uma equipe que se baseia principalmente em teste manual pode receber feedback em algumas horas, mas, na realidade, feedback de teste abrangente só chega em um dia–ou vários dias–depois de o código ser alterado. E, quando mais alterações forem feitas, a correção de erros vira uma verdadeira "expedição" com os desenvolvedores, analisando várias camadas de código para entender qual é a raiz do problema.

Isso, decididamente, não é rápido.

## Testes em CI: unidade, integração e testes funcionais
As execuções de CI têm duas fases principais. A etapa um garante a compilação do código. (Ou, no caso de linguagens interpretadas, simplesmente reúne todas as partes.) A etapa dois garante que o código funcione de acordo com o esperado. O modo mais seguro de fazer isso é com uma série de testes automatizados que validam todos os níveis do produto. 

### Testes de unidade
Um teste de unidade é aquele que testa uma única unidade do sistema. Ele a testa de maneira isolada, geralmente simulando as prováveis entradas e saídas de determinada função. Eles são a primeira linha de defesa na garantia da qualidade.

**Benefícios:** fácil de escrever, rápido de executar, modelo de acordo com a arquitetura da base de código.

**Desvantagens:** os testes de unidade validam apenas os componentes principais do software. Eles não refletem os fluxos de trabalho do usuário que, normalmente, envolvem vários componentes em execução ao mesmo tempo.

Como um teste de unidade explica como o código deve funcionar, os desenvolvedores podem revisar testes de unidade para se atualizarem em relação à área do código em questão.

### Testes de integração

Um software bom é modular, o que permite uma separação mais clara do trabalho em vários aplicativos. As Interfaces (código) são os pontos de extremidade nos quais diferentes módulos se comunicam uns com os outros, e os testes de integração fazem a validação deles com chamadas de um módulo para o outro.

**Benefícios:** geralmente fácil de escrever, rápido de executar e pode modelar rapidamente como os aplicativos farão a interação uns com os outros.

**Desvantagens:** em áreas simples do código, os testes de integração podem imitar alguns testes de unidade.

Como as Integrações são Interfaces (código) entre partes do aplicativo, elas são especialmente úteis ao preparar-se para uma liberação. Quando uma compilação candidata à liberação é aprovada em todos os testes de integração, a equipe consegue ser muito mais eficiente na entrega modular aos clientes. 

### Testes funcionais

Testes funcionais são feitos em grandes áreas da base de código e modelam os fluxos de trabalho do usuário. Nos aplicativos web, por exemplo, o Selenium interage diretamente com a interface do usuário para testar o produto.

**Benefícios:** maior probabilidade de encontrar erros, pois imitam as ações do usuário e testam a interoperabilidade de vários componentes.

**Desvantagens:** mais lento que os testes de unidade e, às vezes, reporta falsos negativos devido à latência da rede ou a uma interrupção momentânea em algum lugar da pilha de tecnologia.

As equipes, normalmente, percebem que, quando se aproximam do fluxo de trabalho real do usuário, a velocidade da execução dos testes automatizados diminui. Testes funcionais diretamente na API é mais rápido porque não é um navegador web completo. O Selenium somente pode ser executado na mesma velocidade que o navegador web, mas tem a vantagem de ser executado em vários navegadores web em paralelo. Apesar disso, os testes funcionais são muito valiosos e fornecem feedback muito mais rapidamente do que testadores humanos.

Falando nisso...

Alguns testadores veem os testes automatizados como uma ameaça existencial. Esse pensamento está longe da verdade. Ao não precisarem executar tarefas de teste repetitivas, os testadores podem passar o tempo trabalhando em testes exploratórios, no planejamento de teste e na criação de outras habilidades – como aprendendo a codificar!

## Torne sua integração contínua rápida

Executar testes automatizados pode, rapidamente, adicionar e prolongar a duração da compilação. Uma estratégia é colocar os testes automatizados em paralelo, ou colocar os testes mais pesados em outra fase do build, para que o servidor de CI execute os testes essenciais e libere a publicação enquanto os testes mais pesados são executados. Teste cada área do código completamente, mas não de modo redundante. Testes redundantes aumentam a duração da compilação (e desperdiçam CPU). Quanto mais rapidamente os engenheiros recebem a aprovação, mais rapidamente eles conseguem ir para o próximo item da lista de pendências.

## Pull Request e CI: uma incrível combinação!

Além de realizar compilações contínuas e automação de testes, precisamos ir além, estabelecendo um processo de Pull Request bem estruturado (podemos nos aprofundar mais em outro Post). Isso nos traz confiança de que determinada alteração está funcionado com a garantia de revisão de código, através do [Code Review - assunto já abordado no post anterior](http://nxp.nddigital.local/blog/2019/04/24/Code-Review-O-Time-Esta-Fazendo-Certo.html). Mais do que realizar o Build e executar os Testes, é importante que o processo de Pull Request disponibilize de maneira automatizada um ambiente isolado para testes. Esse "mix" de tarefas fornece ao time agilidade necessária para validar a qualidade o mais rápido possível, e é nesse momento que a compilação que passa por um processo de Pull Request, faz com que a equipe tenha confiança para fazer o *merge* do código na cadeia produtiva. 

<figure>
    <img src="https://i.ibb.co/x76C0YG/Pull-Request-Process.png"  width="660" class="img-blog" alt="Pull Request na NDD" />
    <figurecaption> 
        <p>
            <i>Exemplo de Processo usado em alguns produtos da NDD.</i>
        </p>
    </figurecaption>
</figure>

Muitas equipes evitam usar várias *branchs* porque os *merges* são difíceis. Com tecnologias mais recentes no controle de versão, como Git, a *branch* e o *merge* ficaram mais fáceis. Para garantir que a linha de código primária ("master" na linguagem Git) permaneça integra, execute o mesmo nível de integração contínua em todas as *branchs* de versão, seja estável ou desenvolvimento. Quanto menor e mais frequente for o ciclo de criação das *branchs*, menor será o impacto dos *merges* no dia-a-dia do desenvolvedor.

Com pull requests, a integração contínua e a automação de teste, as equipes podem ser produtivas e inovadoras enquanto ainda protegem a qualidade do código. 

---
Como você tem usando *Continuous Integration*? Conte pra gente!  
Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).