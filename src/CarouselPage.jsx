import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles/carousale.css";
const CarouselPage = () => {
  return (
    <Carousel infiniteLoop autoPlay interval={2000}>
      <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSDugGTO2QXfTjuAcO8aat5EhJ6053_xjTXD1d_0HrYmc1WUFCvn3qnLwk_T4vmODjqPs&usqp=CAU" />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src="https://ynet-pic1.yit.co.il/picserver5/wcm_upload/2021/06/01/ByxMLBIQqu/1111.JPG" />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src="https://www.idosport.co.il/wp-content/uploads/2021/04/Untitled-design.jpg" />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default CarouselPage;
