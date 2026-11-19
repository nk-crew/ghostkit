import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import repeatingLoop from '../../gutenberg/utils/swiper-loop';

Swiper.use(repeatingLoop('ghostkit-swiper'));
window.GhostKitSwiper = Swiper;
