---
title: Aprendizado de Máquina, dando nome aos bois 
author: Renan Nunes Steinck
authorURL: https://www.linkedin.com/in/renan-nunes-steinck-682b8b15a/
---

![abc](https://i.ibb.co/h2jfzgB/undraw-surveillance-kqll.png)

**Hoje em dia muito se ouve falar nessas três palavrinhas mágicas: Inteligência Artificial, *Machine Learning* e *Deep Learning*. O intuito desse primeiro artigo é botar os pingos nos i's, definir nomenclaturas e entender um pouquinho de cada uma delas.**

<!--truncate-->

# Inteligência Artificial

Bom, vamos começar por **Inteligência Artificial** (também conhecida como IA). As definições mais comuns são:

> - *"Um ramo da ciência da computação que trabalha com a simulação de comportamento inteligente em computadores"*;
> - *"A capacidade de uma máquina imitar a inteligência humana"*;
> - Fonte: [Merriam-Webster](https://www.merriam-webster.com/dictionary/artificial%20intelligence) 

Mas o que eles querem dizer com isso? Não vou entrar no mérito do que é ou não inteligência, porque levaria horas escrevendo e não chegaríamos em nenhuma conclusão, mas podemos definir **IA** como **a área do conhecimento que estuda a capacidade de uma máquina imitar comportamentos humanos**.
<figure>
    <img src="https://hips.hearstapps.com/digitalspyuk.cdnds.net/16/25/1466681434-robot-falling.gif"  width="400" class="img-blog" alt="Robô caindo ao tentar abrir uma porta." />
    <figurecaption> 
        <p>
            <i>Robô imitando perfeitamente o comportamento humano às 3h da manhã</i>
        </p>
    </figurecaption>
</figure>

# *Machine Learning*

Já ***Machine Learning*** (*ML*), é uma sub-área da inteligência Artificial e  pode ser descrito como: **capacidade de uma máquina de realizar buscas, encontrar padrões, aprender estes padrões, planejar e realizar induções**. Quando falamos de *Machine Learning* começamos a falar de algoritmos, ou seja, processos sequenciais de ações que nos permitem prever, agrupar ou classificar informações. 

A resolução de problemas através de *Machine Learning* é bastante diferente da metodologia que estamos acostumados. Vou fazer uma analogia: imagine que nós, programadores, somos chefes de cozinha. Nós temos uma receita (código). Essa receita precisa de ingredientes (entradas), certo? Através da execução do passo a passo da receita, nós produzimos um prato de comida (saída).

Com *ML*, o processo é um pouco diferente. Através de um prato pronto e os ingredientes, nós produzimos a receita. Ou seja, através das saídas desejadas e as entradas que tivemos, a máquina será capaz de gerar um código que realiza aquela execução. ~~Bem louco né?~~
Abaixo coloquei uma imagem para vocês entenderem melhor.

<figure>
    <img src="https://i.ibb.co/1ryzsLd/imagem-2.png"  width="500" class="img-blog" alt="Formas de resolver problemas computacionalmente, modelo clássico e modelo através de Machine Learning" />
    <figurecaption> 
        <p>
            <i>Metodologia através de programação vs Aprendizado de máquina</i>
        </p>
    </figurecaption>
</figure>

As "entidades" responsáveis por gerar o código são chamadas de **[Modelos de Predição](https://en.wikipedia.org/wiki/Predictive_modelling)**.  Eles nada mais **são que modelos matemáticos e estatísticos** que descrevem a relação entre variáveis independentes e a saída. Existem diversos modelos que se adequam a tipos diferentes de problemas, por exemplo, problemas em que há pouco ou muitos dados, problemas para predição numérica, agrupar elementos similares, etc.

# *Deep Learning*

Já o famoso ***Deep Learning*** nada mais é do que uma sub-área de *Machine Learning* que utiliza redes neurais artificiais. Em uma forma resumida, significa que em vez de ter apenas um modelo matemático, há várias camadas de algoritmos, cada um tendo uma interpretação diferente dos dados inseridos.   

O funcionamento de uma rede neural artificial pode ser descrita da seguinte forma: Quando nós temos uma entrada, cada característica dessa entrada é processada por um neurônio, esses neurônios vão ajustando os pesos (importância) dessas características, esses valores são reajustados a cada camada que ela passa. **Isso torna uma rede neural artificial capaz de fazer a seleção das melhores características e posteriormente realizar a predição**.    

No processo de desenvolvimento de um sistema de predição com *Machine Learning*, a seleção de características é um processo realizado por um humano, demandando conhecimento do contexto, análises manuais das características, grupos e valores. 

Essa característica traz **vantagens e desvantagens** para o *Deep Learning*, a **vantagem** é que **temos a capacidade de automatizar processos** e possivelmente **conseguir resultados melhores em nossas predições**. A **desvantagem** é que o **processo se torna muito mais complexo** de desenvolver (necessitando um bom conhecimento de matemática) e os **nossos algoritmos se tornam específicos** para aquele determinado problema, sendo necessário refazer a rede neural artificial para usar em outros problemas. 

A escolha entre desenvolver um algoritmo de predição com *Machine Learning* ou *Deep Learning* se dá através das características e complexidades do problema. Abaixo vou deixar duas listinhas descrevendo as características de cada um deles. 
|*Machine Learning*|*Deep Learning*|
|--|--|
|  Bons resultados com pequenos conjuntos de dados | Requer uma quantidade significativa de dados |
|  Rápido de treinar modelos | Computacionalmente intenso |
|  Precisa testar características diferentes com algoritmos diferentes para conseguir os melhores resultados | Aprende características e classificadores automaticamente |
|  Precisão é limitada | Precisão é ilimitada |

   
> *"Mas Renan, se esses troços são tão mágicos assim, por que não usamos isso sempre?!*". 

Porque existem problemas que não podem ser, ou que não valem a pena ser resolvidos com Inteligência Artificial. A imagem abaixo é uma excelente representação dos **[Tipos de Aprendizado](https://lamfo-unb.github.io/2017/07/27/tres-tipos-am/)** ~~vale um artigo separado só para esse cara~~ e problemas que podem ser resolvidos através de *ML*.  

<figure>
    <img src="https://i.ibb.co/3hxGgPs/imagem-3.jpg"  width="600" class="img-blog" alt="Representação dos tipos de aprendizado e suas aplicações" />
    <figurecaption> 
        <p>
            <i>Ramos dos tipos de aprendizado de máquina</i>
        </p>
    </figurecaption>
</figure>

Bom, para não me estender demais, vou terminar este artigo por aqui, mas fica aqui o *TL;DR*:

 - **Inteligência Artificial** é uma área do conhecimento que estuda a capacidade de reproduzir comportamentos inteligentes (humanos).
 
 - ***Machine Learning*** é uma sub-área de IA constituída de modelos matemáticos. Fáceis de construir, porém, com etapas manuais e resultados inferiores. 
 
 - ***Deep Learning*** é uma sub-área de ML, constituída de redes neurais artificiais que tornam o processo de desenvolvimento mais complexo, mas alcança resultados melhores.   
 
 - Os problemas solucionáveis através de IA são limitados.  


<figure>
    <img src="https://i.ibb.co/bBpJLyX/image.png"  width="500" class="img-blog" alt="Diagrama de Venn representando as subáreas de inteligência artificial" />
    <figurecaption> 
        <p>
            <i>Visão geral das subáreas de Inteligência Artificial</i>
        </p>
    </figurecaption>
</figure>


Quer compartilhar alguma experiência ou assunto sobre Inteligência Artificial? Escreva um artigo para o [NXP](http://nxp.nddigital.local/docs/get-started.html).

Até a próxima!