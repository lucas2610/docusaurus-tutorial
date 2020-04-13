---
title: Introdução à Pirâmide de Testes
author: Luiz Fernando Machado Spanhol
authorURL: https://www.linkedin.com/in/luizfernandospanhol/
authorImageURL: https://i.imgur.com/iaHDXsi.jpg
---

![abc](https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMyIrfxeRdOIC_dSAuuPbhkATQM8coUM_rlCECjRN3g4pLO_oT)



No artigo anterior foi escrito sobre a <a href="http://nxp.nddigital.local/blog/2019/09/02/Introducao-Automatizacao-Testes.html" target="_blank">automatização de testes</a>, e seus benefícios na plataforma Vega, caso não tenha lido e gostaria de ler sobre, passa lá e confere o artigo.

Agora, quero abordar outro tema: “Pirâmide de Testes”. Vou explicar um pouco sobre a sua importância para a automatização de testes e para não deixar o artigo muito extenso e cansativo, vou quebrar este tema em vários artigos até conclusão do tema.

<!--truncate-->

## O que é a "Pirâmide de Testes"?

A Pirâmide de Testes é utilizada para gerar um norte para a automatização dos testes, ou seja, através dela podemos definir os níveis de testes que devemos atuar, bem como, qual a carga necessária de teste para cada nível.

Antes da ascensão das metodologias ágeis como Scrum, sabíamos a importância da automatização dos testes e seu retorno para os times, porém os mesmos eram considerados caros e inviáveis em determinadas circunstâncias. Um dos motivos pelos quais as equipes acham inviável automatizar os testes mais cedo é por que se tem um olhar errado, tentando assim implementar os testes no nível errado da pirâmide de teste.

Uma estratégia eficaz para a automatização de testes exige a automação de testes em três níveis diferentes, são eles:

- Testes de Unidade;
- Testes de Serviço/Integração;
- Testes de Interface do Usuário.

<figure>
    <img src="https://i.ibb.co/kqFKHSx/Piramide-Testes.png" class="img-blog" alt="Modelo padrão de sistema sem usar o QBSA" />
    <figurecaption> 
        <p>
            <i>Estrutura da pirâmide de teste.</i>
        </p>
    </figurecaption>
</figure>
 

## Os níveis da Pirâmide de Testes

Na base da pirâmide de teste está o teste de unidade. O teste de unidade deve representar a maior parte dos testes implementados e, como tal, representar a maior parte da pirâmide.

Neste caso o teste de unidade auxilia o desenvolvedor a localizar os bugs mais rapidamente, gerando assim dados específicos para a sua correção.

É muito melhor ter o teste de unidade do que o testador informar que “existe um erro para buscar um registro do banco de dados”, o que representarias mais de 1000 linhas talvez de código para ser analisado para identificar a inconsistência do sistema.

Por um breve instante vamos pular o meio da pirâmide e vamos para o seu topo. Os testes de interface de usuário são colocados no topo da pirâmide de automação de testes pois queremos que seja realizado o mínimo possível de testes. Isso se dá pelos seguintes motivos:

- **São testes frágeis**: Qualquer pequena alteração na interface do usuário pode quebrar os testes criados ou interromper a criação de novos testes. No decorrer do tempo isso acaba sendo corriqueiro e por suas vezes as equipes param de gerar manutenção nestes testes;
- **São caros para escrever**: Escrever um bom teste de interface requer tempo e análise, para se tornar útil e válido. Gravar um teste de interface pode ser uma boa saída, porém é um dos tipos de testes mais frágeis que se pode criar;
- **São demorados**: Um teste de interface de usuário, além de ser complexo de configurar, é demorado para executar.

Vamos agora abordar os testes de serviço da pirâmide de automação de testes. Não me refiro um serviço propriamente dito, me refiro à camada de serviço do sistema, pois todo sistema possui um serviço que é rodado internamente.

Irei exemplificar aqui o teste de serviço de envio de e-mail. Pois bem, imagine que precisamos testar o envio de um e-mail pelo software. Neste caso, passo a informação esperada pelo serviço de envio de e-mail: servidor, corpo do e-mail, assunto e o destinatário. O serviço programado realiza o processamento e disparo do e-mail e o teste valida a recepção do e-mail no seu destino.

