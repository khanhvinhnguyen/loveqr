import LoveAnimation from '@/components/love-draw/LoveAnimation';

const LoveAnimationPage = () => {
  return (
    <LoveAnimation
      texts={['i love you', 'you are my sunshine', 'forever & always']} // mảng câu
      cycleInterval={7}   // 7 giây đổi câu
    />
  );
}

export default LoveAnimationPage;