import dynamic from 'next/dynamic';

const LoveAnimation = dynamic(() => import('@/components/love-draw/LoveAnimation'),{ ssr: false });

const LoveAnimationPage = () => {
  return (
    <LoveAnimation
      texts={['i love you', 'you are my sunshine', 'forever & always']}
      cycleInterval={7}
    />
  );
}

export default LoveAnimationPage;