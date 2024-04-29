import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  blocks = [
    {
      image: 'assets/assets/images/carousel/1.png',
      category: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!'
    },
    {
      image: 'assets/assets/images/carousel/2.png',
      category: 'Акция',
      title: 'Нужен грамотный <span>копирайтер </span>?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.'
    },
    {
      image: 'assets/assets/images/carousel/3.png',
      category: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!'
    },
  ];

  responsiveOptions;

  constructor() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {

  }

}
