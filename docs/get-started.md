---
id: get-started
title: Get Started
sidebar_label: Adicionando um Post no Blog
---

## Adicionando um Post no Blog

Para criar um post no Blog, crie um arquivo dentro da pasta `website/blog` do [Repositório do NXP](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/_git/NXP?path=%2Fwebsite%2Fblog&version=GBmaster), com o nome do arquivo formatado como `YYYY-MM-DD-My-Blog-Post-Title.md`. A data do post é extraida do nome do arquivo.

Por exemplo, `website/blog/2019-03-01-Introducing-Blog.md`:

```yaml
---
author: Hugo Estevam Longo
authorURL: https://twitter.com/hugoestevam
authorFBID: 100000388917811
title: Introducing Blog
---

Lorem Ipsum...
```

Este blog funciona no formato [Markdown](https://pt.wikipedia.org/wiki/Markdown), logo todos os posts devem ser escritos nesse formato. É uma maneira simples de formatar `texto` para `html`, mantendo uma padronização que pode facilitar futuras mudanças de plataforma.

## Opções do Cabeçalho

O único campo obrigatório é `title`; contudo, existem opções que devem ser informadas para adicionar informações do autor do Post.

* `author` - O nome do Autor.
* `authorURL` - Alguma URL que pode estar associada ao autor: Twitter, GitHub, Facebook, etc.
* `authorFBID` - O Facebook Profile ID é usado para obter um foto de perfil do autor.
* `authorImageURL` - Uma URL com a imagem do autor (Obs: Se ambos forem usados `authorFBID` e `authorImageURL`, `authorFBID` terá preferência. Não inclua `authorFBID` se você quer usar `authorImageURL`.)
* `title` - Título do Post.

## Resumo do Post

O uso da tag `<!--truncate-->` marca em seu post o texto que irá representar o resumo do post, quando o post for exibido na listagem de postagens recentes. Qualquer texto acima da tag `<!--truncate-->` fará parte do resumo. Por exemplo:

```yaml
---
title: Exemplo Resumo
---

Todo esse texto fará parte do resumo do Post.

Inclusive isto.

<!--truncate-->

Mas qualquer texto abaixo da tag não será incluido.

Como isto.

Ou isto.
```

## Submetendo um Post

Como forma de manter a gestão de conteúdo do Blog, foi criado um processo de Pull Request dentro do [Projeto NXP](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NXP). Isso permitirá a revisão do conteúdo antes da publicação, enriquecendo o processo de compartilhamento e evitando possíveis quebras de funcionamento do Blog.

### Criando um Pull Request.

Você pode criar um Post diretamente no TFS, basta acessar o [Repositório do NXP](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/_git/NXP?path=%2Fwebsite%2Fblog&version=GBmaster) e criar um Pull Request.

Para fazer isso:

1.  Crie um arquivo MarkDown respeitando a formação de nome em `website/blog/2019-03-01-new-post.md`.
1.  Coloque o conteúdo no arquivo, respeitando o template mencionado no texto acima
1.  Visualize o conteúdo, confira se está de acordo com o prentendido.
1.  Crie o Pull Request com uma boa descrição.

![PR](/img/create-pull-request.gif)

> Agora, após a aprovação do Pull Request, nosso Pipeline de CI irá gerar o novo Post, efeturá build no website e publicará uma cópia dele no servidor de publicação. 

```csharp
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