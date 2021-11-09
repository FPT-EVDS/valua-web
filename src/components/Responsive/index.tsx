import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default class Responsive extends Component {
  render() {
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024, 
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <img src="https://picsum.photos/id/1018/120/100" alt="huy" />
          </div>
          <div>
            <img src="https://picsum.photos/id/1015/120/100" alt="huy" />
          </div>
          <div>
            <img src="https://picsum.photos/id/1016/120/100" alt="huy" />
          </div>
          <div>
           <img src="https://picsum.photos/id/1023/120/100" alt="huy" />
          </div>
          <div>
            <img src="https://picsum.photos/id/1018/120/100" alt="huy" />
          </div>
          <div>
            <img src="https://picsum.photos/id/1019/120/100" alt="huy" />
          </div>
          <div>
            <img src="https://picsum.photos/id/1028/120/100" alt="huy" />
          </div>
          <div>
           <img src="https://picsum.photos/id/1021/120/100" alt="huy" />
          </div>
        </Slider>
      </div>
    );
  }
}