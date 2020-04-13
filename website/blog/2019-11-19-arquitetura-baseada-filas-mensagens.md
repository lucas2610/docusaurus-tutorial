---
title: Arquitetura baseada em filas e mensagens
author: Mauricio Kiniz
authorURL: https://www.linkedin.com/in/mauriciokiniz/
authorImageURL: https://media.licdn.com/dms/image/C4D03AQEsYuTa0TfimA/profile-displayphoto-shrink_800_800/0?e=1580342400&v=beta&t=YbkPLhIK2Nv_B5kDNI8HqbYPeOPHmO3iO9UqZXxUK6E
---

<figure>
    <img src="https://images.unsplash.com/photo-1462899006636-339e08d1844e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" class="img-blog"/>
</figure>

<br>
Sistemas modernos cada vez mais exigem a colaboração interna e externa com outros sistemas. Faz-se necessário que ele se integre com componentes internos e também com aplicações de terceiros coletando ou entregando informações.

<!--truncate-->

Alguns destes sistemas podem estar instalados localmente, outros na nuvem. De qualquer forma isto apenas demonstra a heterogeneidade de tantos sistemas de informação, a amplitude necessária que um arquiteto de sistemas precisa considerar na equação que começa com a recepção de uma requisição, a sua transformação em algo útil e no armazenamento desta informação para uso futuro.
Para atender a esta nova gama de sistemas, tornou-se necessário desenvolver uma nova forma de interação entre sistemas, uma abordagem que permitisse centrar o processo na colaboração entre sistemas e não mais em processos sequenciais e fortemente acoplados.

<figure>
    <img src="https://i.ibb.co/CsD55bP/Imagem1.png" class="img-blog" alt="Modelo padrão de sistema sem usar o QBSA" />
    <figurecaption> 
        <p>
            <i>Modelo padrão de sistema sem usar o QBSA</i>
        </p>
    </figurecaption>
</figure>

Assim surgiu o **QBSA – Queue-Based System Architecture**, uma abordagem que permite que sistemas distribuídos possam colaborar entre si. A maioria do trabalho executado nestes sistemas é realizada de maneira assíncrona e em processos realizados em segundo plano. 

Este tipo de arquitetura não é ideal para sistemas em tempo real que requerem respostas imediatas às requisições realizadas. Mas se adequadamente utilizada, os problemas com performance em sistemas de tempo real podem ser minimizados tornando-os quase imperceptíveis.

A estrutura essencial neste tipo de arquitetura são as **filas de mensagens**. As filas são a representação lógica do local onde as mensagens serão depositadas fisicamente. Fisicamente uma fila pode ser uma tabela no banco de dados ou um arquivo ou diretório em disco. As aplicações que gerenciam as filas são conhecidas como **Serviços de Enfileiramento de Mensagens** ou **Message Broker**.  

<figure>
    <img src="https://i.ibb.co/rMhkvvQ/Imagem2.png" class="img-blog" alt="Modelo que usa QBSA e Micro Serviços" />
    <figurecaption> 
        <p>
            <i>Modelo que usa QBSA e Micro Serviços</i>
        </p>
    </figurecaption>
</figure>

Mas quais os problemas de sistemas que não são QBSA e que com o uso do QBSA podem ser endereçados de maneira adequada? Normalmente são os seguintes:

- **Disponibilidade dos sistemas de terceiros**: O sistema a desenvolver não deve pressupor que os sistemas de terceiros, aos quais ele se integrará, estarão sempre aptos a responder na velocidade necessária e esperada. Se estas situações não forem tratadas adequadamente, o usuário do sistema será impactado diretamente.
- **Gargalos na camada de persistência**: Sistemas que imediatamente persistem informações de maneira física (em banco de dados, por exemplo). Quando o sistema de persistência se vê sobrecarregado de requisições, ele começa a afetar aqueles que o utilizam, gerando assim efeitos colaterais indesejáveis.

