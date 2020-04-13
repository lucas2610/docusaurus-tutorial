---
author: Felipe de Bona Sartor, Gustavo Marin Suppi, Renan Oliveira Zapelini
title: Performance na inserção e atualização de dados em lote
---

![abc](https://i.ibb.co/bbS4gX6/undraw-Memory-storage-reh0-1.png)

## Motivação
A busca por alternativas mais performáticas de inserção e atualização de dados na base foi iniciada devido a necessidade de inserir e atualizar entidades com grande quantidade de relações, o que levava um tempo acima da média, sendo assim começamos a busca pelo famoso *BulkInsert* para inserção de uma lista de entidades.

<!--truncate-->

## Pesquisas
Durante as pesquisas, encontramos várias iniciativas *OpenSource* que implementavam *BulkInsert* de maneira satisfatória, inclusive encontramos [um post no StackOverflow](https://stackoverflow.com/questions/5940225/fastest-way-of-inserting-in-entity-framework) em que os desenvolvedores apresentavam as performances dessas Libs, comparado com o modelo atual do Entity Framework, conforme imagem abaixo.

<figure>
    <img src="https://i.stack.imgur.com/AdWD3.png"  width="660" class="img-blog" alt="BulkInsert vs AddRange" />
    <figurecaption> 
        <p>
            <i>Fonte: StackOverflow.</i>
        </p>
    </figurecaption>
</figure>

Devido a inserção do EntityFramework, através do *SaveChanges()* ser feita um a um, os projeto que implementam *BulkInsert* tem como objetivo melhorar a performance na inserção ou atualização dos dados em lote. Com a utilização do conceito **BulkInsert** e **BulkUpdate** é possível trabalhar com grandes quantidades de dados para persistir em um banco de dados relacional, sendo fácil de usar e de integrar com projetos novos e legados.

## Porque Clonamos um Repositório
Um dos projetos que encontramos, que obteve um ótimo desempenho, não estava sendo atualizado a um bom tempo, ou seja, seu autor não estava mais dando atenção na manutenção do projeto.

Quando fizemos os primeiros testes com o código fonte [desse projeto no GitHub]( https://github.com/MikaelEliasson/EntityFramework.Utilities), nos deparamos com um problema de relacionamento, um bug, que não permitia a utilização do *BulkInsert* por não reconhecer o *schema* do nosso banco. Nesse momento, observamos que vários Pull Requests não haviam sido aprovados pelo autor do projeto e isso nos desencorajou a colaborar com essa iniciativa. Foi aí que tomamos a decisão de clonar e manter esse projeto internamente.

Foi então, que fizemos a portabilidade desse projeto para o nosso Git interno, fizemos a correção do bug e publicamos o projeto como um [pacote do Nuget](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_packaging?feed=NDDPackages&_a=feed), para que pudéssemos usar em nossas soluções. Comprovamos, que houve um ganho de performance muito alto no tempo de inserçao de dados na base, a métrica apresentada no projeto original mostrou que foi reduzido o tempo de 4 minutos para 12 segundos.

Obs.: As métricas mostram que o aumento de tempo de inserção continua consideravelmente baixo mesmo com a quantidade de dados aumentando de forma linear.

```text
-Batch iteration with 25 entities
Insert entities: 23ms
Update all entities with a: 4ms
delete all entities with a: 2ms
delete all entities: 1ms
-Standard iteration with 25 entities
Insert entities: 12ms
Update all entities with a: 6ms
delete all entities with a: 3ms
delete all entities: 7ms
-Batch iteration with 2500 entities
Insert entities: 47ms
Update all entities with a: 22ms
delete all entities with a: 5ms
delete all entities: 11ms
-Standard iteration with 2500 entities
Insert entities: 905ms
Update all entities with a: 46ms
delete all entities with a: 22ms
delete all entities: 552ms
-Batch iteration with 25000 entities
Insert entities: 281ms
Update all entities with a: 163ms
delete all entities with a: 18ms
delete all entities: 107ms
-Standard iteration with 25000 entities
Insert entities: 9601ms
Update all entities with a: 457ms
delete all entities with a: 250ms
delete all entities: 5895ms
-Batch iteration with 100000 entities
Insert entities: 1048ms
Update all entities with a: 442ms
delete all entities with a: 60ms
delete all entities: 292ms
```


## Começando
Para a utilização dos métodos **BulkInsert** e **BulkUpdate** é necessário referenciar a biblioteca nomeada: *ndd.EntityFramework.Extensions*.

Você pode fazer isso via CLI do Nuget:

```bash
Install-Package ndd.EntityFramework.Extensions
```

Ou, você pode instalar a dependência do pacote *ndd.EntityFramework.Extensions* no projeto via Visual Studio:

<figure>
    <img src="https://i.imgur.com/q7V9CBq.png"  width="660" class="img-blog" alt="Visual Studio" />
    <figurecaption> 
        <p>
            <i>Lembre que é preciso registrar o Feed do Package Management no seu VS.</i>
        </p>
    </figurecaption>
</figure>

Caso queira submeter alguma alteração, o projeto possui um repositório Git Central no TFS da NDD, disponível no link abaixo. Através da linha de comando do seu terminal, clone o repositório executando o seguinte comando:

```bash
git clone https://tfs.ndd.com.br/tfs/NDD-PDICollection/NDDResearch/_git/ndd.EntityFramework.Extensions
```

Obs.: Para executar os testes da solução é necessário ter o SQL CE 4.0 instalado. Link para download: https://www.microsoft.com/pt-br/download/details.aspx?id=17876

## Primeiros passos
Após realizar a instalação do pacote via Nuget, podemos escolher os pontos da aplicação que tem a necessidade de utilizar a rotina de *BulkInsert* e *BulkUpdate* nas operações em lote.


## 1. BulkInsert
É o método utilizado para inserir os registros em lote. Para utilizar o método **BulkInsert** deste projeto é necessário conter o *DataContext* da base de dados e o *DbSet* da entidade mapeada no *Entity Framework*. Esse método recebe como parâmetro uma lista de objeto, conforme descrito abaixo:

```csharp
    public void BulkInsert(List<T> data)
    {
        if (!data.Any())
            return;
        data.ForEach(x =>
        {
            if (x.Id == Guid.Empty)
                x.Id = GuidGenerator.NewId();
            x.InsertDate = DateTime.Now;
        });
        
        EFBatchOperation.For(DataContext, dbset).BulkInsert(data);
    }
```

A classe **EFBatchOperation** é responsável por injetar, através do método **For**, o contexto da base de dados **(Context, IDbSet<T>)**  utilizado pelo *Entity Framework*. O método **BulkInsert** recebe o parâmetro **(data)** que é a lista das entidade que serão inseridas na base de dados.

## 2.  BulkInsert com entidades relacionadas

Para adicionar registros em lote em tabelas relacionas **Many-to-Many**, onde a tabela não está mapeada nas configuraçoes do *Entity Framework* é necessário utilizar o método **BulkInsertSpecification**. Para isso é obrigatório criar um mapeamento **(De-Para)** para o *Entity Framework* entender que existe a tabela na base de dados e que deve inserir os registros em lote, utilizando o **BulkInsert**. 

Abaixo tem o exemplo do mapeamento e da utilização de uma classe.

**MAPEAMENTO:** Deve utilizar o atributo **EFBatchTableConfiguration** para mapear a *Entidade* correspondente ao **(De-Para)** da tabela do banco de dados, passando como parâmetro o nome do **Schema** e o nome da **Tabela** correspondente.

```csharp
    [EFBatchTableConfiguration("schemaName", "tableName")]
    public class EntityTableBulk
    {
        public Guid LeftRelationshipId { get; set; }
        public Guid RightRelationshipId { get; set; }
    }
```
**UTILIZAÇÃO:**

```csharp
    public void BulkInsert()
    {
        List<EntityTableBulk> entityTableBulkList = DeserializeEntityTableBulkDTO();
        Repository.Value.BulkInsertSpecification(entityTableBulkList);
    }
```

## 3. BulkUpdate
É o método utilizado para atualizar os registros em lote. Para utilizar o método **BulkUpdate** deste projeto é necessário conter o *DataContext* da base de dados e o *DbSet* da entidade mapeada no *Entity Framework*. Esse método recebe como parâmetro uma lista de objeto e as propriedades que serão atualizadas, conforme descrito abaixo:

```csharp
    public void BulkUpdate(List<T> data, params Expression<Func<T, object>>[] propsToUpdate)
    {
        if (!data.Any())
            return;
        EFBatchOperation.For(DataContext, dbset).BulkUpdate(data, x => x.ColumnsToUpdate(propsToUpdate));
    }
```

A classe **EFBatchOperation** é responsável por injetar, através do método **For**, o contexto da base de dados **(Context, IDbSet<T>)** utilizado pelo *Entity Framework*. O método **BulkUpdate** recebe o parâmetro **(data)** que é a lista do objeto **(List<T>)** e uma expressão **(params Expression<Func<T, object>>[])** para determinar as colunas que serão atualizadas, por exemplo:

```csharp
public void UpdateWithBulk(Guid idEntities) {
    List<Entities> entities = GetEntities(idEntities);
    
    entities.ForEach(entity => {
        entity.status = EntityStatus.Canceled;
    });
    
    EntitiesRepository.Value.BulkUpdate(entities, entity => entity.status);
}
```
---
E você? Tem usado alguma biblioteca de *Bulk* para melhorar o desempenho? Conte pra gente! Compartilhe suas experiências e práticas para discutirmos e fomentarmos aqui na empresa.

Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).
Até a próxima!