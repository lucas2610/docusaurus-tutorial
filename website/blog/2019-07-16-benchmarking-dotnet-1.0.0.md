---
title: Medindo a Performance do seu Código
author: Hugo Estevam Longo
authorURL: http://twitter.com/hugoestevam
authorFBID: 100000388917811
---

![abc](https://i.ibb.co/vHvgFfp/undraw-speed-test-wxl0.png)

**Um desafio comum de programação é como gerenciar a complexidade em torno do desempenho do código - uma pequena alteração pode ter um grande impacto no desempenho.**

<!--truncate-->

Me inspirei a escrever esse post sobre performance depois de, recentemente, participar de conversas sobre como melhorar o desempenho das nossas aplicações aqui na NDD. O objetivo por trás desse post, é mostrar como poderíamos usar o [BenchmarkDotNet](https://benchmarkdotnet.org/index.html) para entender um pouco melhor a nossa base de código já existente.

No último projeto que participei, adotamos o uso do Application Insights (teremos um post no futuro) para monitorar o desempenho da aplicação em tempo de execução no servidor de produção - e isso funciona bem.

Porém, esses monitoramentos dos *Requests* só me fornecem resultados granulados - se as saídas dos *Requests* começarem a mostrar lentidão, terei que pesquisar mais o código para descobrir o problema. Neste ponto, ferramentas como [ANTS](https://www.red-gate.com/products/dotnet-development/ants-performance-profiler/) ou [dotTrace](https://www.jetbrains.com/profiler/) são realmente boas para encontrar os gargalos - mas mesmo com elas (que são pagas), estou reagindo a um problema, ao invés de evitá-lo.

Gostaria de receber um feedback mais imediato. Gostaria de poder realizar *micro-benchmarks* em relação ao código antes e depois de fazer pequenas alterações, e saber imediatamente se fiz uma implementação melhor ou pior. Felizmente, acompanhando o que a comunidade tem usado nesse sentido, encontramos o BenchmarkDotNet para nos ajudar com isso.

É importante salientar que isso não é [Premature Optimisation](https://stackoverflow.com/questions/385506/when-is-optimisation-premature) - é sobre como posso ter uma compreensão mais profunda da performance do código que escrevi. Além disso, se você não sabe se seu código está lento ou não, como você pode argumentar que há alguma *Premature Optimisation*?


## Um exemplo simples
Vamos ver um exemplo simples - digamos que eu tenha um site que mostra os preços no Mercado de Ações, uma funcionalidade garantida nesse site é um gráfico que mostre a Média Móvel Simples (SMA - Simple Moving Average).

Uma média móvel simples (SMA) é uma média móvel aritmética calculada pela adição de preços de fechamento recentes e dividida pelo número de períodos de tempo na média do cálculo. Uma média móvel simples, ou aritmética, é calculada ao adicionar o preço de fechamento da ação por vários períodos e, em seguida, dividir esse total pelo mesmo número de períodos. As médias de curto prazo respondem rapidamente às mudanças no preço do subjacente, enquanto as médias de longo prazo demoram a reagir.

A fórmula para SMA é:

<figure>
    <img src="https://i.ibb.co/fSX6w3t/Anota-o-2019-07-12-094735.png"  width="260" class="img-blog" alt="SMA Formula" />
    <figurecaption> 
        <p>
            <i>Fórmula SMA</i>
        </p>
    </figurecaption>
</figure>

> PRINCIPAIS DESCOBERTAS
> - O SMA é um indicador técnico para determinar se o preço de um ativo continuará ou reverterá para uma tendência de alta ou baixa.
> - O SMA é calculado como a média aritmética do preço de um ativo em determinado período.
> - O SMA pode ser aprimorado como uma média móvel exponencial (EMA) que pesa mais fortemente a ação recente do preço.

A título de ilustração, vamos visualizar abaixo, um gráfico das ações da *Microsoft Corporation* (MSFT) em um determinado período. Observe que o gráfico contém uma linha vermelha que apresenta o SMA de todo o período.

<figure>
    <img src="https://cdn.schaeffersresearch.com/images/default-source/schaeffers-cdn-images/2016/05/intraday/msft-daily-chart.jpg?sfvrsn=0"  width="660" class="img-blog" alt="SMA MSFT" />
    <figurecaption> 
        <p>
            <i>Fonte: Schaeffers Research.</i>
        </p>
    </figurecaption>
</figure>

Um exemplo prático, dentro da nossa realidade de desenvolvimento, seria a aplicação do algoritmo de SMA em uma listagem de páginas impressas de uma determinada empresa. Com isso, seria possível representar de maneira gráfica se a empresa está em uma tendência de alta ou baixa no número de impressões.

### Apresentando a Solução

Como você pode ver na imagem abaixo, já [temos um projeto de exemplo](https://tfs.nddigital.com.br/tfs/NDD-PDICollection/NDK/_git/BenchmarkDotNet-Samples) com o código mínimo, para ilustrar o uso do método que calcula o SMA. Claro, que esse tipo de exemplo ficaria dentro de uma enorme biblioteca financeira, entretanto, para fins de demonstração da biblioteca *BenckmarkingDotNet* não faria diferença compará-la exatamente da mesma maneira como faremos aqui.

<figure>
    <img src="https://i.ibb.co/DRTnhQf/Solution-Benchmarking.png"  width="260" class="img-blog" alt="Solução" />
    <figurecaption> 
        <p>
            <i>Solução de Exemplo</i>
        </p>
    </figurecaption>
</figure>

Na solução de exemplo temos dois projetos para rodarmos o *benchmark*. O primeiro projeto, chamado **CalculatePrice** contém as classes necessárias para rodar o calculo SMA. Já o segundo projeto, chamado **CalculatePrice.Test.Benchmarking** é um projeto do tipo *Console* que contém as classes e arquivos para rodar os testes unitários e também para rodar os métodos de *benckmark*. 

Vamos olhar rapidamente para a classe que implementa os dois métodos que calculam o SMA, porém implementado de maneira diferente. Ambos os métodos calculam o SMA recebendo uma lista com preços históricos e o número de períodos dessa lista, e retornarão uma lista com objetos que contém o SMA para cada um dos dias. O primeiro método usa os recursos do *System.Linq*, que através dos métodos *Skip()* e *Take()*, agrupa os valores para em seguida chamar o método *Average()* que obtém a média de valores daquele conjunto de dados. O segundo método, ao invés de usar *System.Linq* para calcular o SMA, usa um loop interno que resume os valores usando apenas *List* e *array* para realizar a execução.

```csharp
public class SimpleMovingAverage
{
    /// <summary>
    /// Calcula o SMA de uma lista de valores históricos, usando recursos do System.Linq
    /// </summary>
    /// <param name="Prices">Lista de Valores históricos</param>
    /// <param name="SMALength">Número de Periodos</param>
    /// <returns>Lista com o Resumo dos Valores já calculados</returns>
    public static List<Quote> CalculateSMALinq(List<HistoricalValue> Prices, int SMALength)
    {
        List<Quote> retVal = new List<Quote>();
        for (int i = 0; i < Prices.Count() - SMALength + 1; i++)
        {
            var firstSmaLengthItems = Prices.Skip(i).Take(SMALength);
            var firstAvg = firstSmaLengthItems.Average(n => n.Close);
            retVal.Add(new Quote { Date = firstSmaLengthItems.Last().Date, Value = firstAvg });
        }

        return retVal;
    }

    /// <summary>
    /// Calcula o SMA de uma lista de valores históricos, com List e Array
    /// </summary>
    /// <param name="Prices">Lista de Valores históricos</param>
    /// <param name="SMALength">Número de Periodos</param>
    /// <returns>Lista com o Resumo dos Valores já calculados</returns>
    public static List<Quote> CalculateSMA(List<HistoricalValue> Prices, int SMALength)
    {
        List<Quote> retVal = new List<Quote>();
        decimal[] buffer = new decimal[SMALength];
        var current_index = 0;
        for (int i = 0; i < Prices.Count; i++)
        {
            buffer[current_index] = Prices[i].Close / SMALength;
            decimal ma = 0;
            for (int j = 0; j < SMALength; j++)
            {
                ma += buffer[j];
            }

            if (i >= SMALength - 1)
                retVal.Add(new Quote() { Value = ma, Date = Prices[i].Date });
            current_index = (current_index + 1) % SMALength;
        }
        return retVal;
    }
}
```

## Usando o BenchmarkDotNet

Quando criamos um Teste Unitário do nosso código, criamos um projeto de testes para alocar as classes e métodos dedicados a este fim. Da mesma forma, queremos que os métodos que fazem o *benchmark* do código fiquem em um projeto separado. Neste caso, vamos colocar tanto os Testes Unitários quanto os métodos de *benchmark* em um mesmo projeto Console. 

Precisaremos referenciar nesse projeto, através do Nuget, a biblioteca [BenchmarkDotNet](https://www.nuget.org/packages/BenchmarkDotNet/). Com ela, podemos decorar o método que está sendo examinado usando o atributo [Benchmark] e usá-lo para medir o desempenho do código.

> DEFINIÇÃO:
> Benchmarking is really hard (especially microbenchmarking), you can easily make a mistake during performance measurements. [BenchmarkDotNet](https://benchmarkdotnet.org/) will protect you from the common pitfalls (even for experienced developers) because it does all the dirty work for you: it generates an isolated project per each benchmark method, does several launches of this project, run multiple iterations of the method (include warm-up), and so on. Usually, you even shouldn’t care about a number of iterations because BenchmarkDotNet chooses it automatically to achieve the requested level of precision.

Para disponibilizar esse atributo em seu projeto, é preciso incluir um pacote nuget no projeto de testes usando o código abaixo no Console do Package Management:

```bash
> Install-Package BenchmarkDotNet
```

O código para rodar o *Benchmark* está na classe **CalculateSMABenchmark** apresentado no código abaixo - como você pode ver, não mudou muito em relação aos testes unitários - apenas uma referência de biblioteca extra e um atributo diferente que decora o método que queremos executar.

```csharp
public class CalculateSMABenchmark
{
    static List<HistoricalValue> _histicalPrices;

    public CalculateSMABenchmark()
    {
        HistoricalPriceReader reader = new HistoricalPriceReader();
        _histicalPrices = reader.GetHistoricalQuotes("MSFT").ToList();
    }

    [Benchmark]
    public void CalculateWithLinq()
    {
        var linqres = SimpleMovingAverage.CalculateSMALinq(_histicalPrices, 14);
        Debug.WriteLine(linqres.Count);
    }

    [Benchmark]
    public void CalculateWithNonLinq()
    {
        var res = SimpleMovingAverage.CalculateSMA(_histicalPrices, 14);
        Debug.WriteLine(res.Count);
    }
}
```

Analisando o código dessa classe, percebemos que há um construtor que faz o carregamento da lista de preços históricos (neste caso há um arquivo CSV com os valores das Ações da Microsoft nos últimos anos) para que possamos passar esses dados para as duas implementações de SMA que será feito o *Benchmark*. Para que o *BenchmarkDotNet* entenda que existem métodos a serem executados, precisamos adicionar o atributo **[Benchmark]** em cada método que será aplicado o *benchmarking*.

É recomendável manter seu código de *benchmarking* de desempenho em um projeto separado (da mesma forma que mantem-se os testes de unidade em um projeto separado). Esse projeto normalmente é um Aplicativo de Console simples, com uma classe **Main** que se parece com o código abaixo:

```csharp
public class Program
{		
    static void Main(string[] args)
    {
        var summary = BenchmarkRunner.Run<CalculateSMABenchmark>();
    }
}
```

Percebe-se no código acima, que a classe *BenchmarkRunner* é chamada na execução do método *Main* para executar a classe que contém os métodos que serão executados na análise de performance.

Para rodar o projeto, deve-se utilizar o comando **Ctrl + F5**, pois ele não irá funcionar em modo de Depuração. Também é possível executar este aplicativo de console, através de um Terminal e o **BenchmarkDotNet** apresentará alguns resultados de experimentos na tela, como os abaixo.
 
<figure>
    <img src="https://i.ibb.co/vkxZCmg/Bench-01.png"  width="660" class="img-blog" alt="Bench01" />
    <figurecaption> 
        <p>
            <i>Tela contendo os resultados da execução</i>
        </p>
    </figurecaption>
</figure>

Basicamente, na execução do *Console*, o *BenchmarkDotNet* executa os métodos várias vezes, como uma fase de aquecimento e então nos diz quanto tempo os métodos levaram para executar. Observem na imagem acima, que o *BenchmarkDotNet* executou o **DefaultJob** para executar a análise usando o *.NET Core*, que é o *TargetFramework* desse projeto. Falaremos mais sobre *Jobs* ainda neste artigo.

Como resultado, o *Console* nos apresenta os dados de maneira tabular e mostra uma legenda que nos servirá de referência. Analisando o relatório, visualizamos imediatamente que a implementação com o *System.Linq* foi ligeiramente mais rápida. Temos os seguintes números apresentados, que claro, servirão como uma linha de base quando quisermos otimizar seu desempenho:

- **Mean**: Média de tempo (em milissegundos) em todas as execuções.
- **Error**: Intervalo de Confiança, só será exibido quando a execução não atingir níveis de precisão exigidos.
- **StdDev**: Desvio padrão de todas as execuções.

### Analisando o Consumo de Memória

O diagnóstico que vimos é apenas uma configuração padrão, que mostra o tempo de execução para os métodos de referência. Se quiser ir além nessa análise, podemos adicionar o diagnóstico de memória, através do atributo **[MemoryDiagnoser]** que deve ser atribuído na classe que contém os métodos de *benchmarking*. 

```csharp
[MemoryDiagnoser]
public class CalculateSMABenchmark
{
    [Benchmark]
    public void CalculateWithLinq() { ... }

    [Benchmark]
    public void CalculateWithNonLinq() { ... }
}
```

Após a execução, também veremos os resultados relacionados as métricas de uso da memória, para cada método de *benchmarking*, teremos quantos *kilobytes* os métodos de *benchmark* alocaram, e ainda melhor, também veremos a execução do *Garbage Collector (GC)*, mostrando no *heap* o número de alocações nas diferentes gerações.

<figure>
    <img src="https://i.ibb.co/DfNmyjx/Bench-02.png"  width="660" class="img-blog" alt="Bench02" />
    <figurecaption> 
        <p>
            <i>Tela contendo os resultados da execução, com alocação de memória</i>
        </p>
    </figurecaption>
</figure>

Então, olhando a imagem acima, imediatamente sabemos que o método que se baseou na implementação do *System.Linq*, alocou mais que o dobro de memória, mas ainda é mais rápido. Com esses resultados, podemos realizar outros tipos de teste, inclusive com quantidades maiores de execução, para compreendermos melhor os resultados dos *benchmarks*.

### Analisando Diferentes Runtimes

Para exemplificar melhor a análise de performance desse exemplo, o projeto **CalculatePrice**, que contém basicamente as classes que implementam o algoritmo SMA, está rodando na versão *.NET Standard 2,0*, ou seja, a DLL resultante desse projeto pode ser referenciada tanto em um projeto *.NET Framework 4.6.1*, quanto em um projeto *.NET Core*. Com isso, podemos configurar a execução do *BenchmarkDotNet* para que execute nesses dois contextos e nos apresente o resultado.

Para realizar essa análise, é preciso efetuar uma pequena adaptação no projeto **CalculatePrice.Test.Benchmarking**, este projeto precisa ter como alvo dois tipos de Framework: 

<figure>
    <img src="https://i.ibb.co/vsZqdhk/Project-Config.png"  width="550" class="img-blog" alt="Config" />
    <figurecaption> 
        <p>
            <i>Configuração do projeto para rodar .NET Framework e .NET Core</i>
        </p>
    </figurecaption>
</figure>

Feita a adequação na configuração do projeto, o próximo passo é adicionar dois novos atributos acima da classe de execução dos métodos de *Benchmark*. Esses atributos irão definir em qual *Runtime* a biblioteca *BenchmarkDotNet* irá executar a análise, nesse exemplo vamos usar **[ClrJob, CoreJob]**. 

```csharp
[ClrJob, CoreJob]
[MemoryDiagnoser]
public class CalculateSMABenchmark
{
    [Benchmark]
    public void CalculateWithLinq() { ... }

    [Benchmark]
    public void CalculateWithNonLinq() { ... }
}
```

Esses dois atributos pertencem a família *Jobs*, que basicamente descreve a configuração que seus *Benchmarks* irão rodar. Existe uma série de categorias de *jobs* que podem ser usadas para diferentes propósitos, como por exemplo, rodar os *Benchmarks* na plataforma **x86** ou **x64**. 

Nesse caso, estamos informando ao *Console* que execute a análise em **ClrJob (.NET Framework)** e também em **CoreJob (.NET Core)**. Com isso, a *engine* da biblioteca *BenchmarkDotNet* irá duplicar a execução dos métodos para atender os dois *Runtimes*. Vamos aos resultados:

<figure>
    <img src="https://i.ibb.co/VWpnxbz/Bench-03.png"  width="700" class="img-blog" alt="Bench03" />
    <figurecaption> 
        <p>
            <i>Tela contendo os resultados da execução, com alocação de memória em .NET Framework e .NET Core</i>
        </p>
    </figurecaption>
</figure>

Como podemos observar, com poucas linhas, fomos capazes de ramificar a execução da biblioteca em dois *Runtimes* diferentes. Um resultado muito importante aqui, é como a implementação do algoritmo SMA, baseada no *System.Linq* é extremamente lenta rodando no **ClrJob (.NET Framework)**, comparado com a outra implementação do método com o loop interno, que basicamente tem o mesmo desempenho em ambos os *Runtimes*. Se compararmos a implementação baseada em *System.Linq* rodando nos dois *Runtimes* veremos que os tempos de execução possuem uma diferença enorme, fruto de uma bela otimização que a equipe do .NET Core realizou. 

## Conclusões

Encontrar estes tipos de dados de performance, podendo fazer uma análise efetiva do código, sem o **BenchmarkDotNet** seria extremamente difícil, então acredito que por isso a biblioteca **BenchmarkDotNet** se mostra extremamente útil como ferramenta, presente no dia-a-dia do desenvolvedor. **BenchmarkDotNet** muda a discussão nas equipes de desenvolvimento em relação ao desempenho. Em vez de alterar código e esperar pelo melhor - ou pior, reagir a uma queda de desempenho inesperada que afeta os usuários - o *micro-benchmarking* passa a fazer parte do processo de desenvolvimento e ajuda os desenvolvedores a entender e atenuar problemas de código antes mesmo de serem enviados para um servidor de produção.

Um aspecto importante, que vale a pena ressaltar é que devemos sempre ter Testes Automatizados que garantem o mesmo funcionamento do algoritmo após as melhorias de performance. Sem isso, podemos ter casos de falsos positivos durante o nosso processo de melhoria. 

<figure>
    <img src="https://i.ibb.co/qCzqdRF/Test-results.png"  width="600" class="img-blog" alt="Test" />
    <figurecaption> 
        <p>
            <i>Testes Automatizados garantindo o funcionamento dos métodos.</i>
        </p>
    </figurecaption>
</figure>

Temos o desejo de automatizar esses *Benchmarks* dentro do nosso fluxo de *Continuous Integration*, possibilitando que toda alteração passe por uma verificação, que ateste que não houve queda de performance. Em breve teremos um post explicando como realizar isso em nossos projetos.

---
E você? Já usou a biblioteca **BenchmarkDotNet** para alguma análise de desempenho? Conte pra gente! Compartilhe suas experiências e práticas para discutirmos e fomentarmos aqui na empresa.

Quer compartilhar alguma experiência ou assunto sobre Boas Práticas de Desenvolvimento? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).
Até a próxima!