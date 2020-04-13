---
title: Exceções são Caras e Degradam o Desempenho
author: Hugo Estevam Longo
authorURL: http://twitter.com/hugoestevam
authorFBID: 100000388917811
---

![abc](https://i.ibb.co/0J5TQM6/undraw-financial-data-es63.png)

**Durante muito tempo aprendemos e, por vezes, ensinamos que disparar exceções de negócio era uma boa prática - conheça o grande impacto no desempenho dessa abordagem.**

<!--truncate-->

Seguindo na linha de posts que tratam do tema *Performance*, nesse artigo veremos uma outra forma de manipular as *BusinessExceptions* visando uma otimização de performance e melhoria na legibilidade do código. No final de 2017, junto ao time *DarkSide* tivemos uma experiência interessante com o tema **Exceptions vs Result**. Como o resultado foi positivo, desde o ano passado essa nova estrutura de retorno passou a fazer parte dos nossos [*Templates*](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/nddResearch-Seed-Core?path=%2F&version=GBmaster&_a=contents). É prudente, que através desse Blog, façamos uma explicação das motivações e principalmente, uma apresentação dos resultados.

O interesse no assunto surgiu logo após realizar a leitura da Série *Functional C#* do autor **Vladimir Khorikov** em seu [blog](https://enterprisecraftsmanship.com). Em um dos posts o autor fez uma provocação sobre qual era a melhor alternativa no controle de fluxo, disparar uma exceção de negócio ou retornar um objeto mais expressivo. Nesse mesmo post, ele disponibilizou um [Gist](https://gist.github.com/vkhorikov/7852c7606f27c52bc288) que continha a implementação de uma classe *Result*. A partir disso começamos a pesquisar mais sobre o tema, mas para que todos entendam, vamos ver algumas definições básicas primeiro.

## O que é uma Exceção?

Uma exceção é um evento que ocorre durante a execução de um programa que interrompe o fluxo normal de suas instruções.

## Tipos de Exceção

Podemos classificar exceções em dois tipos:

### Exceções Técnicas

Este tipo de exceção pode ser denominado como um evento de algo que deu errado, devido a erros técnicos. Se não tratados adequadamente, eles se propagam para falhas do aplicativo. Uma exceção técnica geralmente é derivada da Linguagem de programação utilizada, por exemplo em C# temos o *System.Exception* e em Java temos o *RuntimeException*, o que significa que são controladas pela própria estrutura da linguagem e são disparadas automaticamente quando ocorre um erro.

``` text
Exception in thread "main" java.lang.StackOverflowError
        at java.io.PrintStream.write(PrintStream.java:480)
        at sun.nio.cs.StreamEncoder.flushBuffer(StreamEncoder.java:104)
        at java.io.OutputStreamWriter.flushBuffer(OutputStreamWriter.java:185)
        at java.io.PrintStream.println(PrintStream.java:806)
        at StackOverflowErrorExample.recursivePrint(StackOverflowErrorExample.java:4)       
        ...
```
No texto acima, temos o exemplo mais clássico de exceção, uma saída com o log da exceção *StackOverFlow*, que inclusive deu nome ao maior site de dúvidas utilizado pelos programadores, o Stack Overflow - https://stackoverflow.com

### Exceções de Negócio

Estes são os eventos que foram criados por causa das regras de negócios. Eles impedem, de maneira proposital, que os usuários prossigam com determinada ação no sistema. Uma exceção de negócio é lançada quando uma regra de negócio em nosso aplicativo é violada. Essa forma de trabalho foi amplamente difundida ao longo dos anos, principalmente na comunidade de programadores que usam POO (Programação Orientada a Objetos).

``` csharp
public class Rocket {

  private int fuel;

  public void TakeOff() {
    if (this.fuel < 50) {
      throw new NotEnoughFuelException();
    }
    lockDoors();
    igniteThrusters();
  } 
}
```
Neste exemplo, o Foguete só decola se tiver combustível suficiente, isso é uma regra de negócio. Se não tiver combustível suficiente é lançada uma exceção com o nome muito intuitivo de *NotEnoughFuelException*.

## Como normalmente lidamos com Exceções

A maneira habitual, que encontramos nas maiorias dos projetos é o uso da palavra **throw** para o disparo da exceção de negócio no momento em que uma regra de negócio é infringida. Com isso, é necessário que na camada mais alta do fluxo de controle façamos uso de outras palavras chaves, que são as instruções **try** e **catch**.

``` csharp
public async Task SendNotification(string endpointUrl)
{
    try
    {
        HttpResponseMessage message = await _httpClient.PostAsync(endpointUrl);
        string response = await message.Content.ReadAsStringAsync();
        /* faz alguma coisa com a resposta */
    }
    catch (Exception ex)
    {
        throw new UnableToConnectToServerException(ex);
    }
}
...

// Em alguma camada do sistema
try
{
    await SendNotification(endpointUrl);
    MarkNotificationAsSent();
}
catch (UnableToConnectToServerException)
{
    MarkNotificationAsNotSent();
}
```

Esse fluxo de execução não linear pode se tornar uma bagunça muito rapidamente, porque é difícil rastrear todas as conexões existentes entre as instruções **throw** e **catch** . Não é de admirar que esse uso de exceções seja frequentemente equiparado a instruções **goto**. O que fica de reflexão é que exceções devem ser frequentemente tratadas, mas seguindo o próprio sentido do nome, raramente lançadas.

## Não use Exceções para o Controle de Fluxo

Exceções (em Java, C# e C ++) são como instruções **goto**, e como tal, elas podem ser usadas ​​para construir fluxos de controle. No exemplo de código acima, o status de envio de uma determinada notificação está sendo controlado através de exceções. Dessa forma, ao avaliarmos o método *SendNotification()* percebemos que ele viola o princípio [Principle Of Least Astonishment](http://wiki.c2.com/?PrincipleOfLeastAstonishment) (Princípio do Menor Espanto). Esse princípio afirma que o resultado da execução de alguma operação deve ser óbvio, consistente e previsível, com base no nome da operação e em outras pistas. Percebe-se no código que não temos clareza de onde e em qual camada o fluxo irá parar após a execução do **throw**, principalmente se esse método for chamado em vários locais. Teríamos que acessar esses métodos referenciados e verificar se eles tem o **try / catch** e em caso de ausência, subir a pilha de chamadas até encontrar o tratamento.

Sendo assim, o uso de **try / catch** para controle de fluxo cria um código que é:

* Caro de entender (porque precisamos de mais tempo para entendê-lo) e
* Caro de executar (porque a JVM ou CLR precisam criar um *StackTrace* para o bloco catch).

Em relação ao custo de execução, veremos nos tópicos abaixo o resultado.

## Result como alternativa ao Throw

Uma vez que entendemos a dificuldade que o uso indevido do disparo de *BusinessException* causam em nossos fluxos de trabalho, vamos ver uma alternativa.

### Estudo de Caso (Conta Bancária)

Para melhor demonstrar esse comparativo, foi adicionando no [Repositório de Benchmark](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/BenchmarkDotNet-Samples) dois novos projetos que implementam as duas formas de controle de fluxo. Esse projeto simula de maneira muito simples um controle de Conta Bancária, em que o Cliente consegue criar uma conta, realizar depósitos e por fim transferência entre contas. Vejamos um diagrama que exemplifica as possíveis camadas:

<figure>
    <img src="https://i.ibb.co/WttSknZ/Camadas-2019-08-29-163723.png"  width="660" class="img-blog" alt="Camadas" />
    <figurecaption> 
        <p>
            <i>Exemplo de divisão de camadas para o Estudo de Caso (Fonte: NLayered DDD)</i>
        </p>
    </figurecaption>
</figure>

O intuito do artigo não é explicar o funcionamento da arquitetura DDD, apenas demonstrar que existem classes responsáveis por pequenas partes do fluxo em diferentes camadas. Nesse exemplo teremos um *Serviço de Aplicação* responsável por orquestrar as chamadas do fluxo, teremos uma *Entidade de Domínio* responsável pela regra de negócio das operações de Saque e Depósito, também teremos um *Serviço de Domínio* que fará a operação de transferência entre duas contas, fazendo o Saque de uma e um Depósito na outra. Por fim, teremos um *Repositório* com a responsabilidade de fornecer os dados e persisti-los após o término das operações.

Em qualquer parte desse fluxo e em qualquer uma dessas classes existe a possibilidade de ocorrerem exceções, tanto técnicas quanto de negócio. Então, para exemplificar a diferença entre as abordagens, foram criados *namespaces* diferentes com uma implementação de classes com *Exception* e uma implementação das mesmas classes com *Result*. No projeto referenciado nesse artigo tem todas as implementações completas, mas para esse exemplo vamos focar em uma única classe, que é chamada no meio do fluxo.

```csharp
public class BankTransferService : IBankTransferService
{
    public void PerformTransfer(decimal amount, BankAccount originAccount, BankAccount destinationAccount)
    {
        if (originAccount.CanBeWithdrawed(amount))// check if customer have necessary credit and if this order not exceed de maximun order
        {
            //Domain Logic
            //Process: Perform transfer operations to in-memory Domain-Model objects        
            // 1.- Charge money to origin acc
            // 2.- Credit money to destination acc

            //Charge money
            originAccount.WithdrawMoney(amount, "TransactionFromMessage");

            //Credit money
            destinationAccount.DepositMoney(amount, "TransactionToMessage");
        }
        else
            throw new BusinessException(ErrorCodes.NotAllowed, "Bank Account Cannot Withdraw");
    }
}
```

No código acima, existe uma regra de negócio que valida a operação de Saque, verificando se existe saldo suficiente. Caso não tenha saldo, o sistema dispara uma exceção de negócio, desviando o fluxo para o ponto de tratamento. Percebam que não temos tratamento de exceção tanto no método *WithdrawMoney()* quanto *DepositMoney()*, que podem disparar exceções técnicas ou de negócio. Isso faria com que o fluxo fosse de uma *Entidade de Domínio* diretamente para o ponto de tratamento, que pode ser um *Serviço de Aplicação* ou até mesmo um *Controlador*.

Agora vamos avaliar a outra alternativa, a mesma classe implementada com retornos mais expressivos através da classe *Result*:

```csharp
public class BankTransferService : IBankTransferService
{
    public Result<Exception, Unit> PerformTransfer(decimal amount, BankAccount originAccount, BankAccount destinationAccount)
    {
        if (originAccount.CanBeWithdrawed(amount))// check if customer have necesary credit and if this order not exceed de maximun order
        {
            //Domain Logic
            //Process: Perform transfer operations to in-memory Domain-Model objects        
            // 1.- Charge money to origin acc
            // 2.- Credit money to destination acc

            //Charge money
            var resultWithDraw = originAccount.WithdrawMoney(amount, "TransactionFromMessage");

            if (resultWithDraw.IsSuccess)
            {
                //Credit money
                return destinationAccount.DepositMoney(amount, "TransactionToMessage");
            }
            else
                return resultWithDraw.Failure;
        }
        else
            return new BusinessException(ErrorCodes.NotAllowed, "Bank Account Cannot Withdraw");
    }
}
```
Nesse exemplo, modificamos o método *PerformTransfer* para que ele deixe de ser **void** (sem retorno) e passe a retornar um **Result<TFailure, TSuccess>**. Esse *Result* pode ser tanto um objeto de falha quanto um objeto de sucesso, como por exemplo **Result<Exception, BankAccount>**, sendo *Exception* um objeto que representa a falha e *BankAccount* um objeto que representa o sucesso da chamada. Percebam que agora, em caso de uma negação da regra de negócio, não é mais disparada uma exceção através do **throw**, passamos agora a retornar uma exceção através do **return**. Isso nos abre mais possíbilidades dentro do próprio fluxo, pois não somos mais lançados para o ponto de tratamento, agora o retorno de exceção é passado para a camada logo acima. Outro aspecto é que os métodos  *WithdrawMoney()* e *DepositMoney()* também não disparam exceção e isso nos possibilita realizar alguma ação dentro do próprio método acionador, algo que só seria possível na abordagem anterior através do uso de **try / throw** encadeados em todas as camadas.

### Implementação da Classe Result

Se você chegou até aqui, deve estar curioso para ver a classe *Result* e entender como chegamos na implementação dela. Como disse lá no início, foi o post do **Vladimir Khorikov** que despertou o interesse no assunto, e a primeira implementação que observamos foi a que ele fez em seu curso de programação funcional ([código está aqui](https://github.com/vkhorikov/CSharpFunctionalExtensions)). 

Outra implementação que avaliamos, foi uma lib chamada *[Tango](https://gabrielschade.gitbooks.io/tango-br/content/)*. Esse projeto é mantido por um brasileiro e tem implementações bem bacanas, o único detalhe é que ela é bem focada para melhorar a maneira como os desenvolvedores implementam os conceitos de programação funcional em C#. Programação Funcional (PF) tem seus benefícios, mas entendemos que misturar PF com POO pode gerar mais confusão do que ajuda.

Por fim, também olhamos a implementação do *Try*, mantido pelo [Elemar JR em seu próprio GitHub](https://github.com/ElemarJR/ElemarJR.FunctionalCSharp) como alternativa as duas anteriores. O grande benefício dessa implementação são os operadores implícitos, que facilitam muito o retorno das chamadas, uma vez que podemos retornar dois tipos diferentes, informados previamente na declaração de retorno e o compilador irá entender e fazer a conversão implicitamente. Essa dupla possibilidade de retorno também é possível com *[System.Tuple](https://docs.microsoft.com/pt-br/dotnet/api/system.tuple?view=netframework-4.8)*, entretanto não há uma forma facilitada de verificar qual dos retornos foram passados. O fato é que essa implementação, tem como origem motivações de auxílio para Programação Funcional, portanto, a classe está carregada de conceitos funcionais, muitas vezes nos obrigando a programar dessa forma.

O que fizemos então, foi pegar a implementação que mais nos agradou, adaptar a nomenclatura para melhorar o entendimento e remover conceitos funcionais que poderiam atrapalhar a adoção. Com isso, chegamos no resultado abaixo:

```csharp
public struct Result<TFailure, TSuccess>
{
    public TFailure Failure { get; internal set; }
    public TSuccess Success { get; internal set; }

    public bool IsFailure { get; }
    public bool IsSuccess => !IsFailure;

    public Option<TFailure> OptionalFailure => IsFailure ? Some(Failure) : None;

    public Option<TSuccess> OptionalSuccess => IsSuccess ? Some(Success) : None;

    internal Result(TFailure failure)
    {
        IsFailure = true;
        Failure = failure;
        Success = default(TSuccess);
    }

    internal Result(TSuccess success)
    {
        IsFailure = false;
        Failure = default(TFailure);
        Success = success;
    }

    public TResult Match<TResult>(
            Func<TFailure, TResult> failure,
            Func<TSuccess, TResult> success
        )
        => IsFailure ? failure(Failure) : success(Success);

    public Unit Match(
            Action<TFailure> failure,
            Action<TSuccess> success
        )
        => Match(ToFunc(failure), ToFunc(success));

    public static implicit operator Result<TFailure, TSuccess>(TFailure failure) => new Result<TFailure, TSuccess>(failure);

    public static implicit operator Result<TFailure, TSuccess>(TSuccess success) => new Result<TFailure, TSuccess>(success);

    public static Result<TFailure, TSuccess> Of(TSuccess obj) => obj;

    public static Result<TFailure, TSuccess> Of(TFailure obj) => obj;
}
```

Acima temos a classe principal, mas existem outras que você pode ver no [*Projeto de Template*](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/nddResearch-Seed-Core?path=%2F&version=GBmaster&_a=contents) ou também no [*Projeto de Benchmark*](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/BenchmarkDotNet-Samples) que falerei abaixo.

## Melhorando a Performance

Mas e a performance?

No projeto de referência foram criados dois métodos: **[AccountsWithException()](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/BenchmarkDotNet-Samples?path=%2F02-ExceptionVsResult%2FExceptionVsResult.Test.Benchmark%2FExceptionVSResult.Benchmark.cs&version=GBmaster&line=28&lineStyle=plain&lineEnd=28&lineStartColumn=1&lineEndColumn=44)** e **[AccountsWithResult()](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/BenchmarkDotNet-Samples?path=%2F02-ExceptionVsResult%2FExceptionVsResult.Test.Benchmark%2FExceptionVSResult.Benchmark.cs&version=GBmaster&line=94&lineStyle=plain&lineEnd=94&lineStartColumn=1&lineEndColumn=41)**. O primeiro é reponsável por chamar a estrutura de classes que usam *Exception* para controle de fluxo. Já por sua vez, o segundo método chama uma estrutura de classes que usa o *Result* como forma de controle.

Em ambos, foram organizadas na seguinte sequência de chamada:
1. São feitas três chamadas para criar três contas diferentes. Uma delas irá falhar.
2. Nas contas criadas com sucesso, são depositados 500 reais.
3. Também nas contas criadas com sucesso, são feitas duas transferências em que somente uma delas terá sucesso, a outra terá saldo insuficiente.

Se você tiver dúvidas em como rodar um Benchmark como esse, acesse o [post anterior](http://nxp.nddigital.local/blog/2019/07/16/benchmarking-dotnet-1.0.0.html) que tem uma explicação sobre isso. Bem, vamos aos resultados!!!

``` ini
// * Summary *
BenchmarkDotNet=v0.11.5, OS=Windows 10.0.18362
Intel Core i5-7200U CPU 2.50GHz (Kaby Lake), 1 CPU, 4 logical and 2 physical cores
.NET Core SDK=2.2.202
  [Host]     : .NET Core 2.2.3 (CoreCLR 4.6.27414.05, CoreFX 4.6.27414.05), 64bit RyuJIT
  Job-BQGPHF : .NET Core 2.2.3 (CoreCLR 4.6.27414.05, CoreFX 4.6.27414.05), 64bit RyuJIT

IterationCount=30  LaunchCount=3  WarmupCount=10  

```
|                Method |      Mean |     Error |   StdDev | Rank |  Gen 0 |  Gen 1 | Gen 2 | Allocated |
|---------------------- |----------:|----------:|---------:|-----:|-------:|-------:|------:|----------:|
| AccountsWithException | 61.739 us | 0.4292 us | 1.116 us |    2 | 0.2441 | 0.1221 |     - |   1.64 KB |
|    AccountsWithResult |  8.329 us | 0.3869 us | 1.039 us |    1 | 0.2060 | 0.0534 |     - |   1.27 KB |

``` ini
// * Legends *
  Mean      : Arithmetic mean of all measurements
  Error     : Half of 99.9% confidence interval
  StdDev    : Standard deviation of all measurements
  Median    : Value separating the higher half of all measurements (50th percentile)
  Rank      : Relative position of current benchmark mean among all benchmarks (Arabic style)
  Gen 0     : GC Generation 0 collects per 1000 operations
  Gen 1     : GC Generation 1 collects per 1000 operations
  Gen 2     : GC Generation 2 collects per 1000 operations
  Allocated : Allocated memory per single operation (managed only, inclusive, 1KB = 1024B)
  1 us      : 1 Microsecond (0.000001 sec)
```

Nesse Benchmark foi configurado 3 ciclos de execução, com o número de 30 iterações em cada ciclo e 10 chamadas de Warmup (aquecimento). Dessa forma, podemos garantir que o resultado é muito preciso. Essa execução foi configurada para medir o tempo (em forma de média) e também fazer um diágnóstico em relação ao consumo de memória.

Podemos ver nos resultados da tabela acima, que o método *AccountsWithResult()* é práticamente **8 VEZES MAIS RÁPIDO** que o método *AccountsWithException()*. Além disso, durante a execução das chamadas, também percebe-se que o método *AccountsWithResult()* usa **25% MENOS MEMÓRIA** que o método *AccountsWithException()*.

Para demonstrar de forma mais clara o tamanho dessa diferença, utilizei os dados de saída desse Benchmark como fonte de dados do *RScript.exe* (Executável da Linguagem R). Ele tem um mecanismo de geração de gráficos bem avançado. As saídas obtidas são apresentadas abaixo:

<figure>
    <img src="https://i.ibb.co/ryK51Rk/Exception-Vs-Result-Test-Benchmark-Exception-VSResult-Benchmark-barplot.png"  width="660" class="img-blog" alt="Gráfico" />
    <figurecaption> 
        <p>
            <i>Diferença entre as chamadas em Microsegundos.</i>
        </p>
    </figurecaption>
</figure>

Também é possível ver o histórico de execução de cada uma das chamadas, acompanhando o tempo que cada iteração levou em todas as etapas.

<figure>
    <img src="https://i.ibb.co/6Ydr9Zm/Exception-Vs-Result-Test-Benchmark-Exception-VSResult-Benchmark-Accounts-With-Result-facet-Timeline-Smooth.png"  width="660" class="img-blog" alt="Gráfico" />
    <figurecaption> 
        <p>
            <i>Disposição dos tempos de execução do método AccountsWithResult().</i>
        </p>
    </figurecaption>
</figure>

<figure>
    <img src="https://i.ibb.co/Gx7wM3m/Exception-Vs-Result-Test-Benchmark-Exception-VSResult-Benchmark-Accounts-With-Exception-facet-Timeline-Smooth.png"  width="660" class="img-blog" alt="Gráfico" />
    <figurecaption> 
        <p>
            <i>Disposição dos tempos de execução do método AccountsWithException().</i>
        </p>
    </figurecaption>
</figure>

Esse é um pequeno exemplo de como uma mudança na forma habitual de trabalho, pode trazer benefícios bem impactantes. Se projetarmos essa melhoria em cenários de 10M de chamadas por dia, como temos acompanhado em alguns produtos, certamente teremos uma melhoria muito significativa na performance do produto em relação a tempo de execução e consumo de memória.

---
E você? Já usou a classe **Result** para melhorar o controle de fluxo no seu projeto? Conte pra gente! Queremos em breve disponibilizar um pacote **Nuget** com essas classes e  suas experiências são muito importantes para nós.

Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).
Até a próxima!