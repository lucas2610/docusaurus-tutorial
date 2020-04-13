---
title: Criando times end-to-end usando Micro front-ends & Microsserviços
author: Guilherme Toniello
authorURL: https://www.linkedin.com/in/guilherme-toniello/
authorFBID: 100001067144863
---

![contexto de construção de um website](https://i.ibb.co/8xT6YM6/undraw-Data-points-ubvs.png)

**Desenvolva produtos com times end-to-end usando microsserviços também na interação com o usuário**

Um dos termos que está na _hype_ do momento para a engenharia de software é o de "microsserviço". Nos últimos anos, percebemos através dos artigos e eventos de tecnologia que a comunidade expõe suas experiências positivas e negativas quanto a arquitetura de microsserviços, sendo ela então  vastamente aplicada na indústria de software. 

Entretanto, é perceptível que esse movimento estava fortemente voltado para as problemáticas do back-end, como processamento e armazenamento de dados. E quanto a interação com usuário?

Atualmente, o front-end se tornou um sistema em si com grandes desafios próprios, como participar da concretização de abordagens complexas como User Experience (UX) e suas preocupações. Dessa forma, podemos afirmar que os sistemas front-end podem ser complexos, com muitas regras de funcionamento e de negócio. Assim, podemos trazer para o front-end os benefícios da arquitetura de microsserviços.

<!--truncate-->

## Em primeiro lugar: o que são Microsserviços?

Um dos autores de maior renome no ramo de software, Martin Fowler, descreve arquitetura de microsserviços como:

> "Uma abordagem para desenvolver uma única aplicação como uma suite de pequenos serviços, onde cada um executa seu próprio processo e eles se comunicam usando mecanismos leves." (FOWLER, 2020. tradução livre).

Resumindo, é o famoso ditado: 

> "Dividir para conquistar"

Dessa maneira, quando temos um sistema de grande porte que envolve muitas unidades de negócio,  usar a ideia monolítica seria difícil de construir, manter e principalmente escalar. A ideia aqui é de que a separação em partes autônomas tornará as coisas mais simples.

A imagem abaixo mostra um comparativo entre monólitos (esquerda) e microsserviços (direita), exibindo suas bases de dados separadas bem como seus serviços.

<figure>
    <img src="https://martinfowler.com/articles/microservices/images/decentralised-data.png" class="img-blog" alt="microsserviços" />
    <figurecaption> 
        <p>
            <i>Arquitetura de microsserviços na visão de FOWLER (2020)</i>
        </p>
    </figurecaption>
</figure>

> Ao invés de construir e manter um enorme todo (esquerda), podemos construir e manter as pequenas partes que em funcionamento compõe um todo (direita).

Assim, falamos em dividir nosso inimigo, que é a alta complexidade do negócio. Como disse Elemar Jr:

> Complexidade é custo (SEVERO JÚNIOR, 2018)

E quanto a complexidade adicionada pelo uso da abordagem de microsserviços, ela é compensada através da simplificação da complexidade de negócio. Nesse ponto a discussão é longa. O que se tem de consenso é que cada caso deve ser avaliado. 

Para uma análise bastante aprofundada sugiro a leitura do [artigo do Martin Fowler sobre microsserviços](https://martinfowler.com/articles/microservices.html).

Entretanto, o que podemos focar aqui é que, em poucas palavras, a ideia por trás dos microsserviços é essa: dividir para conquistar.


## Abordagem de microsserviços no back-end

Diante dessa abordagem de microsserviços comentada acima, a comunidade recebeu bem esse novo padrão e implementou de diversas maneiras. 

O caminho de evolução das nossas aplicações:

1. Começamos com o monólito, em que o frontend e o back-end  estão todos em conjunto;

2. Após o aumento exponencial da complexidade da interação com o usuário, separamos o front-end e o back-end;

3. Finalmente, com a abordagem de microsserviços, decompomos nosso back-end em múltiplos serviços.

A figura abaixo representa esses 3 passos, da esquerda para a direita.

<figure>
    <img src="https://i.ibb.co/44pC7MZ/monolith-frontback-microservices.png" class="img-blog" alt="Abordagens ao longo do tempo" />
    <figurecaption> 
        <p>
            <i>Abordagens ao longo do tempo: do monólito ao microsserviço (GEERS, 2020)</i>
        </p>
    </figurecaption>
</figure>

> Perceba que estamos vendo do ponto de vista de tiers e não somente layers.

Dessa maneira, conseguimos no back-end os benefícios da estratégia `"dividir para conquistar"`: maior facilidade para construir, manter e principalmente escalar.

Entretanto, como a imagem acima demonstra, temos um problema: O front-end continua sendo um monólito.  Na prática, se analisarmos do ponto de vista de macro arquitetura, nossas aplicações ainda estão em um ponto amarradas de forma monolítica: o front-end.

Nesse ponto, se considerarmos o _workflow_ de trabalho,  o front-end vai conter, em partes, as regras de negócio necessárias para interação com o usuário. Dessa forma, um monólito não funciona com partes autônomas: para construir/manter a interação com o usuário, teremos que entender das regras de negócio de todos os microsserviços. Em contrapartida, no back-end, eles foram *justamente* separados em microsserviços pois sua complexidade em conjunto seria demasiadamente alta. 

> Com isso, percebemos que os velhos problemas podem voltar a assombrar: dificil de construir, manter e principalmente escalar.


## É possivel microsserviços no front-end?

Dessa maneira, a ideia exposta por Geers (2020), deixa claro que precisamos trazer para o front-end os conceitos de microsserviços, como exibe a imagem abaixo.

<figure>
    <img src="https://i.ibb.co/9qpXjrJ/verticals-headline.png" class="img-blog" alt="Modelo padrão de sistema sem usar o QBSA" />
    <figurecaption> 
        <p>
            <i>Transformando a arquitetura para suportar a organização vertical por GEERS (2020)</i>
        </p>
    </figurecaption>
</figure>

Com isso, teremos o que Geers (2020) afirma que é  *organização vertical*, em que é possível que os times mantenham um microsserviço de uma ponta a outra, ou seja, end-to-end - do front-end ao banco de dados.

Então, resolvemos o problema que foi apresentado anteriormente, que é o problema do ponto monolítico na macro arquitetura.

> Sendo assim, é factível implementar microsserviços no front-end

Para os microsserviços no front-end, foi dado um nome "especial", chamado de: micro front-ends. Mas elas continuam sendo considerados microsserviços assim como os demais no back-end.

## Como implementar micro front-ends?

Quanto a implementação, existem inúmeras formas de se implementar microsserviços no front-end.

> Lembre-se que ainda temos que entregar uma experiência única para o usuário

Jackson (2020), no portal do Fowler, sintetizou as principais abordagens usadas no momento:

* Server-side template composition
* Build-time integration
* Run-time integration via iframes
* Run-time integration via JavaScript
* Run-time integration via Web Components

Geers (2020), propôs algumas ideias de implementação de micro front-ends:

* Custom Elements
* Serverside Rendering / Universal Rendering
* Custom Elements + Server Side Includes

E existem tantas outras, como os workspaces da Angular CLI, o Project Mosaic, o Edge Server Includes, Redirects e etc.

*Mas qual escolher?*

Gosto da definição do Elemar Jr quanto à arquitetura:

> ARQUITETURA = COMPONENTES + SUAS RESPONSABILIDADES + SEUS RELACIONAMENTOS (SEVERO JUNIOR, 2017)

Logo, percebemos que envolve *estratégia*. Dessa maneira, a resposta é: depende do que iremos fazer.

Felizmente, o NDD Development Kit (NDK) desenvolvido pelo nddLabs trouxe um padrão de micro front-ends para a NDD, considerando as necessidades dos produtos.


## A NDD, o NDK e os Micro front-ends

Na NDD é de extrema importância que os produtos sigam um padrão de desenvolvimento. Isso evita retrabalhos entre os produtos, diminuindo nosso custo e aumentando nossa produtividade.

Com isso, o NDK trouxe um padrão de micro front-ends para os produtos da NDD que possuem essa necessidade.

O padrão de micro front-ends do NDK foi desenvolvido pensando nos 4 principais objetivos dos microsserviços no front-end para a NDD:

<figure>
    <img src="https://i.ibb.co/q700jYn/principios.png" class="img-blog" alt="Principios do ndk para micro front-ends" />
    <figurecaption> 
        <p>
            <i>Principios do ndk para micro front-ends. Próprio autor (2020)</i>
        </p>
    </figurecaption>
</figure>

Dessa maneira, no NDK, o nddLabs desenvolveu, testou e selecionou as abordagens de implementação de micro front-ends que melhor se encaixam com essas necessidades da NDD.

Como exemplo, podemos citar o [`Projeto Nigéria`](http://projeto-nigeria:8081/) e o [`Projeto Antares`](http://antares-vm-platform:8081/) que já estão sendo desenvolvidos usando a abordagem de micro front-ends.

Para melhor entendimento, vejamos uma pequena demonstração do projeto Nigéria, na figura abaixo.

<figure>
    <img src="https://i.ibb.co/Vmf6K5F/nigeria.png" class="img-blog" alt="Exemplo de arquitetura de microsserviços no contexto do Nigéria" />
    <figurecaption> 
        <p>
            <i>Exemplo de arquitetura de microsserviços no contexto do Nigéria. Adaptação de Geers (2020)</i>
        </p>
    </figurecaption>
</figure>

Perceba que, na imagem acima, estamos trazendo para o projeto Nigéria a arquitetura descrita por Jackson (2020), Fowler (2020) e também por Geers (2020).

Cada parte do sistema como: NFe, NFSe, Cte etc. tem seu próprio micro front-end. Dessa maneira, é possível que cada time fique responsável por uma parte do sistema, sendo ele realmente end-to-end.

Além disso, e o mais importante, é que as alterações em um micro front-end não influenciem o outro, por exemplo, ao alterar o `NFe` não impacta diretamente no micro front-end de `NFSe`. Isso torna as coisas mais fáceis de construir e manter, além da disponibilidade.

Foi realmente `"dividido para conquistar"`.


Em relação a interação com o ndk, podemos perceber que ele fornece além de componentes de interface (grid, input, etc.), componentes de estrutura que se integram na aplicação e dão suporte para o funcionamento de cada micro front-end.

A imagem abaixo representa de maneira simplificada o que ocorre no projeto Antares.


<figure>
    <img src="https://i.ibb.co/ZfW1pJv/ndk.png" class="img-blog" alt="Interação do NDK com o projeto Antares/iot" />
    <figurecaption> 
        <p>
            <i>Interação do NDK com o projeto Antares/iot. Próprio Autor (2020)</i>
        </p>
    </figurecaption>
</figure>


Com isso, os times são responsáveis por desenvolver a lógica de negócio, sendo a arquitetura de micro front-ends responsabilidade do ndk.


> Diante disso temos maior padronização, menor custo e maior produtividade. 

Os dois projetos, Antares e Nigéria, são de verticais de negócio diferentes mas implementam a mesma arquitetura de microsserviços no front-end por causa do ndk.


## Finalizando

O objetivo desse artigo foi apresentar uma introdução das motivações dos microsserviços no front-end, focando na arquitetura, bem como apresentar o padrão da NDD, implementado pelo NDK.

Nos próximos artigos podemos apresentar a forma com que o NDK faz esse trabalho para nós.

Até lá :)

## Referências

CAM, J. Micro front-ends. Portal Martin Fowler. Disponível em: <https://martinfowler.com/articles/micro-frontends.html>. Acesso em 02 de fevereiro de 2020.

FOWLER, M. LEWIS, J. Microservices. Portal Martin Fowler. Disponível em: <https://martinfowler.com/articles/microservices.html>. Acesso em 02 de fevereiro de 2020.

GEERS, M. Micro front-ends: extending the microservice idea to front-end development. Portal Micro front-ends. Disponível em: <https://micro-frontends.org/>. Acesso em 01 de fevereiro de 2020.

SEVERO, Elemar Jr. Complexidade é custo. Portal Elemar Jr. Disponível em <https://www.elemarjr.com/pt/2018/02/complexidade-e-custo/>. Acesso em 01 de fevereiro de 2020. Publicado em 2018.

SEVERO, Elemar Jr. Arquitetos Arquitetando Arquitetura. Portal Elemar Jr. Disponível em: <https://www.elemarjr.com/pt/2017/04/arquitetos-arquitetando-arquiteturas/> Acesso em 02 de fevereiro de 2020. Publicado em 2017.

---
O que você achou sobre *micro front-ends*? Conte pra gente nos comentários!  
Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).
