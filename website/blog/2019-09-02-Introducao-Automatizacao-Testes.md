---
title: Automatização de Testes de Software
author: Luiz Fernando Machado Spanhol
authorURL: https://www.linkedin.com/in/luizfernandospanhol/
authorImageURL: https://media.licdn.com/dms/image/C4E03AQHLiXRIkTjUrg/profile-displayphoto-shrink_200_200/0?e=1573084800&v=beta&t=Xw8ENOw1nsESp79dtlpkAnjxANzzpgfKPQndZkIegbY
---

![abc](https://blog.cedrotech.com/wp-content/uploads/2018/05/4.jpg)

<!--truncate-->

Me inspirei em escrever este post sobre automatização de testes depois de, recentemente, obter ganhos significativos com a implementação dos testes automatizados na Plataforma ndDox, projeto que visa centralizar as aplicações de Documentos eletrônicos (NF-e, NFC-e, NFS-e e CT-e).

A automatização de teste é algo que se ganha a longo prazo e não a curto prazo. Muitas vezes buscamos o resultado dos testes automatizados rapidamente, mas estes resultados só podem ser mensurados a longo prazo dado que a cada dia que passa observamos novos cenários de testes e também possíveis melhorias nos testes já implementados.
 
A cada nova feature implementada, dedicamos um tempo para desenvolver novos testes automatizados no sistema, garantindo a qualidade, confiança e segurança do produto.

Atualmente contamos com mais de 1700 testes automatizados no projeto, gerando segurança para as áreas envolvidas na NDD e para os clientes, pois a cada entrega ou funcionalidade implementada é rodada uma bateria de testes para verificar se o legado e as novas funcionalidades estão funcionais, por sua vez, diminuindo a inconsistência do software.

Pensemos, por que fazemos o trabalho braçal sendo que temos o computador que pode fazer isso para nós? Por que não ensinamos a ele como deve ser feito, no lugar de fazermos? Pois bem, pensando nisso, neste primeiro post, apresento uma visão dos testes automatizados e sua importância no desenvolvimento de software.

## Automatização de testes.

A automatização de testes tem por objetivo reduzir o envolvimento humano em atividades repetitivas, rotineiras, e chatas que é executado pelo time de qualidade, neste caso, devemos utilizar os recursos para automatizar o trabalho rotineiro e focar em novos cenários de testes, como por exemplo, testes exploratórios e principalmente olhar para testes que antes não eram vistos ou realizados no sistema. 

E por que não utilizamos está tecnologia desde a fabricação de uma nova funcionalidade ou um novo teste? Pois bem, muitas vezes estamos em uma rotina grande, e com prazos de entrega muito curtos, então escolhemos focar na entrega do produto com testes manuais. Mesmo sabendo da importância e dos benefícios que os testes automatizados podem nos trazer, optamos por deixá-los de lado com a desculpa de que não temos tempo e depois eles serão implementados. A automatização demanda de mais tempo e esforço pelo fato de que é necessário planejar o cenário que será aplicado no teste e depois o desenvolver, e neste caso, continuamos no comodismo e na rotina dos testes manuais, não nos dando tempo para fazer a automatização e por sua vez trabalharmos para o computador, e não ao contrário, que seria o cenário ideal.

Quando falamos em automatização de testes surgem muitas dúvidas, tais como:
- Por onde começar? 
- Será que devo automatizar tudo? 
- Preciso migrar todos os testes manuais para os testes automatizados? 

Acredito que outras perguntas surgirão, mas neste caso a primeira coisa que temos que ter em mente é que, quando vamos migrar os Testes Manuais para Testes Automatizados ou implantar a automatização, devemos analisar os cenários de testes e replanejar os Testes Manuais e assim verificar a viabilidade, complexidade e abrangência do teste, pois muitas vezes um Teste Manual não faz sentindo ser implementado como teste automatizado.

Repensar os testes e ver novos cenários é primordial quando estamos falando em automatização de testes, buscamos aperfeiçoar os processos, qualidade do software e acima de tudo satisfazer os nossos clientes.

>“Qualidade de software é algo que todos querem. Os gerentes sabem que precisam ter alta qualidade em seus trabalhos; desenvolvedores sabem que desejam produzir um produto de alta qualidade; os usuários, por sua vez, insistem que o seu trabalho através do software deve ser confiável e consistente” (MOLINARI (2003).

>“A qualidade é consequência dos processos, das pessoas e da tecnologia. A relação entre e qualidade do produto e cada um desses fatores é complexa. Por isso, é muito mais difícil controlar o grau de qualidade do produto do que controlar os requisitos” NOGUEIRA (2009).

## Reflexão

Como podemos garantir a qualidade do software em vários níveis, com prazos de entregas cada vezes mais curtos, movimentação de integrantes dos times e se não bastasse tudo isso e mais outros fatores não mencionados, garantir que o legado do sistema esteja funcionando corretamente, sem que antigos bugs sejam apresentados, ou que novos bugs surjam?

Pois bem, podemos neste caso utilizar e abusar da Automatização de Testes, direcionando cada tipo ou cenário de testes que elaboramos, sejam eles de performance, integração, banco de dados ou validação de bugs já identificados entre outros.

## Os Benefícios dos Testes Automatizados.

- Estabilidade do software gerando feedback do sistema mais rápido, podendo intervir em problemas e diminuindo o impacto no usuário final;
- O tempo é otimizado das tarefas com execução automatica, sobrando tempo para o time atuar em inovação e melhoria continua do software;
- Menor disperdicio na execução de tarefas repetitiva;
- Diminui o retrabalho;
- Time especialista em desenvolvimento, o time como um todo tem habilidade de desenvolvimento;
- Tempo para criar novo checklist e testar funcionalidades que antes não eram validas, garantindo assim, o funcionamento de um todo do sistema.

## Conclusão

A ideia do artigo foi trazer uma abordagem da aplicação de testes automatizados no desenvolvimento de software em times que desejam iniciar com esse processo. Ou até em times que já fazem testes automatizados, trazer maneiras de incrementá-los. Para isso, foi dado foco em explicar como que os testes funcionam e por que devemos insistir e principalmente incrementa-los no desenvolvimento como uma boa prática. 
Futuramente estarei escrevendo novos posts sobre automatização de testes, como por exemplo, quando devemos implantar um teste automatizado, infraestrutura necessária, entre outros assuntos ligados a testes automatizados.

>“Na pratica, não se pode testar um software por completo e garantir que ele ficará livre de bugs. É quase impossível testar todas as possibilidades de formas e alternativas de entrada de dados, bem como testar as diversas possibilidade e condições criadas pela lógica do programador”. (RIOS, MOREIRA, 2013, p.10).

Obrigado por sua leitura. Espero que tenham gostado (deixe seu 👍) e até aproxima.

---
Como você tem usando *Testes Automatizados em seu setor*? Conte pra gente!  
Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).