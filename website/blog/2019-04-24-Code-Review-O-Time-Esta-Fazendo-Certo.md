---
title: Code Review - O time está fazendo certo?
author: Ramon Wolff Zaccaron
authorURL: http://twitter.com/ramonwz
authorFBID: 100007841497920
---

![Code Review](/img/capa-code-review.jpg)

Quando se fala em qualidade de produto na área de desenvolvimento de software, com toda certeza, boa parte dessa qualidade refere-se a código. E por isso sua revisão deve ser uma prática constante para que se evite falhas sendo entregues ao cliente juntamente com o produto final. Mas como minimizar essas falhas? Como conscientizar o time a revisar códigos e realizar essa prática da forma certa? Ou, até que ponto essas revisões são efetivas?

<!--truncate-->

Hoje vamos discutir um pouco sobre Code Review, que sendo usado da forma correta, pode trazer inúmeros benefícios, não só para todos os membros do time, mas também para a qualidade do produto. E também gostaria de apresentar algumas abordagens e práticas que acredito ser um bom caminho para quem ainda tem dúvidas sobre como realizar Code Review. Vamos lá!

Seu time optou por realizar Code Review no dia a dia das inúmeras solicitações de merge de um código local com o do servidor. Perfeito! Mas todos estão dispostos a realizar algumas mudanças culturais necessárias para que esse processo ocorra de forma efetiva e traga os reais benefícios dessa prática? Primeira regra em mente para que isso dê certo: TODOS devem estarem comprometidos em fornecer condições para que um revisor tenha todas as informações necessárias para realizar a revisão e também devem estarem comprometidos em dispor de seu tempo para analisar cuidadosamente o trabalho de outro membro do time. Portanto, tenha certeza de que todos entenderam a missão que devem cumprir e estejam motivados e capacitados a realizar essa prática.

#### Tudo começa com um Pull Request

Pull Request nada mais é que a solicitação de merge entre as alterações que foram realizadas localmente em uma branch por um desenvolvedor, e o código que está armazenado em um servidor em uma branch original. Quando um Pull Request é criado significa que um desenvolvedor finalizou suas alterações de uma determinada funcionalidade, correção de um bug, alguma melhoria, etc, e deseja integrar esse código com a branch principal, onde essa nova alteração estará disponível ao restante do time. 

Com essa solicitação gerada, um artefato denominado Pull Request é criado eu seu servidor versionador de código, e a partir daí começa sua gestão até o merge final. Nesse momento, uma build automatizada pode rodar no novo código para execução de testes automatizados, pode ocorrer uma publicação de ambiente para testes manuais, verificação se o projeto está compilando e onde o Code Review é efetuado.

Codificar vai além de somente escrever código. Digo isso, pois ao criar um Pull Request o desenvolvedor deve realmente investir um tempo considerável na descrição da alteração realizada. E é aqui que muitos têm dificuldades. A descrição do Pull Request deve dar condições para o revisor conhecer a funcionalidade/correção implementada e assim economizar seu tempo de análise.

Um dos erros que muitos revisores cometem é iniciar a análise sem entender o que aquele código deveria fazer, impactos que irão desencadear no sistema ou até se atende a proposta solicitada na tarefa ou história. A descrição do Pull Request possui totais condições de dar essa visão e caso ainda não fique claro, a boa e velha conversa olho no olho é sempre bem-vinda. Sentar com o desenvolvedor que implementou o código que você está prestes a revisar é uma excelente prática para a revisão de código. Mas voltando a descrição do Pull Request, vejo como boa prática informar no mínimo as seguintes informações:
 - Contexto da implementação;
 - O que mudou?
 - Por que mudou? (Motivação)
 - Como foi implementado?
 - Como usar essa funcionalidade?

Isso tudo pode ser descritivo, mas existem outras formas de incrementar sua descrição como por exemplo a utilização de gifs, mostrando como utilizar uma funcionalidade ou configurá-la. Pode também ser utilizado imagens, para demonstrações de passo-a-passou ou até diagramas explicando como se comporta a funcionalidade, podendo ser este um diagrama de sequência ou atividade, por exemplo. Existe também a possibilidade de informar trechos de código identado para enriquecer sua explicação e com isso deixar pontos de atenção para quem for revisar. Enfim, existem diversas formas de realizar uma breve capacitação do seu revisor com sua descrição. Faça a melhor utilização que achar necessário, só não a deixe anêmica, com somente alguns bullets vagos ou o número da história/tarefa/bug fazendo com que o revisor tenha que realizar uma pesquisa antes da análise. O oposto também pode ser um problema, encher de informações desnecessárias e repetitivas só para ter uma descrição não é uma boa prática. Coloque apenas informações úteis que ajudarão o revisor na análise e até para manter um bom histórico daquela alteração. Abaixo segue a imagem de um exemplo de Pull Request:

![Exemplo Pull Request](/img/exemplo-pr.png)
*Exemplo de um Pull Request*

#### Agora sim, Code Review!

Code Review consiste em uma prática de revisão de código afim de encontrar possíveis bugs, falhas na segurança, ausência de boas práticas ou padrões definidos pelo time. Também é possível com esse método sugerir outras formas de implementar uma funcionalidade ou resolver um problema.

Essa prática é considerada um step a mais no processo interno de desenvolvimento de software. Basicamente ela consiste em algum desenvolvedor mais sênior ou qualquer membro do time que se sinta confortável em realizar uma revisão (vai depender de qual abordagem o time usa) analisar o código de um desenvolvedor antes de realizar o merge com a base de código principal. Podem haver quantos Code Reviews o time achar necessário por Pull Request.

Existem estudos que defendem que um revisor pode efetuar Code Reviews de no máximo 60 minutos, ou em média 400 linhas de código. Após isso, um intervalo seria necessário, pois sua capacidade de revisão pode diminuir, deixando escapar algum ponto importante do código em análise.

#### Problemas

Na tentativa de realizar essa prática, muitos times acabam caindo em alguns problemas e consequente não usufruindo dos benefícios do Code Review, gerando desmotivação e falta de engajamento do time. Na minha visão, os principais problemas seriam:

 - Code Review é muitas vezes negligenciado e feito de forma muito superficial;
 - Code Review é visto como uma etapa fora do processo de desenvolvimento;
 - Os Pull Requests muitas vezes não dão condições favoráveis ao revisor (Descrição);
 - Pull Requests são aprovados sem revisão por simplesmente confiar no desenvolvedor;
 - Um Pull Request tem que ser aprovados rapidamente para subir algum código que outro desenvolvedor precisa;
 - Um Pull Requests tem que ser aprovados rapidamente para iniciar os testes por alguma urgência;
 - Quantidade de arquivos excessivamente grande;
 - Falta de um processo formal de Code Review;

Veja que grande parte desses problemas podem ser resolvidos com uma mudança de cultura dentro do time. Mesmo em cenários caóticos de desenvolvimento, com prazos apertados as boas práticas devem ser respeitadas, mesmo que muitas vezes seja difícil. 

#### Benefícios

Os benefícios obtidos com essa prática valem a pena, e os deixamos de ter com os problemas acima citados ocorrendo, como por exemplo:

 - Compartilhamento de conhecimento entre os membros do time;
 - Compartilhamento de soluções alternativas para uma funcionalidade ou problema;
 - Desenvolvimento de espirito de time;
 - Amadurecimento dos membros do time, principalmente para os mais novos;
 - Aumento da qualidade de código e consequentemente do produto;
 - Possibilita a prevenção de problemas em ambiente de produção;

##### Feedbacks construtivos

Além dos benefícios citados, temos uma excelente ferramenta de feedback! Imagine como pode ser construtivo para qualquer membro do time ter um retorno/opinião de seu trabalho e principalmente desenvolvedores menos experientes, que estão chegando agora no time.

 - Quem revisa/comenta em um Pull Request deve focar também no aprendizado de quem receberá o feedback;
 - O principal foco de quem está recebendo o feedback deve ser a melhoria contínua;
 - Pode ocorrer uma discussão amigável e de comum acordo sobre o código em revisão;
 - Aproveite esse momento para ensinar! Ambos devem “gastar” um tempo para isso;
 - E lembre-se, quem está revisando também está aprendendo sobre práticas de desenvolvimento;

O time como um todo deve ter maturidade tanto para dar feedback, quanto para receber. Esse é um ponto de atenção a ser tomado. De forma alguma, comentários ofensivos devem ser feitos, bem como o recebedor desse feedback deve se ofender com um comentário sobre seu código. Ambos devem buscar a melhoria contínua. E como um time, se ajudar em busca dessa melhoria.

#### Mas Code Review leva tempo!

Claro que leva tempo, e as vezes não é pouco. Mas esse tempo não é sinônimo de desperdício. Se você pensar bem, na verdade esse tempo investido realizando revisão de código pode salvar algum tempo a longo prazo, como bugs em ambiente de produção, ou maior facilidade em uma futura refatoração.