Os sistemas baseados em filas acarretam em novos desafios. Por não estarem limitados a fluxos sequenciais e lineares de processamento, mas de processos assíncronos e paralelos os seguintes desafios devem ser resolvidos:

- Como determinar se todos os processos de negócio foram executados de forma adequada e correta, visto que agora os processos não são mais executados de forma linear e sequencial
- Como garantir que quando um processo falha, ocorra o correto *rollback* ou retorno a uma situação estável do sistema, pois outros processos já podem ter executado e terem sido finalizados de forma adequada

## Camada de transporte de mensagens

A camada de transporte é o meio pelo qual são transferidas as mensagens do sistema emissor para o sistema receptor. O sistema emissor, após realizar as ações a ele designadas, deve assinalar que o processo por ele feito foi finalizado e que deve ter uma continuação em outro sistema ou módulo ao qual chamamos de sistema receptor.


<figure>
    <img src="https://i.ibb.co/4MDpFTy/Imagem3.png" class="img-blog" alt="Exemplo de QBSA" />
    <figurecaption> 
        <p>
            <i>Exemplo de QBSA</i>
        </p>
    </figurecaption>
</figure>

Os participantes de uma arquitetura QBSA são:

- **Request**: O processamento em uma arquitetura QBSA inicia com uma requisição feita pelo usuário ou através de uma mensagem.
- **Command**: Para comunicar de forma eficiente e segura o comando é serializado em uma mensagem. Uma mensagem define uma unidade de trabalho que deve ser feita por um sistema. Após isto a mensagem pode ser transmitida para a fila.
- **Live Queue**: A mensagem serializada é enviada a uma fila de processamento onde ela fica retida até o momento que ela possa ser capturada pelo sistema receptor e por ele ser processada. O ato de colocar a mensagem na fila se chama de *enqueue* e o ato de retirar ela da fila se chama *dequeue*. No conceito de fila as mensagens são retiradas na ordem em que elas foram inseridas, ou seja, FIFO (*First In e First Out*)
- **Worker**: As mensagens que estão na fila são capturadas através de um processo que fica constantemente monitorando ela. Este processo é chamado de *worker* e ele pode ser um *Windows Service* ou um *Daemon* no Linux. 
- **Message processor**: É a execução de uma unidade de trabalho bem definida. Um **message processor** forma uma bem definida *boundary of worker*. 
- **Dead Letter Queue**. É a fila para onde irão todas as mensagens que por alguma razão não conseguem ser processadas pelo *message processor*, apesar de todos os esforços que possam estar nele implementados para fazê-lo.  
- **Persistence** (*Database, File System*...): O trabalho efetuado pelo *message processor* é traduzido no armazenamento ou na persistência de informações em um meio físico
- **Query**. O usuário que efetuou uma *request* deve possuir a capacidade de inquerir o sistema em busca dos resultados oriundos do processamento de uma mensagem serializada.
- **Activity log**. É um log pormenorizado das ações realizadas no ciclo de execução dentro de uma arquitetura QBSA. Neste log estão informações de processamento normal e de exceções encontradas durante o ciclo de processamento.

O importante é que **todo este processo é assíncrono**. Removendo assim um tipo muito permissivo de acoplamento, “o acoplamento temporal”, que obriga um sistema esperar pelo processamento realizado pelo outro, travando assim recursos sistêmicos importantes.

Exemplos de Serviços de Enfileiramento de Mensagens são:

- Microsoft Message Queuing (MSMQ);
- Oracle Advanced Queuing (Oracle AQ);
- ActiveMQ (built on JMS, Java Message Service);
- RabbitMQ;
- ZeroMQ;
- Apache Kafka;
- IBM's WebSphere MQ.

Exemplos de Serviços de Enfileiramento de Mensagens na nuvem:

- Amazon Simple Queue Service (Amazon SQS);
- Windows Azure Queues.

## NServiceBus (NSB)

O *NServiceBus* é um produto ofertado ao mercado de desenvolvedores pela empresa Particular Software. Sua principal proposta é tornar transparente ao desenvolvedor o uso de Serviços de Enfileiramento de Mensagens de mercado, através do uso de pacotes Nuget acoplados ao *pipeline* padrão de processamento de mensagens do NSB.

O NSB atua principalmente como um *message processor* fazendo o interfaceamento entre a camada de transporte e a implementação da regra de negócio. Ele torna transparente a quem usa o NSB qual a camada de transporte que está sendo usado. Esta característica do produto o torna muito atraente, pois não transfere ao sistema as tecnicidades decorrentes de como uma determinada camada de transporte deve ser usado.

Principais características do NSB:

- O NSB implementa um *pipeline* de processamento que permite ao desenvolvedor interagir com as diversas etapas do processo de *enqueue* e *dequeue* de mensagens. Esta abordagem oferece *entrypoints* que podem ser usados para incrementar, alterar ou mesmo rejeitar mensagens antes ou depois delas serem enviadas ou recepcionadas pelo sistema. Seguindo esta premissa, o NSB se torna um *framework* extensível para construir sistemas distribuídos de forma mais escalável e resiliente.
- O NSB juntamente com a capacidade de tornar transparente o acesso a camada de transporte, permite que sejam criadas regras de roteamento de mensagens para as filas de destino.  Por padrão o roteamento é realizado pelo *type* ou *namespace* das classes criadas no C#. Permite ainda fazer o direcionamento diretamente a uma fila, mas isto tem de ser comandado pelo sistema emissor.
- O NSB implementa em seu *pipeline* processos de recuperação a falhas, torna-o tolerante a processos que lançam exceções de forma consciente ou inconsciente (por exemplo um *NullReferenceException*). Ele efetua a recuperação a falhas em dois níveis de atuação:
    - De forma imediata, executando novamente a mesma mensagem de forma consecutiva, conforme parametrização realizada.
    - De forma postergada, executando novamente a mesma mensagem após um período de tempo designado em parametrização.
- O NSB permite ainda que as mensagens enviadas tenham uma validade temporal. Existem casos onde uma mensagem, após certo período de tempo torna-se completamente inócua ao processamento desta mensagem. O NSB permite que a mensagem, uma vez enviada, tenha atrelada a ela esta variável temporal e no processo de *dequeue*, o próprio NSB já descarta a mensagem, sem a necessidade do sistema receptor se preocupar com isto.
- O NSB em seu *pipeline* padrão permite apenas dois direcionamentos para o término de uma mensagem após processada:
    - A mensagem foi corretamente processada e assim sendo é finalizada. Caso parametrizado, será enviada para uma fila de auditoria.
    - A mensagem, após todas as recuperações de falha terem sido executadas e mesmo assim não conseguiu ser processada pelo sistema receptor, será transferida para uma fila de erro ou *dead letter queue*.   
- O NSB suporta o *hosting* dos *message processors* que são chamados no conceito do NSB como *Endpoints*. Dentre eles:
    - Windows Service hosting
    - Docker container hosting
    - Send-only hosting
    - Web hosting
    - Service Fabric hosting
    - Multi-hosting 
- O NSB efetua a varredura de DLLs a procura de construções usadas pelo NSB em busca de configurações e de elementos de processamento

Acima estão descritas algumas das principais características oferecidas pelo NSB. Existem mais recursos e a cada nova versão liberada são disponibilizadas mais e mais recursos.

## Conclusão

O modelo atual de software requerido pelos clientes modernos tende a ser um modelo fortemente integrado, seja ele com funcionalidades básicas, específicas e com funcionalidades de outros softwares através de integração na nuvem ou mesmo com softwares instalados localmente. Este modelo exige que a escalabilidade e a resiliência a falhas sejam fatores primordiais destes softwares. Neste contexto, o uso de QBSA faz todo o sentido, visto que ele foi criado para suprir este tipo de demanda de construção de software. 