Ao invés de fazer isso por interface de usuário, testamos este processo pelo serviço que dispara e recebe o e-mail, assim, o teste não se torna frágil, mas sim válido e com poucas chances de quebrar, pois é o comportamento natural da aplicação.

Mike Cohn apresentou o conceito da pirâmide de teste no livro *“Succeeding with Agile”*, onde é ilustrado diferentes camadas de testes e o quanto devemos testar em cada camada de teste. 

Devido à sua simplicidade, a essência da pirâmide de teste serve como uma boa regra prática quando se trata de estabelecer sua própria suíte de testes. Vale aqui lembrar dois pontos da pirâmide de testes original de Mike Cohn:

- Escrever testes com granularidade diferentes;
- Quanto mais alto nível você obtiver, menos testes você deve ter.

<figure>
    <img src="https://i.ibb.co/fGWxr2G/Piramide-Teste-2.png" class="img-blog" alt="Modelo padrão de sistema sem usar o QBSA" />
    <figurecaption> 
        <p>
            <i>Estrutura da pirâmide de teste.</i>
        </p>
    </figurecaption>
</figure>

Mantenha-se atento à pirâmide de testes para escrever testes saudáveis, rápidos e de fácil manutenção:

- Escrever vários testes de unidade pequenos e rápidos;
- Poucos testes de alto nível;
- Cuidado com a suíte de testes para que ela não se torne pesada e que levará muito tempo para ser executada.

E cuidado para não acabar como uma casquinha de sorvete na pirâmide de automação de testes, que neste caso vai se tornar um pesadelo para manter os testes e levará um tempo considerável para a sua execução.

<figure>
    <img src="https://i.ibb.co/HP16tgy/Piramide-Teste-3.png" class="img-blog" alt="Modelo padrão de sistema sem usar o QBSA" />
    <figurecaption> 
        <p>
            <i>Pirâmide de testes vs Automação cone de sorvete.</i>
        </p>
    </figurecaption>
</figure>

E para finalizar, devemos cuidar para fazer o maior número de testes automatizados no nível de teste unidade, pois somente assim os testes terão um retorno maior ao projeto. Além de serem mais fortes, o código implementado será validado e o retrabalho será menor nos demais níveis para a implantação da automatização de testes. Como o próprio Mike Cohn descreveu no livro, cada teste deve ser feito em seu respectivo nível para que não vire uma casquinha de sorvete e se torne frágil e trabalhoso a implementação da automatização.

## Conclusão

Neste primeiro artigo foi abordado uma visão sobre a automatização de testes utilizando o conceito da pirâmide de Mike Cohn, o qual mostra uma visão de como a pirâmide de teste pode instruir os times de desenvolvimento e QA a implementar os testes automatizados de forma correta ou para que se tenha um maior valor nos testes realizados.

E como estamos com os testes na plataforma Vega? Estamos seguindo a ideia do Mike Cohn: estamos implantando uma grande quantidade de testes de unidade voltada para o nosso código. Além de termos cobertura significativa do sistema, temos uma execução de testes rápida e garantindo assim o funcionamento do que já foi implementado.

Além dos testes de unidade, temos testes automatizados para serviços (testes de host e integração) e interface de usuário (testes de cenário), assim, adquirindo valor nos testes implementados dentro da plataforma Vega da NDD.

Nos próximos artigos irei detalhar cada etapa da pirâmide de automatização de testes, apresentando exemplos, e como devemos implementar os testes em cada nível de maneira que tenhamos retornos significativos e que garanta a qualidade do produto.
 
Obrigado por sua leitura. Espero que tenham gostado (deixe seu 👍) e até aproxima.

---
Como você tem usado *A pirâmide de teste em seu setor*? E já conhecia o fundamento desta boa prática? Conte pra gente!  
Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).

## Referências

COHN, M. Succeeding with Agile: Software Development Using Scrum. ed. Addison-Wesley, 2010.
http://www.tecnisys.com.br/noticias/2019/a-piramide-de-automacao-de-testes
https://martinfowler.com/articles/practical-test-pyramid.html#TheTestPyramid