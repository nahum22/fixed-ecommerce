import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles/carousale.css";
const CarouselPage = () => {
  return (
    <Carousel infiniteLoop autoPlay interval={2000}>
      <div>
        <img src="carousaleImages/image1.png" />
      </div>
      <div>
        <img src="carousaleImages/image2.png" />
      </div>
      <div>
        <img src="carousaleImages/image3.png" />
      </div>
    </Carousel>
  );
};

export default CarouselPage;