Tenha em mente o seguinte: resolver um bug enquanto ainda está em fase de desenvolvimento é muito mais barato que resolvê-lo em produção, pelo custo de reprodução e análise necessária até encontrar uma solução. Portanto, além de tempo, economiza-se dinheiro. Isso tudo alinhado com outros fatores, é claro.

#### O que revisar?

É muito comum dentro do processo de Code Review o time ter um check list de itens a serem considerados ao revisar um código. Essa lista, como sugestão, pode ser elaborada em conjunto onde todos podem chegar em um consenso sobre o que revisar, aumentando assim o engajamento de todos nas revisões. Como base poderia ser considerado os seguintes tópicos:

 - A descrição do Pull Request está compreensível e auxiliando na revisão?
 - Legibilidade do código. É possível entende-lo?
 - Foi utilizada orientação a objetos da forma correta? SOLID, DRY, DDD e outros.
 - Nomes de variáveis, métodos e classes refletem o que representam?
 - Foram criados testes automatizados (unitários, funcionais, integração) e estão corretos?
 - Existem mais testes a serem feitos?
 - O código está fazendo o que foi proposto na funcionalidade?
 - O código contém complexidade desnecessária?
 - Utilizar ferramentas para ajudar nas revisões em busca de bad smells e outras más práticas. Sonnar ou CodeFactor por exemplo.

Dependendo do projeto, e até do time, podem surgir outros itens, acima cito apenas alguns exemplos. Você pode inclusive ter validações de segurança no seu check list.

#### Fluxo

Como já citado, um dos problemas pela não realização correta de Code Review é a falta de um fluxo formal do início ao fim do processo. Abaixo, apresento um exemplo de fluxo que tem seu início na criação da branch local, onde o desenvolvedor irá iniciar suas implementações após entendimento de uma história ou tarefa, até o merge dessa branch com seus commits na branch principal, ou seja, a branch de origem, já passando por toda a gestão do Pull Request criado.

![Fluxo code review](/img/fluxo-revisão-pull-requests.png)
*Exemplo de um fluxo de revisão de Pull Requests*

Como vocês podem ver nesse exemplo, as etapas mais comuns do desenvolvimento estão descritas com seus principais objetivos e podem, dependendo do modelo de trabalho, atender times de desenvolvimento que utilizam o versionador Git ou similar. A ideia é dar uma visão das atribuições de ambos os papéis tanto do criador do Pull Request, quanto do revisor do mesmo. Tomem atenção em dois pontos principais que são abordados nesse artigo, tanto a etapa de criação do Pull Request, onde é evidenciado um maior detalhamento em sua descrição, quanto a de revisão que pode ser explorado muitos aspectos do código e até a regra de negócio que atende. Esses são pontos principais de extrema importância para um bom funcionamento do Code Review.

#### Conclusão

A ideia desse artigo foi trazer uma abordagem de aplicação de Code Review em times que desejam iniciar com esse processo. Ou até em times que já fazem Code Review, trazer maneiras de incrementá-lo. Para isso, foi dado foco em dois aspectos importantes do fluxo de desenvolvimento que é a criação do Pull Request, com importância principalmente em sua descrição que deve dar condições para uma boa revisão de código, e também para servir como documentação do sistema, já vinculando com as alterações realizadas. Lembrando que a descrição do commit não substitui ou é substituído pela descrição do Pull Request, seus objetivos são diferentes. O outro aspecto dado foco foi na revisão em si do Pull Request que é onde aplica-se o Code Review, levantando problemas e benefícios importantes e determinantes para fazer esse processo dar certo, trazendo uma abordagem prática e formal de como realizar, dentre tantas que existem. Mas nada muito diferente disso.

E você? Realiza Code Review no seu time? Como é realizado? O que é analisado? Compartilhe suas experiências e práticas para discutirmos e fomentarmos ainda mais essa prática.

Até a próxima!

#### Referências
 - https://tavernaprogramacao.com.br/programacao/vantagens-do-code-review
 - https://dev.to/samjarman/giving-and-receiving-great-code-reviews
 - https://www.atlassian.com/agile/software-development/code-reviews
 - https://www.perforce.com/blog/qac/9-best-practices-code-reviews
 - https://smartbear.com/learn/code-review/what-is-code-review/
 - https://www.concrete.com.br/2018/01/05/o-que-devo-procurar-em-um-code-review/
 - https://leanpub.com/whattolookforinacodereview
 - https://docs.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops
