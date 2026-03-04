import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bajajBikes = [
  {
    name: 'Pulsar N250',
    image: 'https://cdn.bajajauto.com/-/media/images/bajajauto/bikes-container/pulsar-n250.webp'
  },
  {
    name: 'Avenger 220 Cruise',
    image: 'https://cdn.bajajauto.com/-/media/images/bajajauto/bikes-container/avenger-220-cruise.webp'
  },
  {
    name: 'Platina 100',
    image: 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/webp_images/platina-100/platina-100/platina-100.webp'
  },
  {
    name: 'CT 110X',
    image: 'https://cdn.bajajauto.com/-/media/images/bajajauto/bikes-container/ct-110x.webp'
  },
  {
    name: 'Dominar 400',
    image: 'https://cdn.bajajauto.com/-/media/images/bajajauto/bikes-container/dominar-400.webp'
  },
  {
    name: 'Pulsar NS200',
    image: 'https://cdn.bajajauto.com/-/media/images/bajajauto/bikes-container/pulsar-ns200.webp'
  },
  {
    name: 'Freedom CNG',
    image: 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/freedom-2024/bikes/mv_red.webp'
  },
  {
    name: 'Pulsar N125',
    image: 'https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/web-header-navigator-images/pulsar-n125.webp'
  }
];

const tvsBikes = [
  {
    name: 'TVS iQube',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/tvsiQUBE.webp?v=1723108204'
  },
  {
    name: 'TVS Ronin',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TVS_Ronin_c999c752-8d51-4294-aec7-c6b06ca90605.webp?v=1723108183'
  },
  {
    name: 'TVS Bike',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/Group_1_1.jpg?v=1765733324'
  },
  {
    name: 'TVS Apache',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsApache.webp?v=1723108229'
  },
  {
    name: 'TVS Model',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/M_A_1_1000x290_d11597e2-9340-4d04-be38-c5ba9c4490ea.webp?v=1754026832'
  },
  {
    name: 'TVS Jupiter 110',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/tvsJupiter_110_23c2e4e2-d9e9-472d-b03e-7b57961f6bda.webp?v=1765532548'
  },
  {
    name: 'TVS Ntorq',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsNtorq.webp?v=1723109515'
  },
  {
    name: 'TVS Raider',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsRaider.webp?v=1723109543'
  },
  {
    name: 'TVS Radeon',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsRadeon.webp?v=1723109571'
  },
  {
    name: 'TVS Pep',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsPep.webp?v=1723109604'
  },
  {
    name: 'TVS Sport',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsSport.webp?v=1723109638'
  },
  {
    name: 'TVS Star City',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsStarcity.webp?v=1723109669'
  },
  {
    name: 'TVS Victor',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsVictor.webp?v=1723109686'
  },
  {
    name: 'TVS Zest',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TvsZest.webp?v=1723109797'
  },
  {
    name: 'TVS Bike Model',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/6_ee13ac61-21ec-48c8-8a25-602366d64e45.jpg?v=1745232991'
  },
  {
    name: 'TVS Apache N597',
    image: 'https://shop.tvsmotor.com/cdn/shop/files/TVS_Apache_N597_Website_Adapts_Shop_by_model_page-1000x290.webp?v=1760071707'
  },
  {
    name: 'TVS Select Model',
    image: 'https://imgd.aeplcdn.com/1280x720/n/bw/models/colors/tvs-select-model-black-kick-1669637007517.png'
  }
];

const heroBikes = [
  {
    name: 'Hero Xtreme 250R',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/xtreme_250r.png'
  },
  {
    name: 'Hero Glamour X',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/glamour-x-navigation.png'
  },
  {
    name: 'Hero Splendor Plus Xtec 2.0',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/splendorplus_xtec_2.0.png'
  },
  {
    name: 'Hero HF 100',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/hf-100.png'
  },
  {
    name: 'Hero HF Deluxe',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/hf-deluxe-new.png'
  },
  {
    name: 'Hero Xtreme',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/xtreme-new-05.png'
  },
  {
    name: 'Hero Glamour',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/glamour.png'
  },
  {
    name: 'Hero Glamour Xtec',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/glamour-xtec.png'
  },
  {
    name: 'Hero Super Splendor Xtec',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/super-splendor-xtec.png'
  },
  {
    name: 'Hero Xtreme 160R 4V Combat',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/xtreme160R-4v-combat.png'
  },
  {
    name: 'Hero Xtreme 160R',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/xtreme_160r.png'
  },
  {
    name: 'Hero Xpulse 200 4V',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/motorcycles/xpulse-200-4v.png'
  },
  {
    name: 'Hero Mavrick',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/premia/Mavrick.png'
  },
  {
    name: 'Hero Harley X440',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/premia/Harleyx440bike-.png'
  },
  {
    name: 'Hero Destini 110',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/destini-110-web.png'
  },
  {
    name: 'Hero Xoom 160',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/xoom_160.png'
  },
  {
    name: 'Hero Destini 125 ZX+',
    image: 'https://www.heromotocorp.com/content/dam/hero-commerce/in/en/products/scooters/content-fragments/new-destini-125/assets/web/compare-variants/destini_125_zx+.svg'
  },
  {
    name: 'Hero Xoom 125',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/xoom_125.png'
  },
  {
    name: 'Hero Destini Prime',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/destini-prime.png'
  },
  {
    name: 'Hero Xoom 110',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/xoom-110.png'
  },
  {
    name: 'Hero Pleasure Plus Xtec',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/brand/hero-homepage/bike/scooters/Pleasure-plus-xtec-nav.png'
  },
  {
    name: 'Hero Vida Electric',
    image: 'https://media.vidaworld.com/is/image/heromotocorp/vX2-plus%20(1)?fmt=webp&fmt=webp-alpha'
  }
];

const hondaBikes = [
  {
    name: 'Honda Shine 100',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/Shine-100/Shine-100/Desktop/EMI-Calculator/EMI-Calculator.png?h=638&iar=0&w=1038'
  },
  {
    name: 'Honda Livo',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2Flivo%2Faccessories%2Flivo-accessories.png%3Fh%3D810%26iar%3D0%26w%3D1920&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda SP 125',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/sp-125/EMI-Calculator/EMI-Calculator.png?h=638&iar=0&w=1038'
  },
  {
    name: 'Honda CB 125',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/CB-125/Calculator/EMI-Calculator-CB125.png?h=638&iar=0&w=1038'
  },
  {
    name: 'Honda SP 160',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/sp-160/emi/master-bike.webp?h=638&iar=0&w=1038'
  },
  {
    name: 'Honda Hornet 2.0',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/Horent-20/Desktop/EMI-Calculator/EMI-Calculator.png?h=638&iar=0&w=1038'
  },
  {
    name: 'Honda Shine 100 DX',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/shine-100-dx/Banner/57076b6e-c407-4edc-bd8e-7e123a5da12c.png?h=824&iar=0&w=1920'
  },
  {
    name: 'Honda Bike Model',
    image: 'https://www.honda2wheelersindia.com/adobe/dynamicmedia/deliver/dm-aid--e4b2a3d9-5968-4a20-a755-ca3a284bb0cd/banner-1280-640-1-revised.jpg?width=1600&preferwebp=true&quality=85'
  },
  {
    name: 'Honda SP 125 SE',
    image: 'https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/motorcycle/SP125-special-edition/get-to-know/sp125-end-pages_584_450-know-your-ride.png?h=1875&iar=0&w=2434'
  },
  {
    name: 'Honda CB300R',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2FCB300R%2Fget-to-know-your-ride%2Fdlx-pro.png%3Fh%3D675%26iar%3D0%26w%3D876&w=1920&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda NX500',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2Fnx500%2FAccessories%2FaccesoriesNX500.png%3Fh%3D810%26iar%3D0%26w%3D1920&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda Transalp',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2Ftransalp%2FAccessories%2FAccessories-1400x994.png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda Hornet 2.0',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2FHornet-2%2FAccessories-1400x994.png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda CB350',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2FCB350%2FDesktop%2FAccessories%2FAccessories-1400x994-(1).png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda Hornet 750',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2FHornet-750%2FDesktop%2FAccessories%2FAccessories-1400x994.png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda Bike',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2FAccessories-1400x994.png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  },
  {
    name: 'Honda Goldwing',
    image: 'https://www.honda2wheelersindia.com/_next/image?url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2FGoldwing-New%2FDesktop%2FAccessories%2FAccessories-1400x994.png%3Fh%3D994%26iar%3D0%26w%3D1400&w=2580&q=75&dpl=dpl_Eo3Vy4wpCjtNHyMZiBgyzAPCZVKi'
  }
];

export default function BikeShowcase() {
  const [selectedBrand, setSelectedBrand] = useState('bajaj');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const bikes = 
    selectedBrand === 'bajaj' ? bajajBikes : 
    selectedBrand === 'tvs' ? tvsBikes :
    selectedBrand === 'hero' ? heroBikes :
    hondaBikes;

  const nextBike = () => {
    setCurrentIndex((prev) => (prev + 1) % bikes.length);
  };

  const prevBike = () => {
    setCurrentIndex((prev) => (prev - 1 + bikes.length) % bikes.length);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setCurrentIndex(0);
  };

  return (
    <div className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-6">
            Premium Motorcycles
          </h2>
          
          {/* Brand Toggle */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
            <Button
              onClick={() => handleBrandChange('bajaj')}
              className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                selectedBrand === 'bajaj'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105 border-0'
                  : 'bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50'
              }`}
            >
              Bajaj
            </Button>
            <Button
              onClick={() => handleBrandChange('tvs')}
              className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                selectedBrand === 'tvs'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105 border-0'
                  : 'bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-red-600 hover:bg-red-50'
              }`}
            >
              TVS
            </Button>
            <Button
              onClick={() => handleBrandChange('hero')}
              className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                selectedBrand === 'hero'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg scale-105 border-0'
                  : 'bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-orange-600 hover:bg-orange-50'
              }`}
            >
              Hero
            </Button>
            <Button
              onClick={() => handleBrandChange('honda')}
              className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                selectedBrand === 'honda'
                  ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg scale-105 border-0'
                  : 'bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-red-700 hover:bg-red-50'
              }`}
            >
              Honda
            </Button>
          </div>
          
          <p className="text-slate-600 text-sm md:text-base">
            Genuine spare parts available for all models
          </p>
        </div>

        <div className="relative glass-effect rounded-3xl p-6 md:p-12 glow-effect">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border-2 border-bajaj-blue/20"
            onClick={prevBike}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-bajaj-blue" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border-2 border-bajaj-blue/20"
            onClick={nextBike}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-bajaj-blue" />
          </Button>

          {/* Bike Display */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {bikes.map((bike, index) => (
                <div key={index} className="min-w-full flex flex-col items-center justify-center px-4 md:px-12">
                  <div className="relative w-full max-w-4xl">
                    {/* Glow effect behind bike */}
                    <div className="absolute inset-0 bg-gradient-to-r from-bajaj-blue/20 via-bajaj-maroon/20 to-bajaj-blue/20 blur-3xl opacity-50"></div>
                    
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-auto object-contain relative z-10 drop-shadow-2xl"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient mt-6 md:mt-8">
                    {bike.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {bikes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-bajaj-blue w-6 md:w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-sm md:text-base text-slate-600 font-medium">
            {currentIndex + 1} / {bikes.length}
          </div>
        </div>
      </div>
    </div>
  );
}