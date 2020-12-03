import * as constants from '../../data/constants';

export default class Card {
  constructor(templateNumber) {
    this.template = document.getElementsByTagName('template')[
      templateNumber
    ];
    this.dataWord = null;
    this.audioFile = null;
    this.cardDiv = null;
    this.cardFrontSide = null;
  }

  createCard(object) {
    const cardTemplate = this.template.content.cloneNode(true);
    this.cardDiv = cardTemplate.querySelector('.card');
    this.audioFile = cardTemplate.querySelector('audio');
    this.image = cardTemplate.querySelector('.card__front-side img');
    this.cardFrontSide = cardTemplate.querySelector('.card__front-side');
    this.rotateIcon = cardTemplate.querySelector('.rotate-icon');
    this.dataWord = object.word;

    this.image.setAttribute('src', `../assets/${object.image}`);

    cardTemplate
      .querySelector('.card__back-side img')
      .setAttribute('src', `../assets/${object.image}`);

    this.audioFile.setAttribute('src', `../assets/${object.audioSrc}`);

    cardTemplate.querySelector('.card__title--eng').textContent = object.word;
    cardTemplate.querySelector('.card__title--rus').textContent = object.translation;

    this.rotateIcon.addEventListener('click', (e) => {
      e.target.closest('.card__inner').classList.add('flipped');
    });

    this.cardDiv.addEventListener('mouseleave', () => {
      if (document.querySelector('.flipped')) {
        document.querySelector('.flipped').classList.remove('flipped');
      }
    });

    this.trainHandlerListener = (e) => this.trainHandler(e);
    this.gameHandlerListener = (e) => this.gameHandler(e);
    this.addEvent();

    return cardTemplate;
  }

  trainHandler(e) {
    e.stopPropagation();
    this.playAudioEl();
    this.triggerStatEvent(constants.STATISTICS_EVENTS.train);
  }

  triggerStatEvent(statisticsField) {
    const statistics = new CustomEvent(
      constants.CUSTOM_EVENT_NAME.statistics,
      {
        detail: {
          word: this.dataWord,
          statisticsField,
        },
        bubbles: true,
      },
    );
    document.body.dispatchEvent(statistics);
  }

  gameHandler(e) {
    const cardClick = new CustomEvent(constants.CUSTOM_EVENT_NAME.cardClick, {
      detail: {
        dataWord: this.dataWord,
      },
      bubbles: true,
    });
    e.target.dispatchEvent(cardClick);
  }

  playAudioEl() {
    const isAudioPlaying = !this.audioFile.ended && this.audioFile.currentTime > 0;
    if (isAudioPlaying) {
      return;
    }
    this.audioFile.currentTime = 0;
    this.audioFile.play();
  }

  addFade() {
    this.cardDiv.classList.add('fade');
  }

  removeFade() {
    this.cardDiv.classList.remove('fade');
  }

  removeEvent() {
    this.cardFrontSide.removeEventListener(
      'click',
      this.trainHandlerListener,
    );
    this.cardDiv.addEventListener('click', this.gameHandlerListener);
  }

  removeGameEvent() {
    this.cardDiv.removeEventListener('click', this.gameHandlerListener);
  }

  addEvent() {
    this.cardFrontSide.addEventListener('click', this.trainHandlerListener);
    this.removeGameEvent();
  }
}
