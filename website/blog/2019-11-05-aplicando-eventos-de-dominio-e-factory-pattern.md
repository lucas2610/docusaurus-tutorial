---
title: Aplicando Eventos de Domínio e Factory Pattern
author: Anna Laura de Lorenzi Carvalho
authorImageURL: https://i.imgur.com/NGlfYLw.jpg
---

![capa](https://i.ibb.co/xGs1w13/undraw-letter-2k4m.png)

**Você já ouviu falar que "o domínio deve ter suas regras" ou que "apenas o próprio objeto de domínio deve saber se modificar"? Eu, na faculdade, escutei bastante que "o domínio deveria se auto validar". Mas o que isso realmente quer dizer?**

<!--truncate-->

> Os códigos de exemplo foram desenvolvidos utilizando o framework [MediatR](https://github.com/jbogard/MediatR)

Quando começamos a trabalhar com arquitetura DDD, dividimos nossa solução em alguns projetinhos. Na maioria das vezes temos: domínio, repositório, aplicação e apresentação, e saímos felizes achando que aprendemos DDD.

Seguimos sempre uma receitinha de bolo (bem pobre, inclusive): 
- Regras de negócio devem ficar no domínio.
- Lógica de persistência de dados deve ficar na camada de infra.
- Na camada de aplicação fica todo o resto. 

E vamos repetindo essa receita incansavelmente, até que chega um ponto em que temos regras de negócio na camada de aplicação (muito comum de acontecer) e, nos casos mais descuidados, estamos fazendo um *select* no banco direto na nossa API.

Quando percebemos, o caos já se instalou em nossa aplicação e queremos iniciar um tratamento de choque para tratar os sintomas de um domínio anêmico. E agora, por onde começar?

> A **anemia** acomete camadas de domínio que não conhecem regras de negócio, apenas definem entidades de forma simplista. Dessa forma elas ficam magrinhas, desnutridas, não estão nem vivendo, apenas existindo. E não se engane achando que só customizando nossos *setters* estamos
suplementando ela. O que você está causando é um efeito placebo. O Martin Fowler fala sobre os domínios anêmicos no artigo *[Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)* (artigo em inglês) e também tem um artigo bem divertido do site *[bar8](https://bar8.com.br/abap-modelo-an%C3%AAmico-6fdb3978d11e)* que fala sobre esse modelo de desenvolvimento.

Nesse artigo quis dar foco em duas camadas principais e que geralmente causam mais dúvidas: Domínio e Aplicação.

## Camada de Domínio

Como já comentamos anteriormente, a camada de domínio deve ser responsável pelo domínio, saber as regras de negócio, modificar objetos e etc. 
Lembro que quando eu estava tentando refatorar meu código para ficar mais bonito e não tão procedural, eu me deparei com a seguinte regra de negócio:
"não deve haver um estoque com mesmo nome de outro estoque" e obviamente como é uma regra de negócio deve ficar na camada de domínio. 
Mas como fazer isso se no meu projeto de domínio eu tenho só entidades? Como eu vou utilizar um repositório na camada de domínio se teoricamente essa camada não deveria depender de nenhuma outra?

É, eu subestimava essa camada *rsrs*. Não a tratava como a princesa que ela é. Basicamente ela se resumia em um pacotão de entidades burras.

Mas, tinha um detalhezinho que eu aprendi na faculdade e não entendia o motivo. Geralmente no nosso projeto de domínio nós temos os *IRepository*, e aprender a utilizar essa interface na minha camada de domínio fez o jogo virar. Eu não usaria um repositório no domínio, eu usaria uma **interface** do repositório,
ou seja, não tenho dependência com outras camadas. Dessa forma eu consigo tranquilamente verificar se tenho algum outro estoque com determinado nome e aplicar a minha regra de negócio.

## Camada de Aplicação

E o que sobrou para a camada de aplicação? A camada de aplicação deve ser o maestro da orquestra. Ela vai conduzir as demais partes da aplicação para que se chegue ao resultado esperado. De uma forma bem leiga, a camada de aplicação deve fazer algo desse tipo:
- "Domínio, crie um estoque".
- "Repositório, persista no banco de dados".
- "Deu tudo certo na persistência? Serviço de auditoria, faça seu trabalho"

Caso você queira se aprofundar melhor no assunto, o artigo [Camada de Aplicação, Domain Driven Design e Isolamento do Domínio](https://medium.com/saga-do-programador/camada-de-aplica%C3%A7%C3%A3o-domain-driven-design-e-isolamento-do-dom%C3%ADnio-55348fbf1a26) explora bem as resposabilidades da Camada de Aplicação.

## Utilizando o *Factory Pattern* para encapsular nossas regras de negócio

O primeiro princípio do padrão [SOLID](https://medium.com/@carloszan/entendendo-solid-com-exemplos-em-c-98a983d47f) diz que devemos construir classes com apenas um objetivo, ou seja, se numa mesma classe você está criando e persistindo um objeto, _algo de errado não está certo._
Para ilustrar, vamos falar sobre a ação de Criação de Organização que temos no projeto Antares. Se você olhar o código verá que essa classe realiza algumas ações:

``` csharp
namespace NDDCore.Application.Features.v1.Organizations.Handlers
{
    public class OrganizationCreateHandler : IRequestHandler<Command, Result<Exception, Guid>>
    {
        public async Task<Result<Exception, Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Transforma o command em objeto de domínio
            var organization = Mapper.Map<Command, Organization>(request);

            //Seta a data de criação da organização
            organization.SetCreationDate();

            var isUniqueCallback = await _organizationRepository.IsUniqueAsync(organization.Name);

            if (isUniqueCallback.IsFailure)
                return isUniqueCallback.Failure;
            // Verifica se é único, ou seja, se já existe alguma organização com mesmo nome
            if (!isUniqueCallback.Success)
                return new AlreadyExistsException();
            
            // Solicita a persistencia do objeto
            var addOrganizationCallback = await _organizationRepository.AddAsync(organization);

            if (addOrganizationCallback.IsFailure)
                return addOrganizationCallback.Failure;

            var newOrganization = addOrganizationCallback.Success;
            
            // Solicita a criação de um site padrão
            var siteCallback = await _siteDomainService.CreateDefaultSite(newOrganization);

            if (siteCallback.IsFailure)
                return siteCallback.Failure;

            return newOrganization.Id;
        }
    }
}
```

É possível identificar as seguintes responsabilidades:
- Transformação de objetos;
- Regras de criação de uma organização (objeto único e data de criação);
- Orquestração de ações;
- Dispara a criação de um site (outro objeto);

Como já comentamos, a camada de Aplicação serve para orquestração, ou seja, ela não executa regras de negócio e nem tem conhecimento sobre elas, ela apenas coordena tarefas.
Com base nisso tudo que já falamos até agora, podemos concordar que o nosso Handler de criação de organização está sobrecarregado.

Ok, mas como resolver isso?

Basicamente, precisamos passar qualquer regra de negócio para a camada que compete essa responsabilidade, ou seja, camada de Domínio. Por isso foi criado o *OrganizationFactory*. Se traduzir ao pé da letra teremos uma "Fábrica de Organização", e é justamente esse o objetivo o OrganizationFactory, ele sabe as regras e processos para criar uma organização, logo as lógicas *Seta a data de criação do objeto* e *Verifica se esse objeto é único* foram movidas para essa classe.
Se você pesquisar na internet, vai encontrar um padrão chamado  _**Factory Pattern**_.

Dá uma olhada em como ficou a implementação da **OrganizationFactory**:
``` csharp
namespace NDDCore.Domain.Features.Organizations
{
    public class OrganizationFactory : IOrganizationFactory
    {
        public async Task<Result<Exception, Organization>> Create<TCommand>(Func<TCommand, Organization> mapFunc, TCommand command)
        {
            // Transforma o command em uma entidade do domínio
            var organization = mapFunc(command);

            var isUniqueCallback = await _organizationRepository.IsUniqueAsync(organization.Name);

            if (isUniqueCallback.IsFailure)
                return isUniqueCallback.Failure;

            var isUnique = isUniqueCallback.Success;
            // Verifica se é único
            if (!isUnique)
            {
                _logger.LogError("It was not possible to create organization with name {organization.Name}, because already exists an organization with the same name.", organization.Name);
                return new AlreadyExistsException();
            }

            // Seta a data de criação
            organization.SetCreationDate();

            // Registra um evento de domínio informando que uma organização foi criada
            organization.Raise(new OrganizationCreatedDomainEvent(organization));

            return organization;
        }
    }
}
```

Beleza, encapsulamos as regras de criação da organização, mas a criação do Site Padrão ainda está sendo disparado pelo método de criação da Organização.

Conforme o DDD, a implementação não está definitivamente incorreta, pois as regras de criação do Site Padrão estão encapsuladas dentro do SiteDomainService. Porém, nada é tão bom que não possa melhorar :) A criação do site faz parte da criação de uma organização, ou pode ser considerado um efeito colateral...? Eu não tenho resposta para essa pergunta, pois é uma questão de ponto de vista. E, como tudo em nossa área, só posso te dizer que **depende**.

No meio do que é certo e errado, encontrei um [artigo do Jimmy Bogard](https://lostechies.com/jimmybogard/2014/05/13/a-better-domain-events-pattern/) onde ele defende a ideia de isolar totalmente ações e efeitos colaterais através de Eventos de Domínio. Além disso ele sugere um padrão de registro e disparo de eventos de domínio em momentos distintos. Explicando brevemente: um evento de domínio deve ser registrado pelo Domínio (dessa forma, as próprias entidades devem conter seus eventos), já o disparo deve ocorrer apenas depois da entidade persistida ou ação efetivada, por isso pode ficar em outras camadas. 

### Notas sobre o Factory Pattern
*Factory* é considerado um *design pattern* bastante defendido pelo primeiro princípio do [SOLID](https://medium.com/@carloszan/entendendo-solid-com-exemplos-em-c-98a983d47f). Em suma, o objetivo é que uma entidade deve ser criada em um local centralizado e controlado. Em outras palavras, as regras de criação de uma entidade devem estar encapsuladas em algum lugar, e esse lugar é a *Factory*. Porém, devemos cuidar em quando usar ou não, e para tal indico a leitura do artigo *[When To Factory](https://sergeyzhuk.me/2017/05/22/when-to-factory/)*.
Nesse projeto não podemos dizer que estamos utilizando o padrão factory ao pé da letra, os exemplos trazidos na internet falam bastante sobre polimorfismo. A implementação foi baseada na **teoria** do padrão Factory.

## Aplicando Eventos de Domínio

Considerando que a criação de um Site Padrão é um efeito colateral da criação de uma organização, o código final do Handler ficou assim:

``` csharp
namespace NDDCore.Application.Features.v1.Organizations.Handlers 
{
    public class OrganizationCreateHandler : IRequestHandler<Command, Result<Exception, Guid>>
    {
        public async Task<Result<Exception, Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Pede à Factory para criar uma nova organização
            var result = await _organizationFactory.Create(Mapper.Map<Command, Organization>, request);

            if (result.IsFailure)
                return result.Failure;

            var organization = result.Success;

            // Solicita a persistencia da nova organização
            var addOrganizationCallback = await _organizationRepository.AddAsync(organization);

            if (addOrganizationCallback.IsFailure)
                return addOrganizationCallback.Failure;

            organization = addOrganizationCallback.Success;
            
            // Como a ação foi efetivada, agora podemos disparar de fato os eventos de domínio registrados a criação da organização pela factory 
            await _mediator.PublishDomainEvents(organization.RaisedEvents());

            return organization.Id;
        }
    }
}
```

Perceba que não temos mais nada sobre o Site Padrão, porém essa ação deve ocorrer quando uma Organização é criada, por isso foi implementado um Handler para o evento *OrganizationCreatedDomainEvent*.

``` csharp
namespace NDDCore.Application.Features.v1.Sites.NotificationHandlers 
{
    public class CreateDefaultSiteWhenOrganizationIsCreatedHandler : INotificationHandler<DomainEventAdapter<OrganizationCreatedDomainEvent>>
    {
        public async Task Handle(DomainEventAdapter<OrganizationCreatedDomainEvent> notification, CancellationToken cancellationToken)
        {
            var command = new DefaultSiteCreate.Command
            {
                OrganizationId = notification.DomainEvent.Organization.Id,
                Address = notification.DomainEvent.Organization.Address.Clone()
            };

            // Solicita a criação de um Site Padrão
            var siteCb = await _siteFactory.CreateDefault(Mapper.Map<DefaultSiteCreate.Command, Site>, command);

            if (siteCb.IsFailure)
            {
                _logger.LogError(siteCb.Failure, "An error occurred when creating Default Site to organization with id {organization.id}", command.OrganizationId);
                return;
            }

            var site = siteCb.Success;
            
            // Solicita a persistencia do Site
            var addSiteCb = await _siteRepository.AddAsync(site);

            if(addSiteCb.IsFailure)
                _logger.LogError(siteCb.Failure, "An error occurred when persist Default Site to organization with id {organization.id}", command.OrganizationId);
        }
    }
}
```

Nosso *CreateDefaultSiteWhenOrganizationIsCreatedHandler* também precisa fazer a criação de um objeto do tipo Site, e por isso ele consome o *SiteFactory*. Diferentemente do *OrganizationFactory*, o *SiteFactory* tem um método chamado *CreateDefault*. Isso ocorre porque o *SiteFactory* sabe criar um Site Padrão e um Site não Padrão, então na implementação da Factory de Site nós temos dois métodos que criam variações do mesmo objeto.

Utilizando eventos de domínio, se algum dia for necessário implementar outro efeito colateral da ação de criação de organização (exemplo: registrar auditoria), não vai ser necessário mexer no cerne da ação, apenas implementar um novo handler do evento *OrganizationCreatedDomainEvent*, ou seja, menos chance de surgirem bugs acidentais em funções já testadas.

## Finalizando nossa conversa...
Espero ter conseguido passar para vocês o que eu pretendia. Ressalto que, a implementação apresentada aqui é a forma que encontramos de melhorar nosso modelo de desenvolvimento. Existem centenas de outras abordagens por aí. 
Vamos trocar experiências! O que acha de nos contar como você trata sua camada de domínio? 😄
