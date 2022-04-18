# nickname-generator
Данный скрипт является примером использования на практике алгоритма случайного выбора элементов массива с учётом их веса. 

В данном случае практикой будет являться генерирование случайных слов (никнеймов) на основе букв английского (латинского) алфавита. 


Начнём для начала с самого простого подхода. Если мы просто будем брать случайные буквы и составлять их них слова, то они будут выглядеть неестественно и неприглядно. 
Примеры: 

- srjxdq
- moyssj
- ywtckmw
- wjvzw
- xtwey 

и т.д. 

Как видим, такой подход не позволяет нам генерировать слова, которые хотя бы отдалённо напоминали обычные - получается просто набор бессмысленных букв, который больше походит на пароли. 
Чтобы придать словам натуральность и "человечность", нам нужно сделать как минимум две вещи (на мой взгляд):

1) Исключить появления более двух гласных/согласных при генерировании слова. Данная задача является тривиальной и ее не имеет смысла рассматривать. 
2) Подбирать случайные буквы для слова с учётом их веса. Весами в данном случае будут являться частотность букв в английском языке. 
Таким образом мы должны уменьшить/увеличить шанс того, что определенная буква попадёт в наше генерируемое слово, и таких редко используемых 
букв, как, например, Q, Z и X будут встречаться в наших словах гораздо реже, чем E, T, A, O, I, которые по статистике являются самыми частыми в английских словах. 

Используя всего два этих подхода, мы генерируем гораздо более натуральные "слова". Примеры:

![screenshot_0.png](https://github.com/bernd32/nickname-generator/blob/main/screenshots/screenshot_0.png?raw=true)

## Алгоритм выбора случайных элементов массива на основе весов в JS
Относительно простой имплементацией подобного алгоритма является преобразование ряда рациональных чисел s1 (массива), являющимися весами для элементов, в ряд чисел s2, который
получается посредством кумулятивного сложения чисел: 

![equation](https://latex.codecogs.com/gif.image?\dpi{110}\bg{white}S_{n}\Rightarrow&space;S_{cumulative}&space;=&space;\sum_{i=1}^{n}a_{i}&plus;(a_{i-1}\vee&space;0))

где `Sn` - это массив со значениями весов, `ai` - элементы этого массива. 

Разберём алгоритм по шагам на простейшем примере:
1) Создаём в качестве примера два массива ``items`` и ``weights``, где ``items`` - это элементы, которые будут выбираться случайно, а ``weights`` - это весы этих элементов:

```javascript
const items =   [ '🍌', '🍎', '🥕' ];

const weights = [  3,    7,    1  ];
```
2) Подготавливаем массив весов посредством кумулятивного сложения (то есть список ``cumulativeWeights``, который будет иметь то же количество элементов, что и исходный список весов ``weights``). 
В нашем случае такой массив будет выглядеть следующим образом: 

```javascript
cumulativeWeights = [3, 3 + 7, 3 + 7 + 1] = [3, 10, 11]
```

3) Генерируем случайное число `randomNumber` от `0` до самого высокого кумулятивного значения веса. В нашем случае случайное число будет находиться в диапазоне `[0..11]`. Допустим, что `randomNumber = 8`.

4) Проходим с помощью цикла по массиву `cumulativeWeights` слева направо и выбираем первый элемент, который больше или равен `randomNumber`. 
Индекс такого элемента мы будем использовать для выбора элемента из массива элементов.

Идея этого подхода заключается в том, что более высокие веса будут "занимать" больше числового пространства. Следовательно, существует более высокая вероятность того, что случайное число попадет в "числовое ведро" с более высоким весом.

Попробую наглядно показать это на нашем примере:

```javascript
const weights =           [3, 7,  1 ]; 

const cumulativeWeights = [3, 10, 11]; 

// В псевдопредставлении мы можем представить cumulativeWeights следующим образом: 

const pseudoCumulativeWeights = [ 

  1, 2, 3,                // <-- [3] числа 

  4, 5, 6, 7, 8, 9, 10,  // <-- [7] чисел 

11,                     // <-- [1] число 

]; 
```
Как видим, более тяжёлые весы занимают более высокое числовое пространство, а следовательно, имеют более высокий шанс быть случайно выбранными. Процентное соотношение шанса выбора для элементов `weights` будет таким:

Элемент `3`: ≈ 27%, 

Элемент `7`: ≈ 64%, 

Элемент `1`: ≈ 9%

В общем случае функция выглядит примерно так:
```javascript

function weightedRandom(items, weights) {
    if (items.length !== weights.length) {
        throw new Error('Массивы элементов и весов должны быть одинакового размера');
    }

    if (!items.length) {
        throw new Error('Элементы массива не должны быть пустыми');
    }
    const cumulativeWeights = [];
    for (let i = 0; i < weights.length; i += 1) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }

    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

    const randomNumber = maxCumulativeWeight * Math.random();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
            return items[itemIndex];
        }
    }
}
```

## Как можно еще лучше алгоритм генерации слов?

Данный скрипт является больше примером использования алгоритма выбора случайного элемента массива на основе их веса, поэтому я не 
стал сильно углубляться в лингвистику и алгоритмы искусственного интеллекта. Но навскидку сразу бросаются в глаза неприглядные комбинации некоторых гласных и согласных пар, которые выглядят неестественно и не встречаются в настоящих словах:
- satlenl
- tohhi
- tiowh
- aahepw

и т.д. 

Самым простым решением этого вопроса является ограничение на чередование более двух гласных/согласных слов:
```javascript
if (vowelCounter >= maxVowelsInRow) {
    i -= 1;
    continue;
}
```
и
```javascript
if (consonantCounter >= maxConsonantsInRow) {
    i -= 1;
    continue;
}
```
Пусть значения maxConsonantsInRow = 1 и maxVowelsInRow = 1, тогда сгенерированые слова будут выглядеть примерно так:

![screenshot_1.png](https://github.com/bernd32/nickname-generator/blob/main/screenshots/screenshot_1.png?raw=true)


Отмечу здесь, что th и ae являются диграмами, и считаются как одна буква. 

Очевидной минус данного подхода заключается в том, что сгенерированные слова получаются более однотипными и с гораздо меньшим вариативным потенциалом. 
