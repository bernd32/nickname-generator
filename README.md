# nickname-generator
Данный скрипт является примером использования на практике алгоритма случайного выбора элементов массива с учётом веса. 
Nickname-generator генерирует случайные слова (никнеймы) на основе случайных букв английского (латинского) алфавита. 
Если мы просто будем брать случайные буквы и составлять их них слова, то они будут выглядеть неестественно и неприглядно. 
Примеры: 

- srjxdq
- moyssj
- ywtckmw
- wjvzw
- xtwey 

и т.д. 

Как видим, такой подход не позволяет нам генерировать слова, которые хотя бы отдалённо напоминали обычные - получается просто набор бысмысленных букв. 
Чтобы придать словам натуральность и "человечность", нам нужно сделать как минимум две вещи:

1) Исключить появление более двух гласных/согласных при генерировании слова. Данная задача является тривиальной и ее не имеет смысла рассматривать. 
2) Подбирать случайные буквы для слова с учётом их веса. Весами в данном случае будут являться частотность букв в английском языке. 
Таким образом мы должны уменьшить/увеличить шанс того, что определенная буква попадёт в наше генерируемое слово, и таких редко используемых 
букв, как, например, Q, Z и X будут встречаться в наших словах гораздо реже, чем E, T, A, O, I, которые по статистике являются самыми частыми в английских словах. 

Используя всего два этих подхода, мы генерируем гораздо более натуральные "слова". Примеры:

- haetise
- earyn
- sayuri
- oathe
- aulnelo
- ureon
- reirgas
- theele 

и т.д. 

## Алгоритм выбора случайных элементов массива на основе весов в JS
Относительно простой имплементацией подобного алгоритма является преобразование ряда рациональных чисел s1 (массива), являющимися весами для элементов, в ряд чисел s2, который
получается посредством кумулятивного сложения чисел: 

![equation](https://latex.codecogs.com/svg.image?S_{n}\Rightarrow&space;S_{cumulative}&space;=&space;\sum_{i=0}^{n}a_{i}&plus;(a_{i-1}\vee&space;0))